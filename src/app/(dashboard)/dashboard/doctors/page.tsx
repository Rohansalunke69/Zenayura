import { prisma } from "@/lib/prisma";
import { DoctorsClient } from "./DoctorsClient";

export default async function DoctorsPage() {
    let doctors: any[] = [];
    let dbError = false;
    try {
        doctors = await prisma.doctor.findMany();
    } catch (error) {
        console.error("DoctorsPage DB Error:", error);
        dbError = true;
    }

    if (dbError) {
        return (
            <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4 items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin mb-6"></div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Connecting to Database...</h1>
                <p className="text-slate-500 max-w-sm text-center">
                    Our secure database is currently waking up or experiencing heavy load. Please refresh the page in a few moments.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[28px] font-bold text-[#355f41]">Find Ayurvedic Doctors</h1>
                    <p className="text-[#598b61] text-sm mt-1">Discover and book real Ayurvedic practitioners from the database.</p>
                </div>
                <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 font-semibold shadow-sm text-sm shrink-0">
                    ME
                </div>
            </div>

            {/* Container */}
            <div className="flex-1 overflow-hidden relative rounded-[20px] bg-white/90 backdrop-blur-md border border-[#e2efe2] shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                    <DoctorsClient doctors={doctors} />
                </div>
            </div>
        </div>
    );
}
