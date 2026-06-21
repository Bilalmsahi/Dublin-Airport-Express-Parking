import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PopupDialog from "../components/Utility/PopupDialog";
import bannerImg from "../assets/banner-img1.jpg";

const GENERIC_MESSAGE =
  "If a matching booking exists, we've emailed you a secure link to manage it.";

const ManageBookingLookup = () => {
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, title: "", message: "" });

  const validate = () => {
    if (!bookingId.trim()) return "Booking ID is required.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()))
      return "A valid email is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setPopup({ open: true, title: "", message: error });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/manage/request-link/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: bookingId.trim(),
            email: email.trim(),
          }),
        }
      );
      if (res.status === 429) {
        setPopup({
          open: true,
          title: "",
          message: "Too many requests. Please wait a while and try again.",
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setPopup({
          open: true,
          title: "Check your email",
          message: data.message || GENERIC_MESSAGE,
        });
        setBookingId("");
        setEmail("");
      }
    } catch (err) {
      setPopup({
        open: true,
        title: "",
        message: "Something went wrong. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-stretch justify-content-center p-0" style={{ background: "linear-gradient(120deg, #fff 0%, #e3eafc 100%)" }}>
      <Helmet>
        <title>Manage My Booking - Dublin Airport Express Parking</title>
        <meta
          name="description"
          content="Reschedule or cancel your Dublin Airport Express Parking booking without an account. Enter your booking ID and email to get a secure manage-booking link."
        />
      </Helmet>
      <div className="row flex-grow-1 w-100 m-0">
        {/* Left Banner */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center p-0" style={{ background: "#073E46" }}>
          <div
            style={{
              width: "100%",
              height: "-webkit-fill-available",
              minHeight: 500,
              backgroundImage: `linear-gradient(120deg,rgba(1,6,89,0.68),rgba(40,144,205,0.38)),url(${bannerImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 32px",
              boxSizing: "border-box",
            }}
          >
            <div style={{
              marginBottom: 18,
              background: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              padding: 6,
              boxShadow: "0 2px 12px rgba(40,144,205,0.10)",
            }}>
              <img src="/images/icon.png" alt="Dublin Airport Express Parking" style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                background: "#fff",
              }} />
            </div>
            <h2 style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "2.3rem",
              margin: "18px 0 8px 0",
              letterSpacing: "1px",
              textAlign: "center",
              textShadow: "0 2px 16px rgba(1,6,89,0.18)",
            }}>Manage Your Booking</h2>
            <p style={{
              color: "#e3eafc",
              fontSize: "1.2rem",
              marginBottom: 24,
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 360,
              textShadow: "0 2px 8px rgba(1,6,89,0.18)",
              background: "rgba(1,6,89,0.18)",
              borderRadius: "8px",
              padding: "8px 16px",
            }}>
              No account needed — enter your booking ID and email and we will send you a secure link to reschedule or cancel your booking.
            </p>
          </div>
        </div>
        {/* Right Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-0" style={{ background: "transparent" }}>
          <div style={{
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(40,144,205,0.10)",
            maxWidth: "550px",
            width: "100%",
            padding: "38px 32px 32px 32px",
            margin: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <h2 style={{
              color: "#75C24B",
              fontWeight: 700,
              fontSize: "1.6rem",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: "1px",
            }}>
              Manage My Booking
            </h2>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit} autoComplete="off">
              <label style={styles.label}>Booking ID *</label>
              <input
                style={styles.input}
                type="text"
                name="booking_id"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="e.g. DA-1A2B3C4D"
              />
              <label style={styles.label}>Email *</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email used for the booking"
                autoComplete="email"
              />
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#75C24B")}
              >
                {loading ? "Please wait..." : "Send Secure Link"}
              </button>
              <div style={styles.switchText}>
                Have an account?{" "}
                <Link to="/login" style={styles.link}>
                  Log in to your dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <PopupDialog
        isOpen={popup.open}
        onClose={() => setPopup({ open: false, title: "", message: "" })}
        title={popup.title}
        message={popup.message}
      />
    </div>
  );
};

const styles = {
  label: {
    fontWeight: 600,
    color: "#073E46",
    fontSize: "15px",
    marginBottom: "2px",
    marginTop: "8px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e3eafc",
    fontSize: "15px",
    marginBottom: "8px",
    outline: "none",
    transition: "border 0.2s",
    background: "#f8fafc",
    width: "100%",
  },
  button: {
    marginTop: "18px",
    padding: "12px 0",
    backgroundColor: "#75C24B",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 12px rgba(40,144,205,0.10)",
    letterSpacing: "1px",
  },
  switchText: {
    marginTop: "18px",
    textAlign: "center",
    color: "#6c757d",
    fontSize: "15px",
  },
  link: {
    color: "#75C24B",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "4px",
  },
};

export default ManageBookingLookup;
