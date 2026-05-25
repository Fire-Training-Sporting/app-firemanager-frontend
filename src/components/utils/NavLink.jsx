import { NavLink as RouterNavLink } from "react-router-dom";

export default function NavLink({ children, to }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
          isActive
            ? "bg-white text-[#F8821E] shadow-md scale-105"
            : "text-white hover:bg-[#EA580C] hover:shadow-lg"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}