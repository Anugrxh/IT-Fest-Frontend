import { useState, useEffect } from "react";

const navLinks = [
    { label: "Home", sub: "HOME", href: "#home" },
    { label: "Events", sub: "EVENTS", href: "#events" },
    { label: "Schedule", sub: "SCHEDULE", href: "#schedule" },
    { label: "Gallery", sub: "GALLERY", href: "#gallery" },
    { label: "Contact", sub: "CONTACT", href: "#contact" },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [introSpin, setIntroSpin] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIntroSpin(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <>
            <style>{`
        @keyframes tyreSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .logo-spin {
          animation: tyreSpin 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .logo-hover:hover {
          animation: tyreSpin 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes navTitleGlare {
          0%, 93%  { background-position: -200% center; }
          100%     { background-position: 200% center; }
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

        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dotted-orbit {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px dashed rgba(255, 215, 0, 0.3);
          animation: orbitSpin 8s linear infinite;
          pointer-events: none;
        }

        @keyframes stackIn {
          0%   { opacity: 0; transform: translateY(-40px); }
          60%  { opacity: 1; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .menu-stack-item {
          opacity: 0;
          transform: translateY(-40px);
        }
        .menu-open .menu-stack-item {
          animation: stackIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cornerFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .menu-open .corner-bracket {
          animation: cornerFade 0.4s ease forwards;
        }
      `}</style>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50">
                <div style={{
                    height: "2px",
                    background: "linear-gradient(90deg, #c8446c, #e06080, #c8446c)",
                    opacity: 0.6,
                }} />
                <div
                    className="flex items-center justify-between px-4 sm:px-6 md:px-10 h-[60px] sm:h-[80px] overflow-hidden"
                    style={{ background: "transparent" }}
                >
                    <a href="#" className="flex items-center gap-3 group">
                        <img
                            src="/assets/logo/logo.png"
                            alt="Zeitgeist Logo"
                            className={`h-8 w-8 sm:h-12 sm:w-12 object-contain ${introSpin ? "logo-spin" : "logo-hover"}`}
                            style={{ filter: "brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(6000%) hue-rotate(0deg) brightness(100%)" }}
                        />
                        <span className="nav-title-glare" style={{
                            fontSize: "clamp(0.8rem, 2.5vw, 1.15rem)",
                            fontWeight: 700,
                            letterSpacing: "clamp(0.1em, 1vw, 0.2em)",
                        }}>
                            ZEITGEIST
                        </span>
                    </a>

                    <div className="relative">
                        <div className="dotted-orbit" />
                        <button
                            className="relative z-50 flex items-center justify-center transition-all duration-300"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            style={{
                                width: "clamp(38px, 8vw, 52px)",
                                height: "clamp(38px, 8vw, 52px)",
                                borderRadius: "50%",
                                border: menuOpen ? "1.5px solid rgba(220, 50, 50, 0.5)" : "1.5px solid rgba(255, 215, 0, 0.35)",
                                background: "transparent",
                            }}
                        >
                            <svg
                                className="transition-transform duration-300"
                                width="24"
                                height="16"
                                viewBox="0 0 20 14"
                                fill="none"
                                style={{
                                    transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                                }}
                            >
                                {menuOpen ? (
                                    <>
                                        <line x1="2" y1="2" x2="18" y2="12" stroke="#dc3232" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                        <line x1="2" y1="12" x2="18" y2="2" stroke="#dc3232" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="2" y1="2" x2="18" y2="2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                                        <line x1="2" y1="7" x2="18" y2="7" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                                        <line x1="2" y1="12" x2="18" y2="12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full-screen stacked menu overlay */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-500 ${menuOpen ? "menu-open" : ""}`}
                style={{
                    background: "rgba(8, 8, 14, 0.97)",
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? "auto" : "none",
                }}
            >
                {/* Corner bracket decoration */}
                <div
                    className="corner-bracket"
                    style={{
                        position: "absolute",
                        top: "24px",
                        left: "24px",
                        width: "50px",
                        height: "50px",
                        borderLeft: "2px solid rgba(255, 255, 255, 0.15)",
                        borderTop: "2px solid rgba(255, 255, 255, 0.15)",
                        opacity: 0,
                    }}
                />


                <div className="flex flex-col justify-center h-full px-8 sm:px-16 md:px-24 lg:px-32 py-24">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="menu-stack-item group block py-5 sm:py-6 transition-colors duration-300"
                            style={{
                                animationDelay: menuOpen ? `${i * 120 + 200}ms` : "0ms",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                            }}
                            onClick={() => setMenuOpen(false)}
                        >
                            <div className="flex items-center gap-4 sm:gap-6">
                                <span style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: "0.7rem",
                                    color: "rgba(255, 215, 0, 0.35)",
                                    letterSpacing: "0.1em",
                                    minWidth: "24px",
                                }}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span style={{
                                    width: "32px",
                                    height: "1px",
                                    background: "rgba(255, 255, 255, 0.12)",
                                    display: "block",
                                    flexShrink: 0,
                                }} />
                                <div>
                                    <span
                                        className="block group-hover:text-[#c8446c] transition-colors duration-300"
                                        style={{
                                            fontFamily: "'Orbitron', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
                                            letterSpacing: "0.1em",
                                            color: "rgba(255, 255, 255, 0.85)",
                                        }}
                                    >
                                        {link.label.toUpperCase()}
                                    </span>
                                    <span style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        fontSize: "0.55rem",
                                        letterSpacing: "0.3em",
                                        color: "rgba(255, 255, 255, 0.2)",
                                        marginTop: "4px",
                                        display: "block",
                                    }}>
                                        — {link.sub}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
