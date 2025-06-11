import { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";

type props = {
  label: string;
  classname: string;
  onClick?: () => void;
  icon?: StaticImageData;
};

export const FilteringButton = ({ label, classname, onClick, icon }: props) => {
  return (
    <button
      className={`px-8 py-2 flex gap-2 items-center border-2 rounded-full border-green bg-green ${classname}`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {icon && (
        <Image src={icon} alt={`${label} icon`} width={45} height={44} />
      )}
      <span className={`text-xl font-semibold tracking-wider ${classname}`}>
        {label}
      </span>
    </button>
  );
};
