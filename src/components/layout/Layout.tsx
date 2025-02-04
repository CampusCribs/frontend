import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div
      className="flex flex-col
        min-h-screen">
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>
      <div className="grow">
        <Outlet />
      </div>

      <div className="sticky bottom-0 z-50 bg-white">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
