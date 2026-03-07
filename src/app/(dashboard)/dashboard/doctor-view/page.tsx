import { prisma } from "@/lib/prisma";
import { Stethoscope, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { DoctorSelector } from "./DoctorSelector";

export default async function DoctorPortalPage({ searchParams }: { searchParams: { did?: string } }) {
    // 1. Fetch all doctors for the simulated login dropdown
    const doctors = await prisma.doctor.findMany();

    // 2. Select the currently "logged in" doctor OR default to the first one
    const selectedDoctorId = searchParams.did || doctors[0]?.id;

    // 3. Fetch their incoming appointments
    const appointments = await prisma.appointment.findMany({
        where: { doctorId: selectedDoctorId },
        include: { user: { include: { healthProfile: true } } },
        orderBy: { date: 'asc' }
    });

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4">
            {/* Header / Simulator Selector */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[28px] font-bold text-[#355f41]">Doctor Portal</h1>
                    <p className="text-[#598b61] text-sm mt-1">Manage incoming patient consultations.</p>
                </div>

                {/* Doctor Identity Simulator */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-500">Viewing as:</span>
                    <DoctorSelector doctors={doctors} selectedDoctorId={selectedDoctorId} />
                </div>
            </div>

            {/* Container */}
            <div className="flex-1 overflow-hidden relative rounded-[20px] bg-white/90 backdrop-blur-md border border-[#e2efe2] shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4">
                    {appointments.length === 0 ? (
                        <div className="flex items-center justify-center p-12 text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            No appointments scheduled yet.
                        </div>
                    ) : appointments.map(apt => (
                        <div key={apt.id} className="flex flex-col md:flex-row gap-4 p-6 rounded-[16px] border border-[#e2efe2] bg-white/60 shadow-sm items-start hover:bg-white/80 transition-all">
                            {/* Icon */}
                            <div className="h-12 w-12 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-[#b91c1c]" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-[17px] text-[#355f41]">{apt.user?.name || "Anonymous Patient"}</h3>
                                <p className="text-sm font-medium text-slate-500">{apt.user?.email}</p>

                                <div className="mt-3 p-3 rounded-xl bg-[#f8fafc] border border-slate-100 flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Health Profile Data</span>
                                    {apt.user?.healthProfile ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-slate-700">
                                            <div><span className="text-slate-400 font-normal">Lifestyle:</span> {apt.user.healthProfile.lifestyle || 'N/A'}</div>
                                            <div><span className="text-slate-400 font-normal">Age:</span> {apt.user.healthProfile.age || 'N/A'}</div>
                                            <div><span className="text-slate-400 font-normal">Weight:</span> {apt.user.healthProfile.weight || 'N/A'}kg</div>
                                            <div><span className="text-slate-400 font-normal">Diet:</span> {apt.user.healthProfile.dietType || 'N/A'}</div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">No health profile provided yet.</span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-4 text-[13px] text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#598b61]" /> {new Date(apt.date).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#598b61]" /> {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]`}>
                                    Status: {apt.status}
                                </span>

                                <div className="flex flex-col gap-2 w-full">
                                    <button className="text-sm font-medium bg-[#598b61] text-white px-4 py-2 rounded-lg hover:bg-[#4b7752] transition shadow-sm w-full">Prepare Prescription</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
