import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BannerTest from "./pages/BannerTest";
import CumAdaugi from "./pages/CumAdaugi";
import Share from "./pages/Share";

/* Pagini principale */
import Home from "./pages/Home";
import DespreNoi from "./pages/DespreNoi";
import Termeni from "./pages/Termeni";
import Confidentialitate from "./pages/Confidentialitate";
import Cookies from "./pages/Cookies";

/* Autentificare prin SMS */
import LoginSMS from "./pages/LoginSMS";

/* Utilizator */
import Profil from "./pages/Profil";
import AnunturileMele from "./pages/AnunturileMele";
import Favorite from "./pages/Favorite";
import PromovareSucces from "./pages/PromovareSucces";
import SuccesPlata from "./pages/SuccesPlata";

/* Anunțuri */
import AdaugaAnunt from "./pages/AdaugaAnunt";
import EditareAnunt from "./pages/EditareAnunt";
import DetaliuAnunt from "./pages/DetaliuAnunt";
import Categories from "./pages/Categories";
import ToateAnunturile from "./pages/ToateAnunturile";

/* ✅ Pagini SEO dedicate */
import Case from "./pages/Case";
import Apartamente from "./pages/Apartamente";
import Terenuri from "./pages/Terenuri";
import SpatiiComerciale from "./pages/SpatiiComerciale.jsx";
import Garsoniere from "./pages/Garsoniere";
import Garaje from "./pages/Garaje";

/* 404 */
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Navbar fix sus */}
      <Navbar />
      {/* ✅ Scroll to top la schimbare de pagină */}
      <ScrollToTop />

      <main className="flex-grow pt-24">
        <Routes>
          {/* 🔹 Public */}
          <Route path="/" element={<Home />} />
          <Route path="/despre-noi" element={<DespreNoi />} />
          <Route path="/termeni" element={<Termeni />} />
          <Route path="/confidentialitate" element={<Confidentialitate />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/banner-test" element={<BannerTest />} />
          <Route path="/cum-adaugi" element={<CumAdaugi />} />
          <Route path="/share/:id" element={<Share />} />

          {/* 🔹 Autentificare (prin SMS - login + înregistrare) */}
          <Route path="/login" element={<LoginSMS />} />
          <Route path="/inregistrare" element={<LoginSMS />} />

          {/* 🔹 Utilizator */}
          <Route path="/profil" element={<Profil />} />
          <Route path="/anunturile-mele" element={<AnunturileMele />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/promovare-succes" element={<PromovareSucces />} />
          <Route path="/succesplata" element={<SuccesPlata />} />

          {/* 🔹 Anunțuri */}
          <Route path="/adauga-anunt" element={<AdaugaAnunt />} />
          <Route path="/editeaza-anunt/:id" element={<EditareAnunt />} />
          <Route path="/anunt/:id" element={<DetaliuAnunt />} />
          <Route path="/anunturi" element={<ToateAnunturile />} />

          {/* 🔹 Categoriile SEO */}
          <Route path="/case" element={<Case />} />
          <Route path="/apartamente" element={<Apartamente />} />
          <Route path="/terenuri" element={<Terenuri />} />
          <Route path="/spatii-comerciale" element={<SpatiiComerciale />} />
          <Route path="/garsoniere" element={<Garsoniere />} />
          <Route path="/garaje" element={<Garaje />} />

          {/* 🔹 Categorii dinamice */}
          <Route path="/categorie/:slug" element={<Categories />} />

          {/* 🔹 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* ✅ Footer global */}
      <Footer />
    </div>
  );
}

export default App;
