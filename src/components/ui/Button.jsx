import React from "react";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-white shadow-sm hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md focus:ring-primary",

    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:-translate-y-0.5 hover:shadow-sm focus:ring-gray-400",

    outline:
      "border-2 border-primary text-primary hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-sm focus:ring-primary",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};