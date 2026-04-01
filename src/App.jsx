// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CookiesConsent from "./components/CookiesConsent";

/* Pagini publice */
import Home from "./pages/Home";
import DespreNoi from "./pages/DespreNoi";
import Termeni from "./pages/Termeni";
import Confidentialitate from "./pages/Confidentialitate";
import CookiesPage from "./pages/Cookies";
import BannerTest from "./pages/BannerTest";
import CumAdaugi from "./pages/CumAdaugi";
import Share from "./pages/Share";
import Promovare from "./pages/Promovare";
import Angajari from "./pages/Angajari";
import GhidImobiliar from "./pages/GhidImobiliar";
import CumScriiUnAnuntBun from "./pages/CumScriiUnAnuntBun";
import CumFaciPozeBune from "./pages/CumFaciPozeBune";
import LaCeSaFiiAtent from "./pages/LaCeSaFiiAtent";
import ActeVanzareImobil from "./pages/ActeVanzareImobil";
import CumAlegiUnChirias from "./pages/CumAlegiUnChirias";
import VerificariInchiriereLocuinta from "./pages/VerificariInchiriereLocuinta";

/* Autentificare prin SMS */
import LoginSMS from "./pages/LoginSMS";
import ProtectedRoute from "./components/ProtectedRoute";

/* Utilizator */
import Profil from "./pages/Profil";
import AnunturileMele from "./pages/AnunturileMele";
import Favorite from "./pages/Favorite";

/* Stripe: promovare */
import PromovareSucces from "./pages/PromovareSucces";
import PromovareAnulata from "./pages/PromovareAnulata";

/* Anunțuri */
import AdaugaAnunt from "./pages/AdaugaAnunt";
import EditareAnunt from "./pages/EditareAnunt";
import DetaliuAnunt from "./pages/DetaliuAnunt";
import Categories from "./pages/Categories";
import ToateAnunturile from "./pages/ToateAnunturile";

/* Pagini SEO dedicate */
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
      <Navbar />
      <ScrollToTop />

      <main className="flex-grow pt-24">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/despre-noi" element={<DespreNoi />} />
          <Route path="/termeni" element={<Termeni />} />
          <Route path="/confidentialitate" element={<Confidentialitate />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/banner-test" element={<BannerTest />} />
          <Route path="/cum-adaugi" element={<CumAdaugi />} />
          <Route path="/share/:id" element={<Share />} />
          <Route path="/promovare" element={<Promovare />} />
          <Route path="/angajari" element={<Angajari />} />
          <Route path="/ghid-imobiliar" element={<GhidImobiliar />} />
          <Route
            path="/ghid-imobiliar/cum-scrii-un-anunt-bun"
            element={<CumScriiUnAnuntBun />}
          />
          <Route
            path="/ghid-imobiliar/cum-faci-poze-bune"
            element={<CumFaciPozeBune />}
          />
          <Route
            path="/ghid-imobiliar/la-ce-sa-fii-atent-cand-cumperi-un-apartament"
            element={<LaCeSaFiiAtent />}
          />
          <Route
            path="/ghid-imobiliar/acte-necesare-pentru-vanzarea-unui-imobil"
            element={<ActeVanzareImobil />}
          />
          <Route
            path="/ghid-imobiliar/cum-alegi-un-chirias-potrivit"
            element={<CumAlegiUnChirias />}
          />
          <Route
            path="/ghid-imobiliar/ce-trebuie-sa-verifici-inainte-sa-inchiriezi-o-locuinta"
            element={<VerificariInchiriereLocuinta />}
          />

          {/* Autentificare */}
          <Route path="/login" element={<LoginSMS mode="login" />} />
          <Route path="/inregistrare" element={<LoginSMS mode="register" />} />

          {/* Profil protejat */}
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profil />
              </ProtectedRoute>
            }
          />

          {/* Utilizator */}
          <Route path="/anunturile-mele" element={<AnunturileMele />} />
          <Route path="/favorite" element={<Favorite />} />

          {/* Stripe */}
          <Route path="/promovare-succes" element={<PromovareSucces />} />
          <Route path="/promovare-anulata" element={<PromovareAnulata />} />

          {/* Anunțuri */}
          <Route path="/adauga-anunt" element={<AdaugaAnunt />} />
          <Route path="/editeaza-anunt/:id" element={<EditareAnunt />} />
          <Route path="/anunt/:id" element={<DetaliuAnunt />} />
          <Route path="/anunturi" element={<ToateAnunturile />} />

          {/* SEO */}
          <Route path="/case" element={<Case />} />
          <Route path="/apartamente" element={<Apartamente />} />
          <Route path="/terenuri" element={<Terenuri />} />
          <Route path="/spatii-comerciale" element={<SpatiiComerciale />} />
          <Route path="/garsoniere" element={<Garsoniere />} />
          <Route path="/garaje" element={<Garaje />} />

          {/* Categorii dinamice */}
          <Route path="/categorie/:slug" element={<Categories />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CookiesConsent />
    </div>
  );
}

export default App;