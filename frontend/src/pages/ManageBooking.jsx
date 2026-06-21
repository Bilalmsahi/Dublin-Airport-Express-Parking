import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import parkingImg from "../assets/parking.webp";
import ReschedulePopup from "../components/CustomerDashboard/ReschedulePopup";
import PayPopup from "../components/CustomerDashboard/PayPopup";
import CancelBookingModal from "../components/CustomerDashboard/CancelBookingModal";

const statusColors = {
  'Completed': '#28a745',
  'Confirmed': '#ffc107',
  'Cancelled': '#dc3545',
  'Payment Failed': '#dc3545',
  'Rescheduled': '#fd7e14',
  'Pending': 'gray',
  'Started': "#3552b1",
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const [date, time] = dateStr.split("T");
  const [year, month, day] = date.split("-");
  const timePart = time ? time.slice(0, 5) : "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}  ${timePart}`;
};

const ManageBooking = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState(null); // "expired" | "invalid"
  const [data, setData] = useState(null); // { booking, can_reschedule, departure_locked, ... }

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [payPopup, setPayPopup] = useState({ open: false, booking: null, extraAmount: null, newDep: null, newArr: null });
  const pendingRescheduleRef = useRef(null); // { newDep, newArr, extraAmount }

  useEffect(() => {
    if (!token) {
      setLinkError("invalid");
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/bookings/manage/booking/?token=${encodeURIComponent(token)}`
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setLinkError(body.error === "expired" ? "expired" : "invalid");
        } else {
          setData(body);
        }
      } catch (err) {
        setLinkError("invalid");
      }
      setLoading(false);
    };
    fetchBooking();
  }, [token]);

  const doGuestReschedule = async (departure_time, return_time) => {
    setRescheduleLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/manage/reschedule/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, departure_time, return_time }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || body.error || "Failed to reschedule booking.");
      setData(body);
      setRescheduleOpen(false);
      setPayPopup({ open: false, booking: null, extraAmount: null, newDep: null, newArr: null });
      pendingRescheduleRef.current = null;
      alert("Booking rescheduled successfully. You'll receive a confirmation email shortly.");
    } catch (err) {
      alert(err.message || "Failed to reschedule booking.");
    }
    setRescheduleLoading(false);
  };

  const handleExtraPaymentSuccess = async () => {
    const pr = pendingRescheduleRef.current;
    if (!pr) return;
    await doGuestReschedule(pr.newDep, pr.newArr);
  };

  const handleRescheduleSubmit = async ({ departure_time, return_time }) => {
    const booking = data.booking;
    const dayRate = Number(data.extension_day_rate) || 20;

    const prevDep = new Date(booking.departure_time);
    const prevArr = new Date(booking.return_time);
    const newDep = new Date(departure_time);
    const newArr = new Date(return_time);

    const prevDays =
      Math.floor(
        (prevArr.setHours(0, 0, 0, 0) - prevDep.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const newDays =
      Math.floor(
        (newArr.setHours(0, 0, 0, 0) - newDep.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const extraDays = newDays - prevDays;

    const statusName = booking.status?.name;
    if (
      ["Confirmed", "Rescheduled", "Started"].includes(statusName) &&
      extraDays > 0
    ) {
      const extraAmount = dayRate * extraDays;
      pendingRescheduleRef.current = { newDep: departure_time, newArr: return_time, extraAmount };
      setRescheduleOpen(false);
      setPayPopup({
        open: true,
        booking: { ...booking, departure_time, return_time },
        extraAmount,
        newDep: departure_time,
        newArr: return_time,
      });
      return;
    }

    await doGuestReschedule(departure_time, return_time);
  };

  const handleCancelConfirm = async () => {
    setCancelOpen(false);
    setActionLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/manage/cancel/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || body.error || "Failed to cancel booking.");
      setData(body);
      if (body.outcome === "no_refund") {
        alert("Your booking was cancelled. As it was cancelled within 72 hours of departure, no refund applies.");
      } else {
        alert("Your booking was cancelled. €15 cancellation fee will be deducted and the remaining amount will be refunded to your original payment method.");
      }
    } catch (err) {
      alert(err.message || "Failed to cancel booking.");
    }
    setActionLoading(false);
  };

  const booking = data?.booking;

  return (
    <>
      <Helmet>
        <title>Manage Booking - Dublin Airport Express Parking</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Banner */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-white text-center"
        style={{
          backgroundImage: `linear-gradient(120deg,rgba(1,6,89,0.68),rgba(40,144,205,0.38)),url(${parkingImg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          minHeight: "220px",
          width: "100%",
        }}
      >
        <h1 style={{ fontWeight: 700, textShadow: "0 2px 8px #073E4655" }} className="display-5 display-md-4">
          Manage Booking
        </h1>
        <h6 style={{ fontWeight: 400, textShadow: "0 2px 8px #073E4655" }} className="lead d-none d-sm-block">
          Reschedule or cancel your booking — no account needed.
        </h6>
      </div>
      <div className="container-fluid" style={{ backgroundColor: "#fff", minHeight: "60vh", padding: "40px 0" }}>
        <div
          className="col-12 col-lg-8 col-xl-6 mx-auto"
          style={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(40,144,205,0.10)",
            padding: "40px 25px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {loading ? (
            <div className="text-center py-5">
              <span className="spinner-border text-primary" />
              <p className="mt-3">Loading your booking...</p>
            </div>
          ) : linkError ? (
            <div className="text-center py-4">
              <h3 style={{ color: "#073E46", fontWeight: 700 }}>
                {linkError === "expired" ? "This link has expired" : "This link is not valid"}
              </h3>
              <p style={{ color: "#6c757d", maxWidth: 420, margin: "12px auto 24px" }}>
                {linkError === "expired"
                  ? "For your security, manage-booking links are only valid for 24 hours."
                  : "The link may be incomplete or incorrect. Please request a new one."}
              </p>
              <Link
                to="/manage-booking"
                className="btn"
                style={{
                  background: "linear-gradient(90deg, #75C24B 60%, #43a047 100%)",
                  border: "none",
                  fontWeight: 700,
                  borderRadius: "8px",
                  padding: "10px 28px",
                  fontSize: "1.1rem",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(40,144,205,0.10)",
                }}
              >
                Request a New Link
              </Link>
            </div>
          ) : booking ? (
            <>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
                <div>
                  <h2
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "bold",
                      color: "#073E46",
                      marginBottom: 0,
                      letterSpacing: "1px",
                    }}
                  >
                    Booking #{booking.booking_id || booking.id}
                  </h2>
                  <div style={{ color: "#6c757d", fontSize: "1rem" }}>
                    Hi {booking.first_name}, here are your booking details.
                  </div>
                </div>
                <span
                  className="status-pill"
                  style={{
                    background: statusColors[booking.status?.name] || "#ccc",
                    color: "#fff",
                    padding: "6px 18px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    boxShadow: "0 1px 6px rgba(40,144,205,0.10)",
                    display: "inline-block",
                    minWidth: 130,
                    textAlign: "center",
                    textTransform: "uppercase",
                    border: "2px solid #fff",
                  }}
                >
                  {booking.status?.name}
                </span>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded bg-light border h-100">
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Service</div>
                    <strong style={{ color: "#073E46" }}>{booking.service_name}</strong>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded bg-light border h-100">
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Vehicle</div>
                    <strong style={{ color: "#073E46" }}>{booking.car_registration_no}</strong>
                    <span style={{ color: "#888" }}>
                      {" "}— {booking.car_model} {booking.car_colour}
                    </span>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded bg-light border h-100">
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Drop-Off (Departure)</div>
                    <strong style={{ color: "#073E46" }}>{formatDateTime(booking.departure_time)}</strong>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded bg-light border h-100">
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Pick-Up (Arrival)</div>
                    <strong style={{ color: "#073E46" }}>{formatDateTime(booking.return_time)}</strong>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded bg-light border h-100">
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Total</div>
                    <strong style={{ color: "#43a047", fontSize: "1.1rem" }}>
                      €{Number(booking.discounted_price) > 0 ? booking.discounted_price : booking.total_price}
                    </strong>
                  </div>
                </div>
                {Array.isArray(booking.add_ons) && booking.add_ons.length > 0 && (
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded bg-light border h-100">
                      <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Add-ons</div>
                      <strong style={{ color: "#073E46" }}>
                        {booking.add_ons.map((a) => a.name).join(", ")}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
              {!data.can_cancel && data.cancel_block_reason && (
                <div className="alert alert-secondary" style={{ fontSize: "0.98rem" }}>
                  {data.cancel_block_reason}
                </div>
              )}
              {data.can_cancel && !data.cancel_refund_eligible && (
                <div className="alert alert-warning" style={{ fontSize: "0.98rem" }}>
                  This booking is within 72 hours of departure — it can still be cancelled, but <b>no refund will be given</b>.
                </div>
              )}
              <div className="d-flex gap-2 flex-wrap justify-content-center mt-4">
                <button
                  className="minimal-action-btn"
                  style={{
                    background: "linear-gradient(90deg, #75C24B 60%, #43a047 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px",
                    fontWeight: 700,
                    minWidth: "140px",
                    padding: "10px 0",
                    fontSize: "15px",
                    boxShadow: "0 2px 8px rgba(40,144,205,0.08)",
                    opacity: !data.can_reschedule || actionLoading ? 0.5 : 1,
                    cursor: !data.can_reschedule || actionLoading ? "not-allowed" : "pointer",
                  }}
                  disabled={!data.can_reschedule || actionLoading}
                  onClick={() => setRescheduleOpen(true)}
                >
                  Reschedule
                </button>
                <button
                  className="minimal-action-btn"
                  style={{
                    background: "linear-gradient(90deg, #e53935 60%, #ff9800 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px",
                    fontWeight: 700,
                    minWidth: "140px",
                    padding: "10px 0",
                    fontSize: "15px",
                    boxShadow: "0 2px 8px rgba(229,57,53,0.08)",
                    opacity: !data.can_cancel || actionLoading ? 0.5 : 1,
                    cursor: !data.can_cancel || actionLoading ? "not-allowed" : "pointer",
                  }}
                  disabled={!data.can_cancel || actionLoading}
                  onClick={() => setCancelOpen(true)}
                >
                  Cancel Booking
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {booking && (
        <ReschedulePopup
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          booking={booking}
          onSubmit={handleRescheduleSubmit}
          loading={rescheduleLoading}
          lockDeparture={!!data.departure_locked}
          lockReturn={!!data.return_locked}
          dayRate={Number(data.extension_day_rate) || 20}
        />
      )}

      <PayPopup
        open={payPopup.open}
        onClose={() => setPayPopup({ open: false, booking: null, extraAmount: null, newDep: null, newArr: null })}
        booking={payPopup.booking}
        extraAmount={payPopup.extraAmount}
        onPaymentSuccess={handleExtraPaymentSuccess}
        newDepartureTime={payPopup.newDep}
        newReturnTime={payPopup.newArr}
        skipSuccessNavigate={true}
      />

      {booking && (
        <CancelBookingModal
          open={cancelOpen}
          booking={booking}
          onClose={() => setCancelOpen(false)}
          allowPoints={false}
          refundEligible={!!data.cancel_refund_eligible}
          loading={actionLoading}
          onConfirm={handleCancelConfirm}
        />
      )}
    </>
  );
};

export default ManageBooking;
