import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdaugaAnunt from "./pages/AdaugaAnunt";
import AnunturileMele from "./pages/AnunturileMele";
import DetaliuAnunt from "./pages/DetaliuAnunt";
import ToateAnunturile from "./pages/ToateAnunturile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adauga-anunt" element={<AdaugaAnunt />} />
        <Route path="/anunturile-mele" element={<AnunturileMele />} />
        <Route path="/anunt/:id" element={<DetaliuAnunt />} />
        <Route path="/toate-anunturile" element={<ToateAnunturile />} />
      </Routes>
    </Router>
  );
}

export default App;
