"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Giriş hatası:", err.message);
      setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-1/2 flex items-center justify-start px-42 bg-white max-lg:px-0 max-lg:justify-center max-xl:px-20">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-left-8 duration-700 flex flex-col justify-center h-full">
          <div className="text-left absolute top-10 max-lg:left-20">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Faultline
            </h1>
            <p className="text-slate-500 font-medium text-lg">BOSYN</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="mt-20 mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
              <p className="text-slate-400 mt-2">
                Welcome back! Please enter your details.
              </p>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    placeholder="admin@bosyn.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-400">
                Dont have an account?{" "}
                <span className="text-slate-900 font-semibold">
                  Contact Admin
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-slate-900 relative overflow-hidden">
        <Image
          src="/images/sign-in-bg.jpg"
          alt="Login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
