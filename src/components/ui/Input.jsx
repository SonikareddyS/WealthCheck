import React from "react";

export const Input = ({
  label,
  id,
  error,
  hint,
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

      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-sm
          text-gray-900
          placeholder:text-gray-400
          transition-all
          duration-200
          hover:border-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20
          focus:border-primary
          focus:shadow-sm
          disabled:cursor-not-allowed
          disabled:bg-gray-50
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-300"}
        `}
        {...props}
      />

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