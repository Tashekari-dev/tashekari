import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaShoppingBag,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  }

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <FaChartPie />,
      end: true,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingBag />,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: <FaBoxOpen />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F1] lg:flex">
      <aside className="w-full bg-[#6B4F3A] px-5 py-6 text-white lg:min-h-screen lg:w-[270px] lg:px-6 lg:py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Tashekari
          </p>

          <h1 className="mt-2 font-heading text-3xl font-semibold">
            Admin Panel
          </h1>
        </div>

        <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 font-body text-sm transition ${
                  isActive
                    ? "bg-white text-[#6B4F3A] shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 px-4 py-3 font-body text-sm text-white transition hover:bg-white hover:text-[#6B4F3A] lg:mt-10"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
        {children}
      </main>
    </div>
  );
}