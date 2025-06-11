"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation"; // Import dari next/navigation
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/client-cookies";
import { get } from "@/lib/api-bridge";
import { BASE_API_URL } from "@/lib/global";
import Image from "next/image";

interface AnimalDetailProps {
  idHewan: number;
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

interface CartItem {
  hewanId: number;
}

export default function AnimalDetailPage() {
  const router = useRouter();
  const params = useParams(); // Gunakan useParams untuk mendapatkan parameter
  const id = params?.id as string; // Get id from params

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnimalDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    // Check authentication first
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch data if id is available
    if (id) {
      fetchData(id);
    }
  }, [id, router]);

  async function fetchData(animalId: string) {
    setIsLoading(true);
    setError(null);

    try {
      const token = getCookie("token");

      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Fetching animal with ID:", animalId);
      const response = await get(`/hewan/get/${animalId}`, token);

      console.log("API Response:", response);

      if (!response.status) {
        throw new Error(response.message || "Failed to fetch animal details");
      }

      const animalData = response.data?.data;
      console.log("Animal data fetched:", animalData);

      if (!animalData) {
        throw new Error("Animal data not found");
      }

      setData(animalData);
    } catch (error: any) {
      console.error("Error fetching animal details:", error);
      setError(error.message || "An error occurred while fetching data");

      // Handle authentication errors
      if (
        error.message?.includes("unauthorized") ||
        error.message?.includes("401")
      ) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Cart functions
  const addToCart = (hewanId: number) => {
    setIsAddingToCart(true);

    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("cart");
      let cartItems: CartItem[] = [];

      if (existingCart) {
        cartItems = JSON.parse(existingCart);
      }

      // Add new item to cart
      const newItem: CartItem = { hewanId };
      cartItems.push(newItem);

      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems));

      console.log("Item added to cart:", newItem);
      console.log("Current cart:", cartItems);

      // Optional: Show success message
      alert("Berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Gagal menambahkan ke keranjang!");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getCartItems = (): CartItem[] => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error getting cart items:", error);
      return [];
    }
  };

  const isInCart = (hewanId: number): boolean => {
    const cartItems = getCartItems();
    return cartItems.some((item) => item.hewanId === hewanId);
  };

  // Helper function to construct image URL
  const getImageUrl = (foto: string) => {
    if (!foto) return "/domba.svg"; // fallback image path
    return `${BASE_API_URL}/hewan_picture/${foto}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading animal details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl mb-4">Animal not found</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image section */}
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full">
                <Image
                  src={getImageUrl(data.foto)}
                  alt={`${data.kategori} - ${data.idHewan}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "/domba.svg";
                  }}
                />
              </div>
            </div>

            {/* Details section */}
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <span className="inline-block bg-lime-100 text-lime-800 text-sm px-3 py-1 rounded-full">
                  {data.kategori}
                </span>
                <span
                  className={`ml-2 inline-block text-sm px-3 py-1 rounded-full ${
                    data.statusHewan === "TERSEDIA"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {data.statusHewan}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {data.kategori} #{data.idHewan}
              </h1>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Berat:</span>
                  <span className="font-semibold">{data.berat} kg</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Umur:</span>
                  <span className="font-semibold">{data.umur} tahun</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Harga:</span>
                  <span className="font-bold text-2xl text-green-600">
                    {formatCurrency(data.harga)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deskripsi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {data.deskripsi || "Tidak ada deskripsi tersedia."}
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  className={`w-full bg-lime-600 text-white py-3 px-6 rounded-lg hover:bg-lime-700 transition-colors font-semibold ${
                    data.statusHewan !== "TERSEDIA"
                      ? " opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={data.statusHewan !== "TERSEDIA"}
                  onClick={() => {
                    if (data.statusHewan === "TERSEDIA") {
                      router.push(`/hewan/${data.idHewan}/transaksi`);
                    }
                  }}
                >
                  {data.statusHewan === "TERSEDIA"
                    ? "Pesan Sekarang"
                    : "Tidak Tersedia"}
                </button>

                <button
                  className={`w-full py-3 px-6 rounded-lg transition-colors font-semibold ${
                    data.statusHewan !== "TERSEDIA"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isInCart(data.idHewan)
                      ? "bg-green-200 text-green-800 hover:bg-green-300"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  disabled={data.statusHewan !== "TERSEDIA" || isAddingToCart}
                  onClick={() => {
                    if (data.statusHewan === "TERSEDIA") {
                      addToCart(data.idHewan);
                    }
                  }}
                >
                  {isAddingToCart
                    ? "Menambahkan..."
                    : isInCart(data.idHewan)
                    ? "✓ Sudah di Keranjang"
                    : "Tambah ke Keranjang"}
                </button>
              </div>

              {/* Additional info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500 space-y-1">
                  <p>ID Penjual: {data.idPenjual}</p>
                  <p>
                    Ditambahkan:{" "}
                    {new Date(data.createdAt).toLocaleDateString("id-ID")}
                  </p>
                  {data.updatedAt !== data.createdAt && (
                    <p>
                      Diperbarui:{" "}
                      {new Date(data.updatedAt).toLocaleDateString("id-ID")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
