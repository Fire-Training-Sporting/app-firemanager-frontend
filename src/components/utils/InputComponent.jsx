import React from "react";

function InputComponent({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  id,
  name,
  autoComplete,
  containerClassName = "block mb-4 rounded-xl",
  labelClassName = "text-xl font-semibold",
  inputWrapperClassName = "mt-1 relative",
  inputClassName = "mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black",
  leftIcon,
  rightIcon,
  rightAction,
  rightActionAriaLabel = "Campo",
}) {
  return (
    <label className={containerClassName} htmlFor={id}>
      <span className={labelClassName}>{label}</span>

      <div className={inputWrapperClassName}>
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7682]" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={inputClassName}
          placeholder={placeholder || label}
        />

        {rightIcon ? (
          rightAction ? (
            <button
              type="button"
              onClick={rightAction}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7682] transition hover:text-[#454b55]"
              aria-label={rightActionAriaLabel}
            >
              {rightIcon}
            </button>
          ) : (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7682]" aria-hidden="true">
              {rightIcon}
            </span>
          )
        ) : null}
      </div>
    </label>
  );
}

export default InputComponent;
