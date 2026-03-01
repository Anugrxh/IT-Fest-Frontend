import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import About from "./components/About";
import EventDetails from "./pages/EventDetails";
import Footer from "./components/Footer";
import Sponsors from "./components/Sponsors";
import Schedule from "./components/Schedule";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Faq from "./pages/Faq";

const App = () => {
  return (
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
              <Sponsors />
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
  );
};

export default App;
