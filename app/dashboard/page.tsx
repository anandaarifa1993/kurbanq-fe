"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Item } from "@/components/keunggulan";
import { FilteringButton } from "@/components/button/filtering";
import { useRouter } from "next/navigation"; // Import useRouter

import mainImage from "@/public/landingImage.svg";
import domba from "@/public/domba.svg";
import sapi from "@/public/sapi.svg";
import kambing from "@/public/kambing.svg";

import keunggulan1 from "@/public/keunggulan1.svg";
import keunggulan2 from "@/public/keunggulan2.svg";
import keunggulan3 from "@/public/keunggulan3.svg";

import logoFilterDomba from "@/public/logoDomba.png";
import logoFilterSapi from "@/public/logoSapi.png";
import logoFilterKambing from "@/public/logoKambing.png";
import Hewan from "@/components/Hewan";
import { getCookie } from "@/lib/client-cookies";
import { get } from "@/lib/api-bridge";
import { BASE_API_URL } from "@/lib/global";

// Updated interface to match API response
interface HewanProps {
  idHewan: number;
  uuid: string;
  berat: string;
  umur: number;
  harga: number;
  kategori: string;
  deskripsi: string;
  foto: string;
  statusHewan: string;
  idPenjual: number;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<HewanProps[]>([]);
  const [filteredData, setFilteredData] = useState<HewanProps[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("Semua"); // State untuk filter aktif

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  // Filter data whenever data or activeFilter changes
  useEffect(() => {
    if (activeFilter === "Semua") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (hewan) => hewan.kategori.toLowerCase() === activeFilter.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [data, activeFilter]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const token = getCookie("token");
      console.log("Token:", token); // Debug log

      if (!token) {
        router.push("/login");
        return; // Redirect to login if token is not present
      }

      const response = await get("/hewan/get", token || "");
      console.log("Full response:", response); // Debug log

      if (!response.status) {
        console.error("Failed to fetch data:", response.message);
        return;
      } else {
        console.log("Data fetched successfully:", response.data);
        console.log("Full response structure:", response);

        // The response.data contains the whole API response
        // We need to access response.data.data to get the actual array
        const animalData = response.data?.data || [];
        setData(animalData);
        console.log("Setting data:", animalData);
        console.log("Animal data length:", animalData.length);
        console.log("Is animal data array?", Array.isArray(animalData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error details:", error.message); // More detailed error
    } finally {
      setIsLoading(false);
    }
  }

  // Fungsi untuk handle filter
  const handleFilter = (kategori: string) => {
    setActiveFilter(kategori);
  };

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  ]);

  // Helper function to construct image URL
  const getImageUrl = (foto: string) => {
    if (!foto) return domba; // fallback image

    return `${BASE_API_URL}/hewan_picture/${foto}`;
  };

  // Helper function untuk menentukan style button aktif
  const getButtonStyle = (kategori: string) => {
    return activeFilter === kategori ? "" : "bg-white";
  };

  return (
    // image carousel
    <>
      <div className="embla pl-80 mb-10" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <Image src={mainImage} alt="" className="imageLandingpage"></Image>
          </div>
          <div className="embla__slide">
            <Image src={domba} alt="" className="imageLandingpage"></Image>
          </div>
          <div className="embla__slide">
            <Image src={sapi} alt="" className="imageLandingpage"></Image>
          </div>
          <div className="embla__slide">
            <Image src={kambing} alt="" className="imageLandingpage"></Image>
          </div>
        </div>
      </div>

      <div className="flex mb-32">
        <Item
          title="Layanan Praktis"
          description="Bisa pesan online di website QurbanQ"
          icon={keunggulan1}
        />
        <Item
          title="Hewan Berkualitas"
          description="Kesehatan terjaga dengan baik"
          icon={keunggulan2}
        />
        <Item
          title="Pelayanan Cepat"
          description="Langsung sat set wat wet"
          icon={keunggulan3}
        />
      </div>

      <div className="flex w-full justify-evenly">
        <Image src={domba} alt="" width={400}></Image>
        <Image src={sapi} alt="" width={400}></Image>
        <Image src={kambing} alt="" width={400}></Image>
      </div>

      <h1 className="pl-14 w-full text-4xl font-bold my-24">Hewan Kurban</h1>

      <div className="w-full pl-14 flex gap-10 justify-start">
        {/* Button Semua - untuk menampilkan semua hewan */}
        <FilteringButton
          label="Semua"
          classname={getButtonStyle("Semua")}
          onClick={() => handleFilter("Semua")}
        />
        <FilteringButton
          label="Domba"
          classname={getButtonStyle("Domba")}
          icon={logoFilterDomba}
          onClick={() => handleFilter("Domba")}
        />
        <FilteringButton
          label="Sapi"
          classname={getButtonStyle("Sapi")}
          icon={logoFilterSapi}
          onClick={() => handleFilter("Sapi")}
        />
        <FilteringButton
          label="Kambing"
          classname={getButtonStyle("Kambing")}
          icon={logoFilterKambing}
          onClick={() => handleFilter("Kambing")}
        />
      </div>

      <div className="flex flex-row flex-wrap gap-10 pl-14 mb-24 mt-24 w-full justify-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredData.length > 0 ? (
          filteredData.map((hewan) => (
            <Hewan
              key={hewan.idHewan}
              title={hewan.kategori}
              description={hewan.deskripsi}
              image={getImageUrl(hewan.foto)}
              link={`/hewan/${hewan.idHewan}`}
              price={hewan.harga}
            />
          ))
        ) : (
          <p>
            {activeFilter === "Semua"
              ? "No data available. Check console for errors."
              : `Tidak ada hewan ${activeFilter} yang tersedia.`}
          </p>
        )}
      </div>
    </>
  );
}
