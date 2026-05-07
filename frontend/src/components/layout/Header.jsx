import React from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, User, LogOut, BookOpen, Rocket } from "lucide-react";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/documents", icon: FileText, text: "Documents" },
        { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
        { to: "/profile", icon: User, text: "Profile" }
    ];

    return <header className="sticky top-0 z-40 w-full h-16 bg-[#f7f2e8] border-b-2 border-black">
        <div className="flex items-center justify-between h-full px-6 gap-6">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-black text-[#f6f3ea] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center">
                    <Rocket size={18} strokeWidth={2.5} />
                </div>
                <span className="text-sm md:text-base font-bold text-black tracking-tight">
                    StudySprint
                </span>
            </div>

            <nav className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `group inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-sm border-2 border-black transition-all duration-150 ${isActive
                                ? "bg-black text-[#f6f3ea] shadow-[3px_3px_0px_#000]"
                                : "bg-[#f7f2e8] text-black hover:bg-[#ffd400]"
                            }`
                        }
                    >
                        <link.icon size={16} strokeWidth={2.5} />
                        {link.text}
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 pl-3 border-l-2 border-black">
                    <div
                        className="flex items-center gap-3 px-3 py-1.5 rounded-sm hover:bg-[#ffd400] transition-colors duration-150 cursor-pointer group"
                        onClick={() => navigate("/profile")}
                    >
                        <div className="w-9 h-9 rounded-sm bg-black flex items-center justify-center text-[#f6f3ea] shadow-[3px_3px_0px_#000] transition-all duration-150">
                            <User size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-black">
                                {user?.username || "User"}
                            </p>
                            <p className="text-xs text-neutral-700">
                                {user?.email || "user@example.com"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-sm border-2 border-black bg-white text-black shadow-[3px_3px_0px_#000] transition-all duration-150 hover:bg-[#ff5c5c]"
                        aria-label="Logout"
                    >
                        <LogOut size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    </header>
}

export default Header