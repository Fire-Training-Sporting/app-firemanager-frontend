import { NavLink as RouterNavLink } from "react-router-dom";

export default function NavLink({ children, to, onClick, icon, collapsed = false }) {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      title={collapsed ? children : undefined}
      aria-label={collapsed ? children : undefined}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg border-2 py-2 font-semibold whitespace-nowrap transition-colors duration-200 ${
          collapsed ? "justify-center px-0" : "px-4"
        } ${
          isActive
            ? "border-white bg-white text-[#F8821E] shadow-md"
            : "border-transparent text-white hover:border-white"
        }`
      }
    >
      {/* O PNG é usado como máscara para o ícone herdar a cor do texto
          (branco normalmente, laranja quando o item está ativo). Sem ícone,
          o espaço é mantido para o texto continuar alinhado com os demais. */}
      <span
        aria-hidden="true"
        className={`h-5 w-5 shrink-0 ${icon ? "bg-current" : ""}`}
        style={
          icon
            ? {
                maskImage: `url("${icon}")`,
                WebkitMaskImage: `url("${icon}")`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }
            : undefined
        }
      />

      {!collapsed && <span>{children}</span>}
    </RouterNavLink>
  );
}
