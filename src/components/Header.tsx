import { Link, useLocation } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  themeColor?: string;
}

export function Header({ themeColor = '#4f46e5' }: HeaderProps = {}) {
  const { logout, isAuthenticated } = useAuth()

  const location = useLocation()

  const isAdminPage = location?.pathname === "/admin"

  const handleLogout = async () => {
    await logout()
    window.location.href = "/admin"
  };

  return (
    <header
      className="shadow-sm sticky top-0 z-10"
      style={{ backgroundColor: themeColor }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center">
            {/* <img width={70} src={Logo} alt="Logo image" /> */}
            <span className="text-white text-2xl font-bold">Eventos Calidad</span>
          </Link>
          <div className="flex gap-4">
            <Link
              to="/search"
              className="inline-flex items-center py-2 px-4 rounded-lg bg-white text-black hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              <Search className="h-5 w-5 mr-1" />
              Mis Compras
            </Link>
            {isAuthenticated && isAdminPage && <button
              onClick={handleLogout}
              className="inline-flex items-center py-2 px-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-1" />
              CERRAR SESIÓN
            </button>}
          </div>
        </div>
      </div>
    </header>
  );
}
