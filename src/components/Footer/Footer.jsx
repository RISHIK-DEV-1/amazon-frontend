import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <button className="back-to-top" onClick={() => window.scrollTo(0, 0)}>
          Back to top
        </button>
      </div>

      <div className="footer-links">
        <div className="footer-column">
          <p>Get to Know Us</p>
          <span>About Amazon</span>
          <span>Careers</span>
          <span>Press Releases</span>
        </div>

        <div className="footer-column">
          <p>Connect with Us</p>
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Instagram</span>
        </div>

        <div className="footer-column">
          <p>Make Money with Us</p>
          <span>Sell on Amazon</span>
          <span>Affiliate Program</span>
          <span>Advertise</span>
        </div>

        <div className="footer-column">
          <p>Help</p>
          <span>Customer Service</span>
          <span>Returns</span>
          <span>FAQ</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Amazon Clone</p>
      </div>
    </footer>
  );
}

export default Footer;
