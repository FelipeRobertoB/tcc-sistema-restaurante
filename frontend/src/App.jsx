import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/index";
import AdminProdutos from "./pages/Admin/index";
import Vendas from "./pages/Vendas/index";
import Cozinha from "./pages/Cozinha/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminProdutos />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/cozinha" element={<Cozinha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;