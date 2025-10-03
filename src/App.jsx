import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import DespreNoi from "./pages/DespreNoi";
import Termeni from "./pages/Termeni";
import Confidentialitate from "./pages/Confidentialitate";
import Cookies from "./pages/Cookies";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profil from "./pages/Profil";
import AnunturileMele from "./pages/AnunturileMele";
import Favorite from "./pages/Favorite";

import AdaugaAnunt from "./pages/AdaugaAnunt";
import EditareAnunt from "./pages/EditareAnunt";
import DetaliuAnunt from "./pages/DetaliuAnunt";
import Categories from "./pages/Categories"; // <— ✨ NOU

import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/despre" element={<DespreNoi />} />
          <Route path="/termeni" element={<Termeni />} />
          <Route path="/confidentialitate" element={<Confidentialitate />} />
          <Route path="/cookies" element={<Cookies />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/anunturile-mele" element={<AnunturileMele />} />
          <Route path="/favorite" element={<Favorite />} />

          <Route path="/adauga-anunt" element={<AdaugaAnunt />} />
          <Route path="/editeaza-anunt/:id" element={<EditareAnunt />} />
          <Route path="/anunt/:id" element={<DetaliuAnunt />} />

          {/* ✨ Ruta pentru categorii */}
          <Route path="/categorie/:categorie" element={<Categories />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
