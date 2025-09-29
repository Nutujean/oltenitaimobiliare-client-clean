import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdaugaAnunt from "./pages/AdaugaAnunt";
import AnunturileMele from "./pages/AnunturileMele";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adauga" element={<AdaugaAnunt />} />
          <Route path="/anunturile-mele" element={<AnunturileMele />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
