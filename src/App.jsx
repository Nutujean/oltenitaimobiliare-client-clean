import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdaugaAnunt from "./pages/AdaugaAnunt";
import AnunturileMele from "./pages/AnunturileMele";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar sus */}
        <Navbar />

        {/* Conținutul paginilor */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adauga-anunt" element={<AdaugaAnunt />} />
            <Route path="/anunturile-mele" element={<AnunturileMele />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {/* Footer jos */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
