import React, { useEffect, useState } from 'react';
import { useBooking } from "../../context/BookingContext";
import { Link } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext"; // or wherever you get user info

const PriceSummaryBookingForm = ({ serviceDetails, totalPrice, price, perDayPrice, setCouponId, discountedPrice, setDiscountedPrice, addOnsDetails, bonusUsed, setBonusUsed, currentStep }) => {
    const { bookingData, setBookingData } = useBooking();
    const { user } = useAuth();
    const [discount, setDiscount] = useState(0); 
    const [amountSaved, setAmountSaved] = useState(0); 
    const [isCouponApplied, setIsCouponApplied] = useState(false); 
    const [coupon, setCoupon] = useState(""); 
    const [finalPrice, setFinalPrice] = useState(totalPrice);

  const calculateDiscountedPrice = async () => {
    try {
      let tempPrice = totalPrice;
      let tempDiscount = 0;
      let tempBonusUsed = 0;

      // Apply coupon if any
      if (bookingData?.paymentDetails?.discount > 0) {
        const discountPercentage = bookingData?.paymentDetails?.discount;
        const savedAmount = (totalPrice * discountPercentage) / 100;
        setCouponId(bookingData?.paymentDetails?.couponId);
        setCoupon(bookingData?.paymentDetails?.coupon);
        setDiscount(discountPercentage);
        setAmountSaved(savedAmount);
        tempPrice = totalPrice - savedAmount;
        setDiscountedPrice(tempPrice);
        setIsCouponApplied(true);
      }

      // Deduct bonus points if user is logged in and has any
      if (user && user.bonus_points > 0) {
        const maxBonusUsable = Math.max(0, tempPrice - 0.5);
        tempBonusUsed = Math.min(user.bonus_points, maxBonusUsable);
        tempBonusUsed = Number(tempBonusUsed).toFixed(2);
        tempPrice = tempPrice - tempBonusUsed;
        setDiscountedPrice(tempPrice);
        setBonusUsed(Number(tempBonusUsed));
      } else {
        setBonusUsed(0);
      }

      setFinalPrice(tempPrice);
    } catch (error) {
      alert("An error occurred while calculating the amounts.");
    }
  };

  useEffect(() => {
    calculateDiscountedPrice();
    // eslint-disable-next-line
  }, [totalPrice, user, amountSaved]);


  const handleCoupon = async () => {
    if (isCouponApplied) {
      setCoupon(""); setDiscount(0); setAmountSaved(0); setIsCouponApplied(false); setDiscountedPrice(totalPrice); setCouponId(null);
      setBookingData(prev => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          couponId: null,
          discount: 0,
          coupon: ""
        }
      }));
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services/coupons/validate/`, {
          method: "POST",
          body: JSON.stringify({ code: coupon.trim() }),
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (!response.ok) { alert(data.message || "Invalid coupon."); return; }
        const discountPercentage = data.discount_percent;
        setCouponId(data.id); setDiscount(discountPercentage); setAmountSaved((totalPrice * discountPercentage) / 100); setDiscountedPrice(totalPrice - (totalPrice * discountPercentage / 100)); setIsCouponApplied(true);
        setBookingData(prev => ({
          ...prev,
          paymentDetails: {
            ...prev.paymentDetails,
            couponId: data.id,
            discount: discountPercentage,
            coupon: coupon
          }
        }));
      } catch { alert("An error occurred while validating the coupon."); }
    }
  };

  return (
    <div className='price-summary' style={{ height: "fit-content", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 24px #c2c2c240", padding: "20px", marginTop: "30px", marginBottom: "30px" }}>
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <h6 className="pt-1 cl" style={{ fontSize: "18px", fontWeight: "bold", color: "#073E46", marginBottom: "15px", textAlign: "left" }}>Booking Details</h6>
          </div>          

          {/* Arrival and Departure Dates */}
          <div>
            <div className="row mt-2">
              <div className="col">
                <h6 className="mb-3" style={{ fontSize: "13px", color: "#555" }}>
                  <span className="text-grey" style={{ fontWeight: "bold" }}>Parking Date:</span>{" "}
                  <span className="green" style={{ color: "#75C24B" }}>{new Date(bookingData?.bookingDates?.parkingFromDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}, {bookingData?.bookingDates?.parkingFromTime}</span>
                </h6>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h6 className="m-0" style={{ fontSize: "13px", color: "#555" }}>
                  <span className="text-grey" style={{ fontWeight: "bold" }}>Return Date : </span>{" "}
                  <span className="green" style={{ color: "#75C24B" }}>{new Date(bookingData?.bookingDates?.carCollectionDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}, {bookingData?.bookingDates?.carCollectionTime}</span>
                </h6>
              </div>
            </div>

            <div class="border" style={{margin: "15px auto", borderTopWidth: "0px !important"}}></div>
            
          </div>

          <div className="row">
            <h6 className="pt-1 cl" style={{ fontSize: "14px", fontWeight: "bold", color: "#073E46", marginBottom: "15px", textAlign: "left" }}>{serviceDetails?.name || "Loading..."}</h6>
          </div> 

          {/* Pricing Details */}
          <div className="row">
            <div className="col">
              <h6 style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
                Base Price:{" "}
                <span id="parkingPrice" style={{ fontWeight: "bold", color: "#75C24B" }}>€{price}</span>
              </h6>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h6 style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
                Price Per Day:{" "}
                <span style={{ fontWeight: "bold", color: "#75C24B" }}>€{serviceDetails?.per_day_price}</span>
              </h6>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h6 style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
                Price for {bookingData?.paymentDetails?.noOfDays} day(s):{" "}
                <span style={{ fontWeight: "bold", color: "#75C24B" }}>{bookingData?.paymentDetails?.noOfDays} day(s) X €{serviceDetails?.per_day_price} = €{perDayPrice.toFixed(2)}</span>
              </h6>
            </div>
          </div>
          

          <div class="border" style={{margin: "15px auto", borderTopWidth: "0px !important"}}></div>

          {addOnsDetails.length > 0 && (<>          
            <h6 className="pt-1 cl" style={{ fontSize: "14px", fontWeight: "bold", color: "#073E46", marginBottom: "15px", textAlign: "center" }}>Add Ons</h6>

            {addOnsDetails.map((addon) => (
              <div key={addon.id} className="row">
                <div className="col">
                  <h6 style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
                    {addon.name}:{" "}
                    <span style={{ fontWeight: "bold", color: "#75C24B" }}>€{addon.price}</span>
                  </h6>
                </div>
              </div>
            ))}
            
            <div class="border" style={{margin: "15px auto", borderTopWidth: "0px !important"}}></div>
          </>
          )}      

          {(currentStep !== 3 && currentStep !== 4) && (
            <div className="row" style={{marginBottom:10}}>
              <div className="col" style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="text" value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter coupon code" style={{flex:1,padding:"8px",borderRadius:"5px",border:"1px solid #ccc",fontSize:"14px"}} disabled={isCouponApplied}/>
                <button type="button" onClick={handleCoupon} style={{padding:"8px 16px",background:isCouponApplied?"#e74c3c":"#75C24B",color:"#fff",border:"none",borderRadius:"5px",fontWeight:600,cursor:"pointer"}}>
                  {isCouponApplied?"Remove":"Apply"}
                </button>
              </div>
            </div>
          )}

          {/* Discount Details */}
          {discount > 0 && (
            <div className="row">
              <div className="col">
                <h6 style={{ fontSize: "14px", color: "#073E46", marginBottom: "10px" }}>
                  Coupon:{" "}
                  <span style={{ color: "#75C24B" }}>{coupon}</span>
                </h6>
                <h6 style={{ fontSize: "14px", color: "#073E46", marginBottom: "20px" }}>
                  Amount Saved:{" "}
                  <span style={{ color: "#75C24B" }}>€{amountSaved.toFixed(2)}</span>
                </h6>
              </div>
            </div>
          )}

          {/* Show bonus points deduction if any */}
          {bonusUsed > 0 && (
            <div className="row">
              <div className="col">
                <h6 style={{ fontSize: "14px", color: "#43a047", marginBottom: "10px" }}>
                  Credit Points Used: <span style={{ fontWeight: "bold", color: "#75C24B" }}>€{bonusUsed.toFixed(2)}</span>
                </h6>
                {/* Show note if bonus covers almost all price */}
                {finalPrice.toFixed(2) <= 0.5 && (
                  <div style={{ fontSize: "13px", color: "#e53935", marginBottom: "10px" }}>
                    <strong>Note:</strong> Even if your credit points cover the full price, a minimum payment of €0.50 is required to complete the booking. This is necessary for payment verification and fraud prevention.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="row">
            <div className="col">
              <h5 className="prices" style={{ fontSize: "16px", fontWeight: "bold", color: "#073E46", marginBottom: "15px" }}>
                Booking Total: <span style={{ color: "#75C24B" }}>€{finalPrice.toFixed(2)}</span>
              </h5>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="by-details" style={{ fontSize: "12px", color: "#555" }}>
                By reserving parking you agree to our booking{" "}
                <Link to={"/terms-conditions"} data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ color: "#75C24B", textDecoration: "underline" }}>terms and conditions</Link>.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PriceSummaryBookingForm;