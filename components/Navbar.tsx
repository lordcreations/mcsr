"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon, MenuIcon, LogOutIcon, ChevronDownIcon, UserCogIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useAuth } from "./MicrosoftAuthProvider"
import Image from "next/image"
import Profile from "./Profile"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, loading, login, logout, isAuthenticated } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  
  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Ranking", href: "/leaderboard" },
    { name: "Torneios", href: "/tournaments" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) return null

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
              <span className="text-white text-xl tracking-wide drop-shadow-[1px_1px_0px_#000]">
                MCSR Brasil
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4 ml-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`uppercase text-md tracking-wide px-2 py-0.5 transition-colors ${
                      pathname === item.href
                        ? " border-white text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              loading ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded hidden sm:block"></div>
                </div>
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 pr-2 pl-3 relative group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border-2 border-transparent transition-all">
                          <AvatarImage 
                            src={user?.uuid ? `/api/player-head?uuid=${user.uuid}` : undefined} 
                            alt={user?.displayName || "Player"} 
                            style={{ imageRendering: "pixelated" }}
                          />
                          <AvatarFallback className="bg-green-600 text-white">
                            {user?.displayName?.substring(0, 2).toUpperCase() || "MC"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <span className="hidden sm:inline-block truncate max-w-[100px] font-minecraft text-sm">
                        {user?.displayName || "Player"}
                      </span>
                      
                      <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 animate-bounce group-hover:text-blue-500 transition-colors" />
                      
                      <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-transparent group-hover:bg-blue-500 transition-colors"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center gap-3 p-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                      <Avatar className="h-14 w-14">
                        <AvatarImage 
                          src={user?.uuid ? `/api/player-head?uuid=${user.uuid}` : undefined} 
                          alt={user?.displayName || "Player"}
                          style={{ imageRendering: "pixelated" }}
                        />
                        <AvatarFallback className="bg-green-600 text-white">
                          {user?.displayName?.substring(0, 2).toUpperCase() || "MC"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-minecraft text-sm text-black dark:text-white">
                          {user?.displayName || "Player"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Minecraft User
                        </span>
                      </div>
                    </div>
                    
                    <DropdownMenuItem 
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setProfileOpen(true);
                      }}
                    >
                      <UserCogIcon className="h-4 w-4" />
                      <span className="font-minecraft text-sm">Edit Profile</span>
                    </DropdownMenuItem>
                    
                    <Link href="/stats">
                      <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-minecraft text-sm">Your Stats</span>
                      </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuSeparator className="my-1 border-gray-200 dark:border-gray-700" />
                    
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="flex items-center gap-2 p-2 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span className="font-minecraft text-sm">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => {
                    login();
                  }} 
                  variant="default" 
                  className="flex items-center gap-2 font-minecraft text-sm bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>

                      Login with Minecraft
                      <ChevronDownIcon className="h-4 w-4 ml-1 animate-bounce" />
                    </>
                  )}
                </Button>
              )
            )}
            
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
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 bg-white dark:bg-gray-800">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="w-full">
                    <DropdownMenuItem className={`p-2 rounded-md ${pathname === item.href ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""}`}>
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
                <Separator className="my-1" />
                <Link href="https://mcsrranked.com" className="w-full" target="_blank">
                  <DropdownMenuItem className="p-2 rounded-md flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="https://mcsrranked.com/img/logo.webp" alt="MCSR Ranked" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    MCSR Ranked
                  </DropdownMenuItem>
                </Link>
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
  )
}
