import Nav from "./components/Nav";
import Hero from "./components/Hero";
import DemoWidget from "./components/DemoWidget";
import TryIt from "./components/TryIt";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import "./index.css"

export default function App() {

  const handleLogin = () => alert("Login page — wire up your router here");
  const handleSignup = () => alert("Signup page — wire up your router here");

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#0A0A0A] font-sans antialiased overflow-x-hidden">
      <Nav onLogin={handleLogin} onSignup={handleSignup} />
      <main className="pt-14">
        <Hero onSignup={handleSignup} />
        <DemoWidget />
        <TryIt onSignup={handleSignup} />
        <HowItWorks />
        <Pricing onSignup={handleSignup} />
        <FinalCTA onSignup={handleSignup} />
      </main>
      <Footer />
    </div>
  );
}
