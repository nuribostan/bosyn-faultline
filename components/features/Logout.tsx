"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex gap-4 items-center w-full px-2 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group "
    >
      <LogOut className="group-hover:-translate-x-1 transition-transform" size={20} />
      <span>Logout</span>
    </button>
  );
}