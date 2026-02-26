import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-24 pb-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .policy-bg {
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 35%, rgba(220, 50, 50, 0.05) 0%, transparent 55%),
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 120px 120px, 120px 120px;
          background-position: center;
        }

        .policy-frame {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.35);
        }
        .policy-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.92) 100%);
        }

        .policy-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: clamp(2rem, 5.8vw, 3.8rem);
          color: #d8b85b;
          text-shadow: 0 0 18px rgba(255, 215, 0, 0.18), 0 0 44px rgba(255, 215, 0, 0.08);
        }

        .policy-underline {
          width: clamp(70px, 9vw, 96px);
          height: 3px;
          background: rgba(220, 50, 50, 0.95);
          margin-top: 0.9rem;
        }

        .policy-panel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.25);
        }

        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(216, 184, 91, 0.98);
          font-size: clamp(1.02rem, 1.2vw, 1.15rem);
        }

        .body-text {
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.85;
          font-size: clamp(0.98rem, 1.05vw, 1.05rem);
        }
      `}</style>

      <div className="policy-bg">
        <div className="max-w-screen-xl mx-auto">
          <Link to="/" className="text-emerald-400 hover:text-emerald-300">
            Back
          </Link>

          <div className="policy-frame mt-8">
            <div className="relative p-6 sm:p-10">
              <h1 className="policy-title">Privacy Policy</h1>
              <div className="policy-underline" />

              <div className="policy-panel mt-10 p-6 sm:p-10">
                <div className="space-y-10 body-text">
                  <div>
                    <div className="section-title">1. Information Collection</div>
                    <p className="mt-3">
                      We collect personal information such as Name, Email, Phone Number, and Department solely for the
                      purpose of event registration and verification.
                    </p>
                  </div>

                  <div>
                    <div className="section-title">2. Use of Information</div>
                    <p className="mt-3">
                      Your data is used to generate your entry pass and communicate event updates. We do not sell or
                      share your data with third parties, except as required by law.
                    </p>
                  </div>

                  <div>
                    <div className="section-title">3. Payment Data</div>
                    <p className="mt-3">
                      We do not store your credit card or banking details. All payments are processed securely through
                      Razorpay.
                    </p>
                  </div>

                  <div>
                    <div className="section-title">4. Data Security</div>
                    <p className="mt-3">
                      We implement industry-standard security measures to protect your personal information during
                      transmission and storage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
