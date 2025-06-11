"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/client-cookies";
import { get, post } from "@/lib/api-bridge";
import { BASE_API_URL } from "@/lib/global";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

interface CartItem {
  hewanId: number;
}

interface HewanDetail {
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

interface CartItemWithDetail extends CartItem {
  detail?: HewanDetail;
  isLoading?: boolean;
  error?: string;
  index?: number; // Add index for tracking
}

interface OrderPayload {
  pembayaran: string;
  detailTransaksi: {
    hewanId: number;
  }[];
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadCartItems();
  }, [router]);

  const loadCartItems = () => {
    try {
      // Get cart items from localStorage
      const cartData = localStorage.getItem("cart");
      if (!cartData) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      const parsedCart: CartItem[] = JSON.parse(cartData);

      // Initialize cart items with loading state and index
      const initialItems: CartItemWithDetail[] = parsedCart.map(
        (item, index) => ({
          ...item,
          isLoading: true,
          index, // Store original index
        })
      );

      setCartItems(initialItems);

      // Fetch details for each item
      fetchCartItemsDetails(parsedCart);
    } catch (error) {
      console.error("Error loading cart items:", error);
      setCartItems([]);
      setIsLoading(false);
    }
  };

  const fetchCartItemsDetails = async (items: CartItem[]) => {
    const token = getCookie("token");
    if (!token) return;

    // Fetch details for each unique hewanId
    const uniqueIds = [...new Set(items.map((item) => item.hewanId))];
    const detailPromises = uniqueIds.map(async (hewanId) => {
      try {
        const response = await get(`/hewan/get/${hewanId}`, token);
        return {
          hewanId,
          detail: response.status ? response.data?.data : null,
          error: response.status ? null : response.message,
        };
      } catch (error) {
        return {
          hewanId,
          detail: null,
          error: error.message || "Failed to fetch animal details",
        };
      }
    });

    const results = await Promise.all(detailPromises);
    const detailsMap = new Map();
    results.forEach((result) => {
      detailsMap.set(result.hewanId, {
        detail: result.detail,
        error: result.error,
      });
    });

    // Update cart items with fetched details
    const updatedItems: CartItemWithDetail[] = items.map((item, index) => {
      const fetchResult = detailsMap.get(item.hewanId);
      return {
        ...item,
        detail: fetchResult?.detail,
        error: fetchResult?.error,
        isLoading: false,
        index, // Maintain index
      };
    });

    setCartItems(updatedItems);
    setIsLoading(false);
  };

  const removeItem = (itemIndex: number) => {
    try {
      // Remove from state by index
      const updatedItems = cartItems.filter((_, index) => index !== itemIndex);
      setCartItems(updatedItems);

      // Update localStorage - remove by index
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCartData = currentCart.filter(
        (_: any, index: number) => index !== itemIndex
      );
      localStorage.setItem("cart", JSON.stringify(updatedCartData));

      console.log("Item removed from cart at index:", itemIndex);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.detail?.harga || 0);
    }, 0);
  };

  const getImageUrl = (foto: string) => {
    if (!foto) return "/domba.svg";
    return `${BASE_API_URL}/hewan_picture/${foto}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast("Silakan pilih metode pembayaran!", {
        hideProgressBar: true,
        containerId: `toastNotify`,
        type: "warning",
        autoClose: 2000,
      });
      return;
    }

    if (cartItems.length === 0) {
      toast("Keranjang kosong!", {
        hideProgressBar: true,
        containerId: `toastNotify`,
        type: "warning",
        autoClose: 2000,
      });
      return;
    }

    // Check if any items have errors or are unavailable
    const unavailableItems = cartItems.filter(
      (item) =>
        item.error || !item.detail || item.detail.statusHewan !== "TERSEDIA"
    );

    if (unavailableItems.length > 0) {
      toast(
        "Beberapa item tidak tersedia. Silakan hapus item yang bermasalah.",
        {
          hideProgressBar: true,
          containerId: `toastNotify`,
          type: "warning",
          autoClose: 2000,
        }
      );
      return;
    }

    setIsCheckingOut(true);

    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Create payload
      const payload: OrderPayload = {
        pembayaran: paymentMethod,
        detailTransaksi: cartItems.map((item) => ({
          hewanId: item.hewanId,
        })),
      };

      console.log("Checkout payload:", payload);

      // Send order to API
      const response = await post(
        "/order/new/",
        JSON.stringify(payload),
        token
      );

      if (response.status) {
        console.log("Order successful:", response.data);

        // Clear cart after successful order
        clearCart();

        toast("Pesanan berhasil dibuat!", {
          hideProgressBar: true,
          containerId: `toastNotify`,
          type: "success",
          autoClose: 2000,
        });
        // Add 2 second delay before redirecting
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        console.error("Order failed:", response.message);
        toast(`Gagal membuat pesanan: ${response.data.message}`, {
          hideProgressBar: true,
          containerId: `toastNotify`,
          type: "error",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast("Terjadi kesalahan saat checkout!", {
        hideProgressBar: true,
        containerId: `toastNotify`,
        type: "error",
        autoClose: 2000,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading keranjang...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer containerId={`toastNotify`} />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Keranjang kosong</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-lime-500 text-white px-6 py-2 rounded hover:bg-lime-600"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.hewanId}-${index}`}
                  className="border rounded-lg p-4 flex items-center gap-4"
                >
                  {item.isLoading ? (
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                  ) : item.error ? (
                    <div className="w-20 h-20 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-500 text-xs">Error</span>
                    </div>
                  ) : (
                    <div className="relative w-20 h-20">
                      <Image
                        src={getImageUrl(item.detail?.foto || "")}
                        alt={item.detail?.kategori || "Animal"}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/domba.svg";
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    {item.isLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    ) : item.error ? (
                      <div>
                        <h3 className="font-semibold text-red-500">
                          Error loading item
                        </h3>
                        <p className="text-sm text-red-400">{item.error}</p>
                        <p className="text-sm text-gray-500">
                          ID: {item.hewanId}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold">
                          {item.detail?.kategori} #{item.detail?.idHewan}
                        </h3>
                        <p className="text-gray-600">
                          {item.detail?.berat} kg • {item.detail?.umur} tahun
                        </p>
                        <p className="font-bold text-green-600">
                          {formatCurrency(item.detail?.harga || 0)}
                        </p>
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                            item.detail?.statusHewan === "TERSEDIA"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.detail?.statusHewan}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Metode Pembayaran</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="" disabled>
                  Pilih metode pembayaran
                </option>
                <option value="TRANSFER">Transfer Bank</option>
                <option value="COD">Cash on Delivery (COD)</option>
              </select>
            </div>

            {/* Total and Checkout */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">
                  Total: {formatCurrency(getTotalPrice())}
                </span>
                <div className="text-sm text-gray-500">
                  {cartItems.length} item(s)
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={
                  isCheckingOut || !paymentMethod || cartItems.length === 0
                }
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isCheckingOut || !paymentMethod || cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-lime-600 text-white hover:bg-lime-700"
                }`}
              >
                {isCheckingOut ? "Memproses..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
