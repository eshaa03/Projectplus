import Sidebar from "./Sidebar";
import NavigationMenu from "./Navbar";
import "./MainLayout.css";

const MainLayout = ({ children, user }) => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-main">
        {/* TOP NAV BAR */}
        <NavigationMenu user={user} />

        {/* PAGE CONTENT */}
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
