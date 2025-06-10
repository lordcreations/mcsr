import Image from "next/image"

export default function SearchBar({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 px-1 gap-2 w-full">
      <h2 className="text-2xl font-minecraft px-4 py-1 bg-gray-900 dark:bg-white text-white dark:text-black rounded shadow whitespace-nowrap pb-2">
        MAIS JOGADORES
      </h2>
      <div className="relative w-[220px]">
        <Image
          src="/spyglass.webp"
          alt="Search"
          width={16}
          height={16}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
          loading="lazy"
        />
        <input
          type="text"
          placeholder="Procurar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded text-sm font-sans outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
    </div>
  )
}
