import Image, { StaticImageData } from "next/image";

type props = {
  image: StaticImageData;
  jenis: string;
  nama: string;
  harga: number;
};

export const ProdukContainer = ({ image, jenis, nama, harga }: props) => {
  return (
    <div className="text-center">
      <Image src={image} alt={`${jenis} image`} />
      <span className="text-lime-200">{jenis}</span>
      <h1 className="">{nama}</h1>
      <h3 className="text-red-600">Rp. {harga}</h3>
    </div>
  );
};
