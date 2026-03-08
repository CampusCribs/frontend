import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthContextProvider from "../auth/AuthContextProvider";
import { ScrollRestorationBlocker } from "./ScrollRestorationBlocker";
import { FeedbackButton } from "./Feedback";

const Layout = () => {
  return (
    <AuthContextProvider>
      <div className="w-full flex justify-center">
        <div
          className="flex flex-col
        h-dvh w-full max-w-[600px]"
        >
          <div className="sticky top-0 z-50 bg-white">
            <Header />
          </div>
          <div className="grow shadow-sm pb-10">
            <ScrollRestorationBlocker />
            <Outlet />
          </div>

          <FeedbackButton
            bottomOffset={75}
            onSubmit={async (payload) => {
              await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
            }}
          />

          <div className="sticky left-0 bottom-0 w-full z-40">
            <Footer />
          </div>
        </div>
      </div>
    </AuthContextProvider>
  );
};

export default Layout;
