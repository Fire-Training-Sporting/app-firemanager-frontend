import React from "react";

function FormField({ label, type = "text", value, onChange, options = [] }) {
  return (
    <label className="block mb-4 bg-black rounded-xl">
      {label && <span className="text-xl font-semibold">{label}</span>}
      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
          placeholder={label}
        />
      )}
    </label>
  );
}

export default FormField;