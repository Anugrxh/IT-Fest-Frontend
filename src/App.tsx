import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import About from "./components/About";
import EventDetails from "./pages/EventDetails";
import Footer from "./components/Footer";
import Schedule from "./components/Schedule";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Faq from "./pages/Faq";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black">
              <Navbar />
              <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <About />
                    <Events />
                    
                    {/* DJ Party Night Section */}
                    <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 pt-8">
                      <div className="max-w-screen-xl mx-auto flex flex-col items-center">
                        <h2 className="text-center font-bold text-3xl sm:text-4xl md:text-5xl mb-8 lg:mb-12 tracking-widest text-[#ff4444] uppercase" style={{ fontFamily: "'Orbitron', sans-serif", textShadow: "0 0 10px rgba(255, 50, 50, 0.8), 0 0 30px rgba(255, 80, 20, 0.6)" }}>
                          DJ PARTY NIGHT
                          <span className="block text-xl sm:text-2xl mt-4 text-white tracking-widest font-normal">By DJ Sanaah</span>
                        </h2>
                        <img
                          src="/assets/posters/dj.jpeg"
                          alt="DJ PARTY NIGHT By DJ Sanaah"
                          className="w-full max-w-4xl h-auto rounded-xl shadow-[0_0_30px_rgba(255,50,50,0.3)] border border-white/5"
                          loading="lazy"
                        />
                      </div>
                    </section>

                    <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                      <div className="max-w-screen-xl mx-auto">
                        <img
                          src="/assets/posters/banner.png"
                          alt="IT Fest banner poster"
                          className="w-full h-auto rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    </section>
                    <Schedule />
                  </>
                }
              />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/faq" element={<Faq />} />
              </Routes>
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
