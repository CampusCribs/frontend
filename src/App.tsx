import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "@/components/layout/Layout";
import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/Login/LoginPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
import SettingsPage from "./Pages/Settings/SettingsPage";
import AddPostPage from "./Pages/Add/AddPostPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post" element={<AddPostPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
