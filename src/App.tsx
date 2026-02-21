import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router";
import Layout from "@/components/layout/Layout";

import CribsPage from "@/pages/cribs/CribsPage";

import ProtectedRoute from "@/components/route/ProtectedRoute";
import ReverseProtectedRoute from "@/components/route/ReverseProtectedRoute";
import LoginPage from "@/pages/login/LoginPage";
import SupportPage from "./pages/support/SupportPage";
import Post from "@/pages/profile/post/Post";
import IndividualPage from "./pages/cribs/individual/IndividualPage";
import SettingsPage from "./pages/settings/SettingsPage";
import General from "./pages/settings/general/General";
import Notifications from "./pages/settings/notifications/Notifications";
import Account from "./pages/settings/account/Account";
import EditProfile from "./pages/profile/edit/EditProfile";
import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";

import About from "./pages/about/About";
// import { EmailChangeFlow } from "./pages/settings/account/EmailChangeFlow";
import EmailInitiate from "./pages/settings/account/email/EmailInitiate";
import EmailVerification from "./pages/settings/account/email/EmailVerification";
import Favorited from "./pages/favorites/Favorited";
import Chats from "./pages/chat/Chats";
import Community from "./pages/community/Community";
import Home from "./pages/home/Home";
import Map from "./pages/map/Map";
import IndividualChat from "./pages/chat/IndividualChat";
import UltraMinimalOnboarding from "./pages/login/NewUserFlow";
import PostBlog from "./pages/profile/post/PostBlog";
import { ProfileNavHome, ProfileNavUsername } from "./pages/profile/ProfileNav";
import { IndividualCommunityExample } from "./pages/community/IndividualCommunity";
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
            <Route path="/onboarding" element={<UltraMinimalOnboarding />} />
            <Route element={<Layout />}>
              <Route path="/cribs" element={<CribsPage />} />
              <Route path="/cribs/:postId" element={<IndividualPage />} />
              <Route path="/map" element={<Map />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/community" element={<Community />} />
              <Route
                path="/community/:id"
                element={<IndividualCommunityExample />}
              />
              <Route path="/chats" element={<Chats />} />
              <Route
                path="/profile/:username"
                element={<ProfileNavUsername />}
              />
              <Route path="/favorites" element={<Favorited />} />
              {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/general" element={<General />} />
              <Route path="/settings/account" element={<Account />} />
              <Route
                path="/settings/account/email"
                element={<EmailInitiate />}
              />
              <Route
                path="/settings/account/email-verification"
                element={<EmailVerification />}
              />
              <Route
                path="/settings/notifications"
                element={<Notifications />}
              />
              <Route path="/profile" element={<ProfileNavHome />} />

              <Route path="/profile/post/crib" element={<Post />} />
              <Route path="/profile/post" element={<PostBlog />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              {/* </Route> */}

              <Route element={<ReverseProtectedRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Route>
            <Route path="/chats/:chatId" element={<IndividualChat />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/partners" element={<Partners />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Routes></Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
