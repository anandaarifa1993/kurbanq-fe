"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation"; // Both from next/navigation for App Router
import { getCookie } from "@/lib/client-cookies";
import { get, post } from "@/lib/api-bridge";
import { toast, ToastContainer } from "react-toastify";

interface payload {
  pembayaran: string;
  detailTransaksi: [
    {
      hewanId: number;
    }
  ];
}

export default function TransaksiPage() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const token = getCookie("token");
    const idUser = getCookie("id");
    if (!token) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    fetchData(id, token, idUser);
  }, [id, router]);

  async function fetchData(id: string, token: string, idUser?: string) {
    setIsLoading(true);
    try {
      const getHewanData = await get(`/hewan/get/${id}`, token);
      const getUserData = await get(`/user/get/${idUser}`, token);
      if (!getUserData.status) {
        throw new Error("Failed to fetch user data");
      }
      if (!getHewanData.status) {
        throw new Error("Failed to fetch transaction data");
      }
      setData(getHewanData.data.data);
      setUser(getUserData.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  console.log(data);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload: payload = {
      pembayaran: String(formData.get("pembayaran")),
      detailTransaksi: [
        {
          hewanId: data.idHewan,
        },
      ],
    };
    console.log("Payload:", payload);
    // TODO: Send payload to API
    const response = await post(
      "/order/new/",
      JSON.stringify(payload),
      getCookie("token") || ""
    );
    if (response.status) {
      console.log("Transaction successful:", response.data);
      // Redirect or show success message
      toast(response.data.message, {
        hideProgressBar: true,
        containerId: `toastTransaksi`,
        type: "success",
        autoClose: 2000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    } else {
      console.error("Transaction failed:", response.data.message);
      // Show error message
      toast(response.data.message, {
        hideProgressBar: true,
        containerId: `toastTransaksi`,
        type: "error",
        autoClose: 2000,
      });
    }
  };

  console.log("User data:", user);

  return (
    <>
      <ToastContainer containerId={`toastTransaksi`} />
      <section>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 text-lg">Error: {error}</div>
          </div>
        ) : data && user ? (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Transaksi Hewan</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Detail Hewan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Hewan
                  </label>
                  <p className="mt-1 text-lg">{data.kategori}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Umur
                  </label>
                  <p className="mt-1 text-lg">{data.umur} tahun</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Metode Transaksi</h2>
                <select
                  name="pembayaran"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  <option value="" disabled>
                    Pilih metode transaksi
                  </option>
                  <option value="TRANSFER">TRANSFER</option>
                  <option value="COD">COD</option>
                </select>

                <button
                  type="submit"
                  className="w-full mt-4 bg-lime-600 text-white py-3 px-4 rounded-md hover:bg-lime-700 transition duration-200"
                >
                  Proses Transaksi
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">No data available</div>
          </div>
        )}
      </section>
    </>
  );
}
