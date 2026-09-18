import React from "react";

export const Select = ({
  label,
  id,
  options,
  error,
  hint,
  placeholder = "Select an option",
  className = "",
  ...props
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 text-sm font-medium text-gray-800"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy}
        className={`
          w-full rounded-lg border bg-white
          px-4 py-2.5 text-sm text-gray-900
          transition-colors
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20
          focus:border-primary
          ${error ? "border-red-500" : "border-gray-300"}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {hint && !error && (
        <span
          id={hintId}
          className="mt-1 text-xs text-gray-500"
        >
          {hint}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </span>
      )}
    </div>
  );
};