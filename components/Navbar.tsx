"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoonIcon,
  SunIcon,
  MenuIcon,
  LogOutIcon,
  ChevronDownIcon,
  UserCogIcon,
  ChevronUpIcon,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
// import { useAuth } from "./MicrosoftAuthProvider";
import Image from "next/image";
import Profile from "./Profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NavItem = {
  name: string;
  href: string;
  options?: { name: string; href: string }[];
};

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // const { user, loading, login, logout, isAuthenticated } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const navItems: NavItem[] = [
    { name: "Inicio", href: "/" },
    {
      name: "Ranking",
      href: "/leaderboard",
      options: [
        { name: "Ranked", href: "/leaderboard?category=ranked" },
        { name: "RSG", href: "/leaderboard?category=RSG" },
        { name: "Estados", href: "/states" },
      ],
    },
    { name: "Torneios", href: "/tournaments" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800 px-4 py-2.5">
        <div className="flex h-14 items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 font-minecraft">
            <Link href="/" className="flex items-center gap-2 px-2 py-1">
              <Image
                src="/image.png"
                alt="MCSR Logo"
                width={32}
                height={32}
                style={{ imageRendering: "pixelated" }}
                className="rounded-sm"
              />
              {/* hidden  */}
              <div className="hidden md:block">
                <span className="text-white text-xl tracking-wide drop-shadow-[1px_1px_0px_#000]">
                  MCSR Brasil
                </span>

              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2 ml-4">
              {navItems.map((item) =>
                item.options ? (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={
                          item.options
                            ? item.options.some((opt) =>
                                pathname.startsWith(opt.href)
                              ) || pathname.startsWith(item.href)
                              ? "default"
                              : "ghost"
                            : pathname === item.href
                            ? "default"
                            : "ghost"
                        }
                        className={`uppercase text-sm font-minecraft tracking-wide transition-colors rounded-sm ${
                          item.options
                            ? item.options.some((opt) =>
                                pathname.startsWith(opt.href)
                              ) || pathname.startsWith(item.href)
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "text-gray-400 hover:text-white"
                            : pathname === item.href
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-400 hover:text-white"
                        } flex items-center gap-1`}
                        size="sm"
                      >
                        {item.name}
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {item.options.map((option) => (
                        <Link key={option.href} href={option.href}>
                          <DropdownMenuItem className="font-minecraft text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            {option.name}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={`uppercase text-sm font-minecraft tracking-wide transition-colors rounded-sm ${
                        pathname === item.href
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-400 hover:text-white"
                      }`}
                      size="sm"
                    >
                      {item.name}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-indigo-500" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 p-2 bg-white dark:bg-gray-800"
              >
                {navItems.map((item) =>
                  item.options ? (
                    <div key={item.href} className="w-full">
                      <button
                        onClick={() =>
                          setExpandedItem((prev) =>
                            prev === item.href ? null : item.href
                          )
                        }
                        className={`w-full text-left flex items-center justify-between px-2 py-2 text-sm font-minecraft ${
                          item.options.some((opt) =>
                            opt.href.includes("category=")
                              ? opt.href.includes(`category=${category}`)
                              : pathname === opt.href
                          )
                            ? "text-white"
                            : "text-gray-300"
                        } hover:text-white transition`}
                      >
                        {item.name}
                        {expandedItem === item.href ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>

                      {expandedItem === item.href && (
                        <div className="ml-4">
                          {item.options.map((option) => (
                            <Link key={option.href} href={option.href}>
                              <DropdownMenuItem
                                className={`pl-4 pr-2 py-2 rounded-md font-minecraft text-sm ${
                                  (option.href.includes("category=") &&
                                    option.href.includes(
                                      `category=${category}`
                                    )) ||
                                  pathname === option.href
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {option.name}
                              </DropdownMenuItem>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={item.href} href={item.href} className="w-full">
                      <DropdownMenuItem
                        className={`p-2 rounded-md font-minecraft text-sm ${
                          pathname === item.href
                            ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                            : ""
                        }`}
                      >
                        {item.name}
                      </DropdownMenuItem>
                    </Link>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Profile />
        </DialogContent>
      </Dialog>
    </>
  );
}
