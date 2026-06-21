import React, {useEffect, useState} from 'react'
import BookingDatesForm from '../components/HomePage/BookingDatesForm'
import { useBooking } from "../context/BookingContext";
import bannerImg1 from "../assets/banner-img5.jpg"
import bannerImg2 from "../assets/banner-img6.jpg"
import bannerImg3 from "../assets/banner-img7.jpg"
import bannerImg4 from "../assets/banner-img8.jpg"
import customerSupport from "../assets/customer-support.jpg"
import terminal from "../assets/meet-and-greet.jpg"
import secureParking from "../assets/security.jpg"
import addOns from "../assets/add-ons.jpg"
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { Autoplay, EffectFade } from "swiper/modules";
import { ClipLoader } from "react-spinners";
import FAQSection from "../components/HomePage/FAQSection";
import { FaCarSide } from "react-icons/fa"; // Example icon
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaCalendarCheck } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { FaCarAlt } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

const Home = () => {

    const { setBookingData } = useBooking();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if(localStorage.getItem("access_token")){
        setBookingData((prev) => ({
            ...prev,
            bookingDates: null,
            bookingDetails: null,
            paymentDetails: null,
            carFlightDetails: null,
          }));}
        else{
            setBookingData(() => ({
            bookingDates: null,
            bookingDetails: null,
            paymentDetails: null,
            carFlightDetails: null,
            userDetails: null,
            selectedOption: null,
          }));
        }
        localStorage.removeItem("payment_status");
    }, []);

    useEffect(() => {
    const fetchFAQs = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/faqs/?website=dublinairportparking`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFaqs(data);

            if (!document.getElementById("shapo-embed-js")) {
                const script = document.createElement("script");
                script.id = "shapo-embed-js";
                script.type = "text/javascript";
                script.src = "https://cdn.shapo.io/js/embed.js";
                script.defer = true;
                document.body.appendChild(script);
            }
        
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchFAQs();
    }, []);
    
    if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e4e9f3 0%, #f0f4f8 100%)",
          animation: "fadeIn 1s"
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: 80,
            marginBottom: 24,
            filter: "drop-shadow(0 2px 8px rgba(68,126,155,0.10))"
          }}
        />
        <ClipLoader color="#447e9b" size={60} />
        <div style={{ marginTop: 24, color: "#447e9b", fontWeight: 600, fontSize: "1.2rem", letterSpacing: 1 }}>
          Loading your experience...
        </div>
        <FaCarSide size={32} color="#fd7e14" style={{ marginTop: 16, animation: "bounce 1.2s infinite" }} />
        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <>
    <Helmet>
        <title>Dublin Airport Express Parking | Meet & Greet Service</title>
        <meta name="description" content="Book reliable Dublin Airport Express Parking with Meet & Greet service. 24/7 monitored facilities minutes from the terminal."/>
        <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/>
        <link rel="canonical" href="https://dublinairportexpressparking.ie/"/>
        <meta property="og:title" content="Meet & Greet Dublin Airport Express Parking - Dublin Airport Express Parking"/>
        <meta property="og:description" content="Secure, reliable Dublin Airport Express Parking with hassle-free booking."/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://dublinairportexpressparking.ie/"/>
        <meta property="og:image" content="https://dublinairportexpressparking.ie/images/og-parking.jpg"/>
        <meta property="og:site_name" content="Dublin Airport Express Parking"/>
        <meta property="og:locale" content="en_US"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Meet & Greet Dublin Airport Express Parking - Dublin Airport Express Parking"/>
        <meta name="twitter:description" content="Easy, secure Dublin Airport Express Parking with Meet & Greet service."/>
        <meta name="twitter:image" content="https://dublinairportexpressparking.ie/images/og-parking.jpg"/>

        <script type="application/ld+json">
{`
{
"@context": "https://schema.org",
"@graph": [
    {
    "@type": "Organization",
    "@id": "https://dublinairportexpressparking.ie/#organization",
    "name": "Dublin Airport Express Parking",
    "url": "https://dublinairportexpressparking.ie/",
    "description": "Dublin Airport Express Parking offers secure and affordable Meet & Greet parking at Dublin Airport with 24/7 surveillance and hassle-free service.",
    "logo": {
        "@type": "ImageObject",
        "url": "https://dublinairportexpressparking.ie/images/icon-large.png"
    },
    "sameAs": [
        "https://www.facebook.com/dublinairportparking",
        "https://www.instagram.com/dublinairportparking",
        "https://www.linkedin.com/company/dublinairportparking"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+353 1 964 0011",
        "contactType": "Customer Service",
        "areaServed": "IE",
        "availableLanguage": "English"
    },
    "founder": {
        "@type": "Person",
        "name": "RS Admin"
    },
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dublin",
        "addressCountry": "IE"
    }
    },
    {
    "@type": "LocalBusiness",
    "@id": "https://dublinairportexpressparking.ie/#localbusiness",
    "name": "Dublin Airport Express Parking",
    "image": "https://dublinairportexpressparking.ie/images/icon-large.png",
    "priceRange": "$",
    "description": "Affordable Meet & Greet Dublin Airport Express Parking with 24/7 security, fast drop-off & collection. Trusted by thousands of Irish travelers.",
    "telephone": "+353 1 964 0011",
    "email": "support@dublinairportexpressparking.ie",
    "url": "https://dublinairportexpressparking.ie/",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dublin",
        "addressCountry": "IE"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "areaServed": "IE"
    },
    {
        "@type": "WebSite",
        "@id": "https://dublinairportexpressparking.ie/#website",
        "url": "https://dublinairportexpressparking.ie/",
        "name": "Dublin Airport Express Parking",
        "publisher": {
            "@id": "https://dublinairportexpressparking.ie/#organization"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://dublinairportexpressparking.ie/?s={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    },
    {
        "@type": "FAQPage",
        "@id": "https://dublinairportexpressparking.ie/#faq",
        "mainEntity": ${JSON.stringify(
            faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer.replace(/<[^>]*>/g, '')
                }
            }))
        )}
    }
]
}
`}
        </script>


    </Helmet>

    <div style={{backgroundColor: "#fff"}} data-elementor-type="wp-page" data-elementor-id="88" className="elementor elementor-88" data-elementor-post-type="page">
        <div className="home-banner">
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="swiper-container"
            >
                <SwiperSlide>
                <div
                    className="banner-slide"
                    style={{
                    backgroundImage: `url(${bannerImg1})`,
                    }}
                >
                    <div className="overlay"></div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div
                    className="banner-slide"
                    style={{
                    backgroundImage: `url(${bannerImg2})`,
                    }}
                >
                    <div className="overlay"></div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div
                    className="banner-slide"
                    style={{
                    backgroundImage: `url(${bannerImg3})`,
                    }}
                >
                    <div className="overlay"></div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div
                    className="banner-slide"
                    style={{
                    backgroundImage: `url(${bannerImg4})`,
                    }}
                >
                    <div className="overlay"></div>
                </div>
                </SwiperSlide>
            </Swiper>
            <div className="banner-content">
                <h1 className="banner-heading">Dublin Airport Express Parking Meet & Greet Service</h1>
                <h3 className="banner-subheading">
                Parking should be simple and reliable.  Drop your car at the terminal with Meet & Greet for quick transfers. 
                <br />
                Whichever you choose your car is safe in a fully monitored facility with staff available around the clock.
                </h3>
            </div>
        </div>
    <BookingDatesForm />

        
        
        {/* <div className="info-section simple-redesign">
            <p className="info-title">Start Your Journey Stress Free with Trusted Parking</p>
            <h2 className="info-heading">Effortless Dublin Airport Express Parking for Every Traveller</h2>
            <p className="info-description">
                Say goodbye to airport parking worries. Our Meet & Greet service allows you to drive straight to your terminal, where our team will collect your car and park it safely in our secure, 24/7 monitored facility — so you can travel stress-free.
            </p>
            <div className="info-cards-wrapper horizontal">
                <div className="info-card simple-card">
                <div className="info-card-step">Step 1</div>
                <div className="info-card-icon" aria-label="Arrival">&#128664;</div>
                <h3 className="info-subheading">When You Arrive</h3>
                <div className="info-card-service">
                    <p><strong>Meet & Greet Service</strong></p>
                    <p>
                    Call the driver on <a style={{ color: "#073E46" }} href="tel:+353834896505">+353 83 489 6505</a> about 25–30 minutes before reaching Dublin Airport. Drive straight to your departure terminal where our team member will be waiting. After a quick inspection, we take your car to our secure facility while you head for check in.<br />
                    <strong>Note:</strong> Please do not call the support number for arrival. Only contact the driver for drop-off and collection.
                    </p>
                </div>
                <div className="info-card-service">
                    <p><strong>Shuttle / Park and Fly Service</strong></p>
                    <p>
                    Arrive directly at our parking facility a few minutes away from the airport. Our staff will guide you to your spot and help with luggage if needed. Then board the shuttle bus which drops you at the terminal doors in minutes.
                    </p>
                </div>
                </div>
                <div className="info-card simple-card">
                <div className="info-card-step">Step 2</div>
                <div className="info-card-icon" aria-label="Return">&#128747;</div>
                <h3 className="info-subheading">When You Return</h3>
                <div className="info-card-service">
                    <p><strong>Meet & Greet Service</strong></p>
                    <p>
                    After collecting your bags, call <a style={{ color: "#073E46" }} href="tel:+353834896505">+353 83 489 6505</a> about 20–25 minutes before leaving the arrivals hall. Our driver will return your car to the pickup zone, ready for you to drive home without waiting.
                    </p>
                </div>
                <div className="info-card-service">
                    <p><strong>Shuttle / Park and Fly Service</strong></p>
                    <p>
                    Once you land, give us a quick call and our shuttle will collect you from the arrivals pickup point. We will take you straight back to your vehicle which will be parked safely and ready to go.
                    </p>
                </div>
                </div>
            </div>
            <p className="info-important">
                Note:<br />
                Both services are flexible, secure, and designed for convenience. You can cancel or amend bookings up to 72 hours before drop off without stress.
            </p>
            <p>
                Reserve now for a smooth, professional, and fully secure airport parking experience
            </p>
            <div className="info-button-wrapper">
                <a className="info-button" href="#book">Start Your Booking Now</a>
            </div>
        </div>

        <div className="testimonials-main">
            <div className="testimonials-section">  
                <div className="testimonials-header" style={{display:"flex", flexDirection:"column"}}>
                    <div style={{display:"flex", justifyContent:"end", marginBottom:"20px"}}>
                        <a href="https://g.page/r/CZW2D3u4VHTOEAI/review" target="_blank" rel="noopener noreferrer" style= {{background:"#073E46",color:"#fff",borderRadius:24,padding:"12px 36px 12px 24px",fontWeight:500,fontSize:18,textDecoration:"none",boxShadow:"0 2px 8px rgba(1,6,89,0.08)", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                <FcGoogle size={28} style={{marginRight:10,background:"#fff",borderRadius:"50%"}}/>
                            Leave a Review
                        </a>
                    </div>       

                    <p className="testimonials-subtitle">Testimonial</p>                                                            
                    <h2 className="testimonials-title" style={{ marginBottom : 0 }}>What Our Customers Say</h2>                                            
                </div>
                <div className="testimonials-container">
                    <div id="shapo-widget-166bff20a432e47cdb73"></div>
                </div>
            </div>
        </div> */}

        <div className="howitworks-section">
            <div className="howitworks-container">
                <div className="howitworks-left">
                <div className="howitworks-label">
                    <span className="howitworks-label-line"></span>
                    How it Works
                </div>
                <div className="howitworks-title">Meet & Greet - Dublin Airport</div>
                <div className="howitworks-heading">
                    Here’s a simple<br />
                    breakdown of how our<br />
                    services work
                </div>
                </div>
                <div className="howitworks-cards">
                <div className="howitworks-card">
                    <div className="howitworks-step">
                    <span>01.</span>
                    <span className="howitworks-icon">
                        <FaCalendarCheck />
                    </span>
                    </div>
                    <div className="howitworks-card-title">Book Online</div>
                    <div className="howitworks-card-desc">Select your parking and pick-up dates.</div>
                </div>
                <div className="howitworks-card">
                    <div className="howitworks-step">
                    <span>02.</span>
                    <span className="howitworks-icon">
                        <FaHandshake />
                    </span>
                    </div>
                    <div className="howitworks-card-title">Meet &amp; Greet</div>
                    <div className="howitworks-card-desc">Our valet will meet you at the terminal.</div>
                </div>
                <div className="howitworks-card">
                    <div className="howitworks-step">
                    <span>03.</span>
                    <span className="howitworks-icon">
                        <MdSecurity />
                    </span>
                    </div>
                    <div className="howitworks-card-title">Secure Parking</div>
                    <div className="howitworks-card-desc">We drive your car to a secure, monitored parking facility.</div>
                </div>
                <div className="howitworks-card">
                    <div className="howitworks-step">
                    <span>04.</span>
                    <span className="howitworks-icon">
                        <FaCarAlt />
                    </span>
                    </div>
                    <div className="howitworks-card-title">Pick Up</div>
                    <div className="howitworks-card-desc">Upon your return, your car will be waiting for you outside the terminal.</div>
                </div>
                </div>
            </div>
        </div>
        
        <div style={{ backgroundColor: "#fff"}}>
            <FAQSection faqs={faqs} loading={loading}/>
        </div>

        {/* <div className="container py-5 addons-section simple-redesign">
            <div style={{margin:0}} className="row align-items-stretch flex-column-reverse">
        
                <div className="d-flex flex-column justify-content-center px-4 right-content addons-card">
                <h2 className="text-dark-blue mb-4">Optional Add-Ons – Valet & Car Wash</h2>
                <p className="text-muted">
                    Make your return even more enjoyable with our professional car care services. From a quick wash to a full showroom finish, choose the option that best suits your car.
                </p>
                <ul className="list-unstyled">
                    <li>
                    <strong>Hand Wash &amp; Wax</strong>
                    <br />
                    Exterior wash with tyre shine for a fresh look. (Jeep/MPV +€5)
                    </li>
                    <li className="mt-3">
                    <strong>Interior &amp; Exterior Valet</strong>
                    <br />
                    Includes exterior wash and full vacuum inside. (Jeep/MPV +€10)
                    </li>
                    <li className="mt-3">
                    <strong>Full Valet</strong>
                    <br />
                    Deep cleaning, waxing, and interior detailing. (Jeep/MPV +€10)
                    </li>
                    <li className="mt-3">
                    <strong>Premium Valet</strong>
                    <br />
                    Shampoo, wax, and a complete interior refresh. (Jeep/MPV +€20)
                    </li>
                    <li className="mt-3">
                    <strong>Ultimate Valet</strong>
                    <br />
                    Professional polish and buff for a showroom-ready finish. (Jeep/MPV +€50)
                    </li>
                </ul>
                <p className="text-muted mt-1">
                    You can select any of these add-ons during your booking. It’s quick, easy, and ensures your car looks spotless when you return.
                </p>
                <a href="#book" className="btn btn-primary btn-lg mt-3">
                    Start Your Booking Now
                </a>
                </div>

                <div style={{padding:0}} className="d-flex align-items-center justify-content-center mb-4 mb-md-0">
                <img
                    src={addOns}
                    alt="Car Wash"
                    className="img-fluid w-100 h-100 addons-image"
                    style={{ objectFit: "cover", minHeight: 220, maxHeight: 400 }}
                />
                </div>
            </div>
        </div> */}




    </div>

</>
  )
}

export default Home