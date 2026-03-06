import { prisma } from "@/lib/prisma";
import { DoctorsClient } from "./DoctorsClient";

export default async function DoctorsPage() {
    const doctors = await prisma.doctor.findMany();

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
