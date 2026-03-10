import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "@/components/layout/Layout";

import CribsPage from "@/pages/cribs/CribsPage";

import ProtectedRoute from "@/components/route/ProtectedRoute";
import ReverseProtectedRoute from "@/components/route/ReverseProtectedRoute";
import LoginPage from "@/pages/login/LoginPage";
import SupportPage from "./pages/settings/support/SupportPage";
import Post from "@/pages/post/Post";
import IndividualPage from "./pages/cribs/individual/IndividualPage";
import SettingsPage from "./pages/settings/SettingsPage";
import Privacy from "./pages/settings/privacy/Privacy";
import Account from "./pages/settings/account/Account";

import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import About from "./pages/about/About";
// import { EmailChangeFlow } from "./pages/settings/account/EmailChangeFlow";
import EmailInitiate from "./pages/settings/account/email/EmailInitiate";
import EmailVerification from "./pages/settings/account/email/EmailVerification";
import Chats from "./pages/chat/Chats";

import Home from "./pages/home/Home";
import Map from "./pages/map/Map";
import IndividualChat from "./pages/chat/IndividualChat";
import Onboarding from "./pages/onboarding/Onboarding";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationsSettingsPage from "./pages/settings/notifications/Notifications";
import ProfileSettingsPage from "./pages/settings/profile/Profile";
import NotificationsInboxPage from "./pages/notifications/Notifications";
import ProfileUsernamePage from "./pages/profile/username/ProfileUsernamePage";

// import Partners from "./pages/partners/Partners";

function App() {
  return (
    // Default font is Inter
    <div className="font-['Inter']">
      <BrowserRouter>
        <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<Layout />}>
              <Route path="/cribs" element={<CribsPage />} />
              <Route path="/cribs/:postId" element={<IndividualPage />} />
              {/* <Route path="/map" element={<Map />} /> */}

              <Route
                path="/notifications"
                element={<NotificationsInboxPage />}
              />
              <Route path="/chats" element={<Chats />} />
              {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/privacy" element={<Privacy />} />
              <Route path="/settings/account" element={<Account />} />
              <Route path="/settings/support" element={<SupportPage />} />
              <Route
                path="/settings/profile"
                element={<ProfileSettingsPage />}
              />
              <Route
                path="/settings/notifications"
                element={<NotificationsSettingsPage />}
              />
              <Route
                path="/settings/account/email"
                element={<EmailInitiate />}
              />
              <Route
                path="/settings/account/email-verification"
                element={<EmailVerification />}
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/profile/:username"
                element={<ProfileUsernamePage />}
              />
              <Route path="/post" element={<Post />} />
              {/* </Route> */}
              <Route element={<ReverseProtectedRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Route>
            <Route path="/chats/:username" element={<IndividualChat />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/partners" element={<Partners />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
