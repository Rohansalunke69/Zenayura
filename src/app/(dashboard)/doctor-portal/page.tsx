import { prisma } from "@/lib/prisma";
import { Stethoscope, Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { AppointmentActions } from "./AppointmentActions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DoctorPortalDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "doctor") {
        redirect("/dashboard");
    }

    // Attempt to find the doctor profile linked to this user
    const doctor = await prisma.doctor.findUnique({
        where: { userId: session.user.id }
    });

    if (!doctor) {
        // Redirect to profile setup if no doctor profile exists
        redirect("/doctor-portal/profile");
    }

    // Fetch incoming appointments for this doctor
    const appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { user: { include: { healthProfile: true } } },
        orderBy: { date: 'asc' }
    });

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto gap-6 mt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[28px] font-bold text-[#355f41]">Welcome, Dr. {doctor.name}</h1>
                    <p className="text-[#598b61] text-sm mt-1">Manage your incoming patient consultations.</p>
                </div>
            </div>

            {/* Container */}
            <div className="flex-1 overflow-hidden relative rounded-[20px] bg-white/90 backdrop-blur-md border border-[#e2efe2] shadow-sm flex flex-col min-h-[500px]">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4">
                    {appointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <Calendar className="h-10 w-10 text-slate-300 mb-3" />
                            <p className="font-medium text-slate-600">No appointments scheduled yet.</p>
                        </div>
                    ) : appointments.map(apt => (
                        <div key={apt.id} className="flex flex-col md:flex-row gap-4 p-6 rounded-[16px] border border-[#e2efe2] bg-white/60 shadow-sm items-start hover:bg-white/80 transition-all">
                            {/* Icon */}
                            <div className="h-12 w-12 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-[#b91c1c]" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-[17px] text-[#355f41]">{apt.user?.name || "Anonymous Patient"}</h3>
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${apt.status === 'CONFIRMED' ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]' :
                                        apt.status === 'CANCELLED' ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]' :
                                            'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-500">{apt.user?.email || "No email provided"}</p>

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

                                {apt.notes && (
                                    <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <span className="font-semibold text-slate-500">Notes:</span> {apt.notes}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                                {apt.status === 'PENDING' && (
                                    <AppointmentActions appointmentId={apt.id} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
