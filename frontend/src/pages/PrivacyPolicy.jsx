import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
    <Helmet>
        <title>Privacy Policy | Dublin Airport Express Parking</title>
        <meta name="description" content="Read the Privacy Policy of Dublin Airport Express Parking. Learn how we collect, use, and protect your personal information."/>
        <meta name="robots" content="index, follow"/>
        <link rel="canonical" href="https://dublinairportexpressparking.ie/privacy-policy/"/>

        <meta property="og:title" content="Privacy Policy - Dublin Airport Express Parking"/>
        <meta property="og:description" content="Learn how Dublin Airport Express Parking collects, uses, and protects your personal data. Your privacy matters to us."/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://dublinairportexpressparking.ie/privacy-policy/"/>
        <meta property="og:image" content="https://dublinairportexpressparking.ie/images/og-parking.jpg"/>
        <meta property="og:site_name" content="Dublin Airport Express Parking"/>
        <meta property="og:locale" content="en_US"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Privacy Policy - Dublin Airport Express Parking"/>
        <meta name="twitter:description" content="Understand how Dublin Airport Express Parking handles and protects your data. Review our privacy practices."/>
        <meta name="twitter:image" content="https://dublinairportexpressparking.ie/images/og-parking.jpg"/>

    </Helmet>
    <div style={{backgroundColor:"#fff"}}>
        <div className="container py-5 privacy-policy">
        <h1 style={{textAlign:"center", color:"#073E46"}} className="mb-4">Dublin Airport Express Parking Privacy Policy</h1>

        <section className="mb-5">
  <h2 style={{color:"#083E48"}} className="h4">1. Introduction</h2>
  <p>
    At <strong>Dublin Airport Express Parking</strong>, protecting your privacy and keeping your personal information secure is our top priority.  
    This Privacy Policy outlines how we collect, use, and protect your data.
  </p>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">2. Information We Collect</h2>
        <p>We may gather the following types of information:</p>
        <ul className="list-group list-group-flush">
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Personal Information</strong>: Your name, contact number, and email address.</li>
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Booking Information</strong>: Vehicle details and payment-related data.</li>
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Communication Records</strong>: Correspondence such as emails, phone calls, or chat messages with our support team.</li>
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Website Analytics</strong>: IP address, browser type, and general browsing behavior.</li>
        </ul>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">3. How We Use Your Information</h2>
        <p>Your data may be used to:</p>
        <ul className="list-unstyled ms-3">
            <li>• Process your bookings and confirm reservations.</li>
            <li>• Provide customer service and respond to your questions.</li>
            <li>• Send booking confirmations, updates, and service notifications.</li>
            <li>• Enhance our website’s performance and improve user experience.</li>
            <li>• Share promotional materials, only with your consent.</li>
        </ul>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">4. Information Sharing & Disclosure</h2>
        <ul className="list-group list-group-flush">
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Service Providers</strong>: Shared with trusted third parties when required to process transactions or deliver services.</li>
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Legal Obligations</strong>: Disclosed when necessary to comply with applicable laws or legal requests.</li>
            <li style={{backgroundColor:"#fff"}} className="list-group-item"><strong>Data Protection</strong>: We <strong>never</strong> sell, rent, or trade your personal data under any circumstances.</li>
        </ul>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">5. Data Security</h2>
        <p>
            We use appropriate security measures to protect your personal data.  
            However, please note that no online transmission or storage method is entirely secure.  
            We encourage you to be cautious when sharing personal details over the internet.
        </p>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-unstyled ms-3">
            <li>• Request access to the personal information we hold about you.</li>
            <li>• Ask for corrections to any inaccurate or incomplete data.</li>
            <li>• Request deletion of your information, where legally applicable.</li>
            <li>• Withdraw consent for receiving marketing communications.</li>
        </ul>
        <p>
            To exercise any of these rights, please contact us at:{" "}
            <a href="mailto:support@dublinairportexpressparking.ie"><strong>support@dublinairportexpressparking.ie</strong></a>
        </p>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">7. Cookies & Tracking Technologies</h2>
        <p>
            Our website uses cookies to improve user experience and analyze site traffic.  
            You can control or disable cookies through your browser settings at any time.
        </p>
        </section>

        <section className="mb-5">
        <h2 style={{color:"#083E48"}} className="h4">8. Policy Updates</h2>
        <p>
            This Privacy Policy may be updated periodically.  
            Any changes will be posted on this page, and continued use of our website indicates your acceptance of the revised terms.
        </p>
        </section>


        <section>
            <h2 style={{color:"#073E46"}} className="h4">9. Contact Us</h2>
            <p><strong>Phone:</strong> <a href="tel:+35319640011">+353 1 964 0011</a></p>
            <p><strong>Phone:</strong> <a href="tel:+353834896505">+353 83 489 6505</a></p>
            <p><strong>Email:</strong> <a href="mailto:support@dublinairportexpressparking.ie"><strong>support@dublinairportexpressparking.ie</strong></a></p>
        </section>
        </div>
    </div>
    </>
  );
};

export default PrivacyPolicy;
