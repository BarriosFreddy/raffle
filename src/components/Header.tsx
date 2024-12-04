import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, Lock, Plus, Search } from "lucide-react";
import { AdminLogin } from "./AdminLogin";
import Logo from "@/assets/images/logo_celumoviljp.webp";

export function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = (success: boolean) => {
    setIsAdmin(success);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <header
      className="shadow-sm sticky top-0 z-10"
      style={{
        backgroundColor: "#9f0000",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center">
            <img width={70} src={Logo} alt="Logo image" />
          </Link>
          <div className="flex gap-4">
            <Link
              to="/search"
              className="inline-flex items-center py-2 px-4 rounded-lg bg-white text-red-900 hover:bg-red-200 active:bg-red-300 transition-colors"
            >
              <Search className="h-5 w-5 mr-1" />
              Mis Compras
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/create"
                  className="inline-flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Create Raffle
                </Link>
                <Link
                  to="/dashboard"
                  className="py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 transition-colors"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <AdminLogin onLogin={handleAdminLogin} />
          </div>
        </div>
      )}
    </header>
  );
}
