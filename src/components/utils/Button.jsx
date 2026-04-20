import React from "react";

function Button({ children, onClick, className, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-4 py-3 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;