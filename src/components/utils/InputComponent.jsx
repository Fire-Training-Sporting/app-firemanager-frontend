import React from "react";

function InputComponent({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="block mt-4 rounded-xl">
      <span className="text-xl font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
        placeholder={placeholder || label}
      />
    </label>
  );
}

export default InputComponent;
