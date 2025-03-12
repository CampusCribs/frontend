import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "@/components/layout/Layout";
import HomePage from "./webpages/Home/HomePage";
import LoginPage from "./webpages/Login/LoginPage";
import ProfilePage from "./webpages/Profile/ProfilePage";
import SettingsPage from "./webpages/Settings/SettingsPage";
import AddPostPage from "./webpages/Add/AddPostPage";
import IndividualPage from "./webpages/Individual/IndividualPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage user />} />
          <Route path="/profile/1234" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post" element={<AddPostPage />} />
          <Route path="/posts/1234" element={<IndividualPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
