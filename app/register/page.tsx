"use client";

import { BASE_API_URL } from "@/lib/global";
import { storeCookie } from "@/lib/client-cookies";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setaddress] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const url = `${BASE_API_URL}/user/register`;
      const payload = JSON.stringify({
        nama: username,
        email: email,
        password,
        hp: phone,
        alamat: address,
      });
      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.status == true) {
        console.log("Berhasil Mendaftar:", data);

        toast(data.message, {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "success",
          autoClose: 2000,
        });
        setTimeout(() => router.replace(`/login`), 1000);
      } else {
        console.log("Daftar gagal:", data);
        toast(data.message, {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "warning",
        });
      }
    } catch (error) {
      console.log(error);
      toast(`Ada Yang Salah : ${error}`, {
        hideProgressBar: true,
        containerId: `toastLogin`,
        type: "error",
      });
    }
  };
  return (
    <div className="w-screen h-screen bg-login bg-cover">
      <ToastContainer containerId={`toastLogin`} />
      <div className="w-full h-full bg-backdrop-login flex justify-center items-center p-5">
        <div className="w-fit bg-white shadow-2xl px-24 py-16 flex flex-wrap gap-10 rounded-3xl">
          <Image
            src={"/registerloginimage.svg"}
            width={500}
            height={500}
            alt=""
          />
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold">Buat Akun</h1>

            {/* form submit login */}
            <form onSubmit={handleSubmit} className="w-full my-10">
              <div className="w-full my-4 gap-y-5">
                <div className="w-full border border-green rounded-full px-4 py-1 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-7"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    className="p-2 grow rounded-r-full focus:outline-none focus:ring-black focus:border-primary placeholder:text-green"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    id={`username`}
                  />
                </div>
                <div className="w-full border border-green rounded-full px-4 py-1 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>

                  <input
                    type="text"
                    className="p-2 grow rounded-r-full focus:outline-none focus:ring-black focus:border-primary placeholder:text-green"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    id={`email`}
                  />
                </div>
                <div className="w-full border border-green rounded-full px-4 py-1 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-7"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="p-2 grow rounded-r-full focus:outline-none focus:ring-black focus:border-primary placeholder:text-green"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    id={`password`}
                  />
                  <div
                    className="cursor-pointer p-3 text-black"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path
                          fillRule="evenodd"
                          d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="w-full border border-green rounded-full px-4 py-1 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="black"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>

                  <input
                    type="number"
                    className="p-2 grow rounded-r-full focus:outline-none focus:ring-black focus:border-primary placeholder:text-green"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    id={`phone`}
                  />
                </div>
                <div className="w-full border border-green rounded-full px-4 py-1 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="white"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>

                  <input
                    type="text"
                    className="p-2 grow rounded-r-full focus:outline-none focus:ring-black focus:border-primary placeholder:text-green"
                    value={address}
                    onChange={(e) => setaddress(e.target.value)}
                    placeholder="Address"
                    id={`address`}
                  />
                </div>

                <div className="my-4">
                  <button
                    type="submit"
                    className="bg-[#43b031] hover:bg-green-800 uppercase font-bold tracking-wider w-full p-3 rounded-full text-white"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <h2>Sudah mempunyai akun?</h2>
            <Link href={"/login"}>
              <button className="w-full bg-primary border border-green rounded-full p-3 mt-2 hover:bg-green-200">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
