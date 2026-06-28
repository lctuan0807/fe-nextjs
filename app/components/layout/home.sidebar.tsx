"use client";
import {
  Tv,
  Keyboard,
  Mouse,
  Headphones,
  Home,
  Compass,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../button";

export default function HomeSidebar() {
  const isLoggedIn = false;

  const categories = [
    { name: "Monitors", icon: <Tv size={20} />, link: "/categories/monitors" },
    {
      name: "Keyboards",
      icon: <Keyboard size={20} />,
      link: "/categories/keyboards",
    },
    { name: "Mice", icon: <Mouse size={20} />, link: "/categories/mice" },
    {
      name: "Headphones",
      icon: <Headphones size={20} />,
      link: "/c/headphones",
    },
  ];
  return (
    <aside className="w-60 bg-gray-900 text-gray-300 p-4 flex-col hidden lg:flex sticky top-0 h-screen">
      <nav className="flex flex-col gap-1 text-sm">
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 font-semibold"
        >
          <Home size={20} /> Home
        </Link>
        <Link
          href="/categories"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 font-semibold"
        >
          <Compass size={20} /> Popular
        </Link>
      </nav>
      <div className="border-t border-gray-700 my-4"></div>
      <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
        Categories
      </h3>
      <nav className="flex flex-col gap-1 text-sm">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.link}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700"
          >
            {category.icon} {category.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Image
              src="/ad.jpg"
              alt="username"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold tex-tsm text-white truncate">
                username
              </p>
              <p className="text-xs text-gray-400 truncate">email</p>
            </div>
            <Button
              onClick={() => {}}
              className="p-2 text-gray-400 hover:bg-gray-700 rounded-md"
            >
              <LogOut size={20} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {}}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-full text-sm cursor-pointer"
          >
            Login
          </Button>
        )}
      </div>
    </aside>
  );
}
