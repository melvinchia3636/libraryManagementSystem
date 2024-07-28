// client/src/components/Button.tsx

import React from "react";
import { Icon } from "@iconify/react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  icon?: string;
  iconPosition?: "left" | "right";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
  icon,
  iconPosition = "left",
}) => {
  const baseClasses =
    "px-5 py-3 justify-center rounded-md text-sm font-medium transition duration-300 inline-flex items-center";
  const disabledClasses = "bg-gray-300 text-gray-700 cursor-not-allowed";
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${
        disabled ? disabledClasses : variantClasses[variant]
      } ${className}`}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && (
        <Icon icon={icon} className="mr-2 w-4 h-4 shrink-0" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <Icon icon={icon} className="ml-2 w-4 h-4 shrink-0" />
      )}
    </button>
  );
};

export default Button;
