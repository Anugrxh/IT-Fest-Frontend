import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <style>{`
        .footer-bg {
          background: #0a0a0f;
          background-image:
            linear-gradient(rgba(0, 255, 140, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 140, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .footer-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(0, 255, 140, 0.5);
          font-size: 0.65rem;
        }

        .footer-link {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .footer-link:hover {
          color: #00ff8c;
        }

        .nav-title-glare {
          background: linear-gradient(
            90deg,
            #FFD700 0%,
            #FFD700 35%,
            #FFFACD 50%,
            #FFD700 65%,
            #FFD700 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: navTitleGlare 30s ease-in-out infinite;
        }

        @keyframes navTitleGlare {
          0%, 93%  { background-position: -200% center; }
          100%     { background-position: 200% center; }
        }
      `}</style>

      <footer id="contact" className="footer-bg border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/logo/logo.png"
                  alt="Zeitgeist Logo"
                  className="h-10 w-10 object-contain"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(6000%) hue-rotate(0deg) brightness(100%)",
                  }}
                />
                <span
                  className="nav-title-glare"
                  style={{
                    fontSize: "clamp(0.9rem, 2.2vw, 1.15rem)",
                    fontWeight: 700,
                    letterSpacing: "clamp(0.1em, 1vw, 0.2em)",
                  }}
                >
                  ZEITGEIST
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  className="footer-link"
                  href="https://www.instagram.com/zeitgeist.kuc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="footer-link"
                  href="https://chat.whatsapp.com/F76BqAXN0V522bSAiYr2tX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Group
                </a>
                <a
                  className="footer-link"
                  href="https://whatsapp.com/channel/0029VbCUapz9WtByiXiPhv2B"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Channel
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="footer-title">Contact</div>
              <div className="flex flex-col gap-2">
                <a className="footer-link" href="tel:+919188851878 ">
                  Mob: 
                  <br/>
                  Naveen - +91 91888 51878 
                  <br/>
                  Krishnendh - +91 82817 15882
                </a>
                <a className="footer-link" href="mailto:zeitgeist2026@gmail.com">
                  Email: zeitgeist2026@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="footer-title">Policies</div>
              <div className="flex flex-col gap-2">
                <Link className="footer-link" to="/terms">
                  Terms &amp; Conditions
                </Link>
                <Link className="footer-link" to="/privacy">
                  Privacy Policy
                </Link>
                <Link className="footer-link" to="/refund">
                  Refund Policy
                </Link>
                <Link className="footer-link" to="/faq">
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.06] flex justify-center">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                border: "1px solid rgba(0,255,140,0.15)",
                background: "rgba(0,255,140,0.03)",
                padding: "0.45rem 1.1rem",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(0.44rem,0.7vw,0.58rem)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <span
                style={{ color: "rgba(0,255,140,0.4)", fontSize: "0.55rem" }}
              >
                ◆
              </span>
              Designed &amp; Developed by
              <span
                style={{
                  color: "rgba(0,255,140,0.75)",
                  letterSpacing: "0.2em",
                }}
              >
                ExoHunters
              </span>
              <span
                style={{ color: "rgba(0,255,140,0.4)", fontSize: "0.55rem" }}
              >
                ◆
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
