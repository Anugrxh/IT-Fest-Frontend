import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import EventDetails from "./pages/EventDetails";

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
              <Events />
            </>
          }
        />
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </div>
  );
};

export default App;
