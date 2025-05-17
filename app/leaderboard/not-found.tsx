// app/not-found.tsx
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full overflow-hidden fixed inset-0 flex flex-col items-center justify-center bg-[#0f172a] text-white p-2 font-minecraft text-center">
      <Image
        src="/image.png"
        alt="Steve confused"
        width={48}
        height={48}
        className="mb-3 w-12 h-16 animate-pulse"
        style={{ imageRendering: "pixelated" }}
        unoptimized/>
      <h1 className="text-2xl sm:text-3xl  mb-2">404 - BLOCK NOT FOUND</h1>
      <p className="text-sm sm:text-base text-gray-300 max-w-xs mb-4">
        Oops! You seem to have dug too deep and ended up in the void. 🕳️
      </p>
      <Link href="/" className="px-4 py-1.5 bg-white text-black border border-gray-700 rounded shadow hover:scale-105 transition-transform">
        Return to the Overworld
      </Link>
    </div>
  );
}