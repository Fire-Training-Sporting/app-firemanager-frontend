import { NavLink as RouterNavLink } from "react-router-dom";

export default function NavLink({ children, to, onClick }) {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block w-full rounded-lg px-4 py-2 font-semibold transition-colors duration-200 lg:w-auto ${
          isActive
            ? "bg-white text-[#F8821E] shadow-md"
            : "text-white hover:bg-[#EA580C] hover:shadow-lg"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}