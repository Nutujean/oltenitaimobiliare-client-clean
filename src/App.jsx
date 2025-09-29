import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdaugaAnunt from "./pages/AdaugaAnunt";
import AnunturileMele from "./pages/AnunturileMele";
import Anunturi from "./pages/Anunturi";
import DetaliuAnunt from "./pages/DetaliuAnunt";
import EditareAnunt from "./pages/EditareAnunt";
import Profil from "./pages/Profil";

function App() {
  return (
    <Router>
      <Navbar />
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
      </Routes>
    </Router>
  );
}

export default App;
