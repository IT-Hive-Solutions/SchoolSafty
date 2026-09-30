import Image from "next/image";
import { Suspense } from "react";
import { RegistrationSuccessPopup } from "@/components/RegistrationSuccessPopup";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative">
      <Suspense fallback={null}>
        <RegistrationSuccessPopup />
      </Suspense>

      <div className="flex flex-col gap-4 text-base font-medium">
        <a
          className="flex h-12 w-[200px] items-center justify-center gap-2 rounded-full bg-black px-5 text-white transition-colors hover:bg-gray-800"
          href="/login"
        >
          Login
        </a>
        <a
          className="flex h-12 w-[200px] items-center justify-center rounded-full border border-solid border-gray-300 px-5 text-black transition-colors hover:bg-gray-100"
          href="/register"
        >
          Register
        </a>
      </div>
    </div>
  );
}
