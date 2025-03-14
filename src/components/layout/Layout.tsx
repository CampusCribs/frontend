import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="w-full flex justify-center">
      <div
        className="flex flex-col
        min-h-screen w-full max-w-[600px] shadow-xl"
      >
        <div className="sticky top-0 z-50 bg-white">
          <Header />
        </div>
        <div className="grow">
          <Outlet />
        </div>

        <div className="sticky left-0 bottom-0">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
