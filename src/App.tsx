import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "@/components/layout/Layout";
import HomePage from "./webpages/Home/HomePage";
import LoginPage from "./webpages/Login/LoginPage";
import ProfilePage from "./webpages/Profile/ProfilePage";
import SettingsPage from "./webpages/Settings/SettingsPage";
import AddPostPage from "./webpages/Add/AddPostPage";
import IndividualPage from "./webpages/Individual/IndividualPage";
import SignupPage from "./webpages/Login/SignupPage";
import ForeignProfilePage from "./webpages/Profile/ForeignProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userName" element={<ForeignProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post" element={<AddPostPage />} />
          <Route path="/posts/:id" element={<IndividualPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
