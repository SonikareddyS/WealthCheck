import React from "react";

export const Card = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-xl
        shadow-sm
        border
        border-gray-100
        p-6
        transition-all
        duration-200
        ${onClick
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-gray-200"
          : "hover:shadow-md"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};