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
