import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import StarsBackground from "./components/StarsBackground";
import Dashboard from "./pages/Dashboard";
import Salat from "./pages/Salat";
import SuhoorIftar from "./pages/SuhoorIftar";
import DuaAmol from "./pages/DuaAmol";
import DailyDua from "./pages/DailyDua";
import DailyTracker from "./pages/DailyTracker";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen bg-[#0a0e1a] text-white">
          <StarsBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/salat" element={<Salat />} />
            <Route path="/suhoor-iftar" element={<SuhoorIftar />} />
            <Route path="/dua-amol" element={<DuaAmol />} />
            <Route path="/daily-dua" element={<DailyDua />} />
            <Route path="/daily-tracker" element={<DailyTracker />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
