import { Outlet } from "react-router";
import Header from "./Header";

const Layout = () => {
  return (
    <div
      className="flex flex-col
        min-h-screen"
    >
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>
      <div className="grow">
        <Outlet />
      </div>

      <div className="sticky left-0 bottom-0">{/* <Footer /> */}</div>
    </div>
  );
};

export default Layout;
