import React from "react";
import { Link, Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";

export default function PublicPageLayout() {
  return (
    <div className="min-h-screen bg-edu-bg font-sans text-edu-black flex flex-col transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-edu-bg/90 backdrop-blur-md border-b border-edu-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <GraduationCap className="text-edu-red" size={28} />
            <span className="font-serif text-2xl font-bold tracking-wide">EduPlan</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/dashboard"><Button variant="primary" className="text-sm px-6 py-2.5">Accéder à l'application</Button></Link>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}