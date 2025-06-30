import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>CartZone</h2>
          <p>Your trusted online shop. Simple, safe, smart.</p>
        </div>

        <div className="footer-newsletter">
          <h4>Join our newsletter</h4>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

       

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p> Nairobi, Kenya</p>
          <p> +254 712 345 678</p>
          <p> support@cartzone.co.ke</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CartZone. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;