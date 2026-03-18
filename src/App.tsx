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
import AdminScanner from "./pages/AdminScanner";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin route */}
        <Route path="/admin/scanner" element={<AdminScanner />} />
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
