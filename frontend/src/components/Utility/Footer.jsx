import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-white.png'

const Footer = () => {
    return (
    <footer className="custom-footer">
        <div className="footer-row footer-logo-row">
            <Link to="/">
            <img src={logo} alt="Dublin Airport Express Parking Logo" className="footer-logo-img" />
            </Link>
        </div>
        <div className="footer-row">
            <h3 className="footer-heading">Legal Information</h3>
            <ul className="footer-list">
            <li>
                <Link className="footer-link" to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
                <Link className="footer-link" to="/terms-conditions">Terms &amp; Conditions</Link>
            </li>
            </ul>
        </div>
        <div className="footer-row">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="footer-contact">            
            <div>
                <span className="footer-contact-label">Customer Support:</span>
                <a className="footer-contact-value" href="tel:+35319640011">+353 1 964 0011</a>
            </div>
            <div>
                <span className="footer-contact-label">Driver:</span>
                <a className="footer-contact-value" href="tel:+353834896505">+353 83 489 6505</a>
            </div>
            <div>
                <span className="footer-contact-label">Email:</span>
                <a className="footer-contact-value" href="mailto:support@dublinairportexpressparking.ie">support@dublinairportexpressparking.ie</a>
            </div>
            </div>
        </div>
        <div className="footer-row footer-copyright">
            <p>
            Copyright ©2025 Dublin Airport Express Parking. Website &amp; Marketing by <strong><a style={{color: "white"}} href="https://xelensoft.com/" target="_blank" rel="noopener">Xelensoft</a></strong>
            </p>
        </div>
        </footer>
  )
}

export default Footer