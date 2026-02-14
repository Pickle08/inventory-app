import { LayoutDashboard, Moon, Sun } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 py-4 mb-8 transition-colors duration-300 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-xl text-slate-900 dark:text-white">
                        Shopeers Dummy
                    </span>
                </div>
            </div>
        </nav>
    );
}
