import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface HewanProps {
  title: string;
  description: string;
  image: string | StaticImport;
  link: string;
  price?: number;
}

export default function Hewan({
  title,
  description,
  image,
  link,
  price,
}: HewanProps) {
  return (
    <>
      <Link href={link} className="block">
        <div className="flex flex-col gap-2 items-center justify-center p-4 bg-transparent rounded-lg hover:-translate-y-2 hover:bg-slate-100 w-64 duration-300">
          <Image
            src={image}
            alt={title}
            width={192}
            height={192}
            className="w-48 h-48 mb-4 rounded-lg"
          />
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
          <p>Rp. {price}</p>
        </div>
      </Link>
    </>
  );
}
