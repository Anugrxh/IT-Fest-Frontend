import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";

const App = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Events />
    </div>
  );
};

export default App;
