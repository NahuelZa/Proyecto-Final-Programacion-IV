import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/layout/Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}