import { ReactNode } from "react";

type prop = {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};

export const NavButton = ({ children, type, onClick, className }: prop) => {
  return (
    <button
      className={`bg-green hover:bg-green/55 text-white text-xl rounded-full
              py-2 px-4 font-semibold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};
