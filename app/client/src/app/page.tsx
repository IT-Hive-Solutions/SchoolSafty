import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative">
      <div className="flex flex-col gap-4 text-base font-medium">
        <a
          className="flex h-12 w-[200px] items-center justify-center gap-2 rounded-full bg-black px-5 text-white transition-colors hover:bg-gray-800"
          href="/login"
        >
          Login
        </a>
      </div>
    </div>
  );
}
