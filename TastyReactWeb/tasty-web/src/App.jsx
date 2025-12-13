import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RecipeListPage from "./pages/RecipeListPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import NewRecipePage from "./pages/NewRecipePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RecipeListPage />} />
        <Route path="/recepti/nov" element={<NewRecipePage />} />
        <Route path="/recepti/:id" element={<RecipeDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Layout>
  );
}
