import { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";

type prop = {
  title: string;
  description: string;
  icon: StaticImageData
};

export const Item = ({ title, description, icon }: prop) => {
  return (
    <div className="flex gap-2 mr-12">
      <Image src={icon} alt="" width={50} height={50}></Image>
      <div className="">
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};
