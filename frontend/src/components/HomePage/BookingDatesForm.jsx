import React, { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import { useNavigate } from "react-router-dom";
import PopupDialog from "../Utility/PopupDialog";
import { DateTime } from "luxon";

const BookingDatesForm = () => {
  const { setBookingData } = useBooking();
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parkingFromDate: "",
    parkingFromTime: "",
    carCollectionDate: "",
    carCollectionTime: "",
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [minHours, setMinHours] = useState(4);

  const generate24HourTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function calculateParkingDays({ parkingFromDate, parkingFromTime, carCollectionDate, carCollectionTime }) {
    if (!parkingFromDate || !parkingFromTime || !carCollectionDate || !carCollectionTime) {
      setPopupMessage("Invalid dates");
      setIsPopupOpen(true);
      return 0;
    }

    const fromDate = new Date(parkingFromDate);
    const toDate = new Date(carCollectionDate);

    if (isNaN(fromDate) || isNaN(toDate)) {
      setPopupMessage("Invalid dates");
      setIsPopupOpen(true);
      return 0;
    }

    const diffInMs = toDate - fromDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 0) {
      setPopupMessage("Invalid dates");
      setIsPopupOpen(true);
      return 0;
    }

    return diffInDays + 1;
  }

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services/coupons/validate/`, {
        method: "POST",
        body: JSON.stringify({ code: coupon.trim() }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 401:
            setPopupMessage("Session expired. Please login again.");
            break;
          case 404:
            setPopupMessage("Invalid coupon code.");
            break;
          case 400:
            setPopupMessage(data.message || "Invalid coupon.");
            break;
          default:
            setPopupMessage("Failed to validate coupon.");
        }
        setIsPopupOpen(true);
        return null;
      }

      return {
        couponId: data.id,
        discount: data.discount_percent,
      };

    } catch (error) {
      setPopupMessage("An error occurred while validating the coupon.");
      setIsPopupOpen(true);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = DateTime.now().setZone("Europe/Dublin");

    const parkingFromDateTime = DateTime.fromISO(
      `${formData.parkingFromDate}T${formData.parkingFromTime}`,
      { zone: "Europe/Dublin" }
    );
    const carCollectionDateTime = DateTime.fromISO(
      `${formData.carCollectionDate}T${formData.carCollectionTime}`,
      { zone: "Europe/Dublin" }
    );

    if (
      parkingFromDateTime.diff(now, "hours").hours < minHours ||
      carCollectionDateTime.diff(now, "hours").hours < minHours
    ) {
      setPopupMessage(`Drop-off date and time must be at least ${minHours} hours from the current Dublin time.`);
      setIsPopupOpen(true);
      return;
    }

    if (parkingFromDateTime >= carCollectionDateTime) {
      setPopupMessage("Pickup date and time must be after Drop-off date and time.");
      setIsPopupOpen(true);
      return;
    }

    let couponData = null;
    if (coupon.trim() !== "") {
      couponData = await handleApplyCoupon();
      if (!couponData) {
        return;
      }
    }

    const noOfDays = calculateParkingDays(formData);

    const paymentDetails = {
      couponId: couponData?.couponId || null,
      discount: couponData?.discount || 0,
      noOfDays: noOfDays,
      coupon: coupon,
    };

    setBookingData((prev) => ({
      ...prev,
      bookingDates: formData,
      paymentDetails: paymentDetails,
    }));

    navigate("/services");
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/core/booking-settings/`)
      .then(res => res.json())
      .then(data => {
        setMinHours(data.min_hours_before_booking || 4);
      });
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div id="book" className="booking-form-hero">
      <form onSubmit={handleSubmit}>
        <div className="booking-form-hero-header">
          Book Parking          
        </div>
        <div className="booking-form-hero-row-main">
          <div className="booking-form-hero-row">
            <div className="booking-form-hero-col">
              <label>Parking Date</label>
              <input
                type="date"
                name="parkingFromDate"
                value={formData.parkingFromDate}
                min={today}
                onChange={handleChange}
                required
              />
            </div>
            <div className="booking-form-hero-col">
              <label>Parking Time</label>
              <select
                name="parkingFromTime"
                value={formData.parkingFromTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                {generate24HourTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time} &nbsp; ({DateTime.fromFormat(time, "HH:mm").toFormat("hh:mm a")})
                  </option>
                ))}
              </select>
            </div>
            <div className="booking-form-hero-col">
              <label>Return Date</label>
              <input
                type="date"
                name="carCollectionDate"
                value={formData.carCollectionDate}
                min={formData.parkingFromDate || today}
                onChange={handleChange}
                required
              />
            </div>
            <div className="booking-form-hero-col">
              <label>Pickup Time</label>
              <select
                name="carCollectionTime"
                value={formData.carCollectionTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                {generate24HourTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time} &nbsp; ({DateTime.fromFormat(time, "HH:mm").toFormat("hh:mm a")})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="booking-form-hero-col-btn">
            <button type="submit" className="booking-form-hero-btn">
              Book Now
            </button>
          </div>
        </div>
        <div className="booking-form-hero-row-coupon">
          <div className="booking-form-hero-col booking-form-hero-col-coupon">
            <input
              type="text"
              name="coupon"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
          </div>
        </div>
        <div className="filler"></div>
      </form>
      <PopupDialog
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Invalid Parking Time"
        message={popupMessage}
      />
    </div>
  );
};

export default BookingDatesForm;