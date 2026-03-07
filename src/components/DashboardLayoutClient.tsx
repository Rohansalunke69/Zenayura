"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Search, Calendar, UserCircle, Briefcase, LogOut } from "lucide-react";

import { useSession, signOut } from "next-auth/react";

export function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const links = [
        { href: "/dashboard/ai-assistant", label: "Ayurvedic AI", icon: Leaf },
        { href: "/dashboard/doctors", label: "Find Doctors", icon: Search },
        { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
        { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
    ];

    // Conditionally add Doctor Portal if the user has the doctor role
    if (session?.user?.role === "doctor") {
        links.splice(3, 0, { href: "/doctor-portal", label: "Doctor Portal", icon: Briefcase });
    }

    return (
        <div className="relative flex min-h-screen w-full bg-[#f4f9f4] overflow-hidden font-sans">
            {/* Decorative Background Glows */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[600px] bg-green-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-green-300/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Sidebar Navigation */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#e2efe2]/50 bg-white/40 backdrop-blur-xl sm:flex">
                <div className="flex pt-8 pb-8 px-8">
                    <Link href="/dashboard/ai-assistant" className="flex items-center gap-2 font-semibold text-2xl tracking-tight text-[#2E7D32]">
                        <Leaf className="h-7 w-7" />
                        <span>Zenayura</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2 flex flex-col px-4 relative z-10">
                    <nav className="grid items-start text-[15px] font-medium gap-1.5">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${isActive
                                        ? "bg-[#598b61] backdrop-blur-md shadow-sm text-white hover:bg-[#4b7752]"
                                        : "text-slate-500 hover:text-[#2E7D32] hover:bg-[#eaf4ea]/60"
                                        }`}
                                >
                                    <Icon className="h-[18px] w-[18px]" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                {/* Bottom Profile & Logout */}
                <div className="p-6 mt-auto flex flex-col gap-3 border-t border-[#e2efe2]/50">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a4f41] text-white font-medium shadow-md text-[15px]">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-700 truncate">{session?.user?.name || "User"}</span>
                            <span className="text-[11px] text-slate-500 truncate">{session?.user?.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/sign-in" })}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="relative flex flex-col sm:pl-64 w-full z-10">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#e2efe2] bg-white/80 backdrop-blur-md px-4 sm:hidden justify-between">
                    <div className="font-semibold text-lg flex items-center gap-2 text-[#2E7D32]">
                        <Leaf className="w-5 h-5" /> Zenayura
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/sign-in" })}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3a4f41] text-white font-medium text-sm hover:bg-red-600 transition-colors"
                        title="Log Out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </header>

                <main className="flex-1 p-4 sm:p-8 md:p-10 h-screen overflow-hidden flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
}
