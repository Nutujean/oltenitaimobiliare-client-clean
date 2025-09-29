import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdaugaAnunt from "./pages/AdaugaAnunt";
import AnunturileMele from "./pages/AnunturileMele";
import Anunturi from "./pages/Anunturi";
import DetaliuAnunt from "./pages/DetaliuAnunt";
import EditareAnunt from "./pages/EditareAnunt";
import Profil from "./pages/Profil";
import Contact from "./pages/Contact";
import Termeni from "./pages/Termeni";
import Confidentialitate from "./pages/Confidentialitate";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar sus */}
        <Navbar />

        {/* Conținutul principal */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adauga-anunt" element={<AdaugaAnunt />} />
            <Route path="/anunturile-mele" element={<AnunturileMele />} />
            <Route path="/anunturi" element={<Anunturi />} />
            <Route path="/anunt/:id" element={<DetaliuAnunt />} />
            <Route path="/editeaza-anunt/:id" element={<EditareAnunt />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/termeni" element={<Termeni />} />
            <Route path="/confidentialitate" element={<Confidentialitate />} />
          </Routes>
        </main>
        {/* Footer jos */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
