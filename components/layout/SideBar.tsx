"use client";

import { ComponentType, useState } from "react";
import { Bell } from "lucide-react";
import Logo from "../ui/logo";
import data from "@/db/menu.json";
import Dashboard from "@/public/iconsContainer/Dashboard";
import Projects from "@/public/iconsContainer/Projects";
import Logs from "@/public/iconsContainer/Logs";
import Settings from "@/public/iconsContainer/Settings";
import Logout from "../features/Logout";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, ComponentType> = {
  Dashboard,
  Projects,
  Logs,
  Settings,
  Bell,
};

const SideBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-md text-slate-700 hover:bg-slate-50 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        id="sideBar"
        className={`
          fixed top-0 left-0 h-svh w-72 bg-side-bar-background text-side-bar-foreground p-10 flex flex-col z-50
          transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:w-full lg:max-w-72
        `}
      >
        <div className="flex justify-between items-center">
          <Logo />
        </div>

        <span className="w-full h-px bg-secondary-background mt-4"></span>

        <ul
          id="sideBar-menu"
          className="w-full h-full flex flex-col justify-between items-start my-16 overflow-y-auto no-scrollbar"
        >
          <div className="sideBar-top h-full w-full flex flex-col items-start gap-6">
            {data.top.map((item, index) => {
              const Icon = iconMap[item.icon] as ComponentType;
              return (
                <li
                  key={index}
                  className={`w-full ${
                    pathname === item.href
                      ? "bg-side-bar-secondary-background py-2 rounded-lg"
                      : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex gap-4 items-center ${
                      pathname === item.href ? "pl-2" : ""
                    }`}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </div>
          <div className="sideBar-bottom h-full flex flex-col w-full justify-end gap-6">
            {data.bottom.map((item, index) => {
              const Icon = iconMap[item.icon] as ComponentType;
              return (
                <li
                  key={index}
                  className={`w-full ${
                    pathname === item.href
                      ? "bg-side-bar-secondary-background py-2 rounded-lg"
                      : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex gap-4 items-center ${
                      pathname === item.href ? "pl-2" : ""
                    }`}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}

            <Logout />
          </div>
        </ul>
      </div>
    </>
  );
};

export default SideBar;
