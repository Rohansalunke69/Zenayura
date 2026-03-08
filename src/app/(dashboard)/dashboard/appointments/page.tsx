"use client";
import { useState, useEffect } from "react";
import { Stethoscope, Calendar, Clock, MapPin, CheckCircle } from "lucide-react";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/appointments")
            .then(res => res.json())
            .then(data => {
                if (data.appointments) {
                    setAppointments(data.appointments);
                }
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[28px] font-bold text-[#355f41]">Your Appointments</h1>
                    <p className="text-[#598b61] text-sm mt-1">Manage your upcoming and past consultations.</p>
                </div>
            </div>

            {/* Container */}
            <div className="flex-1 overflow-hidden relative rounded-[20px] bg-white/90 backdrop-blur-md border border-[#e2efe2] shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4">
                    {loading ? (
                        <div className="text-slate-500">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-slate-500">You have no upcoming or past appointments.</div>
                    ) : appointments.map(apt => (
                        <div key={apt.id} className="flex flex-col md:flex-row gap-4 p-6 rounded-[16px] border border-[#e2efe2] bg-white/60 shadow-sm items-start md:items-center hover:bg-white/80 transition-all">
                            {/* Icon */}
                            <div className="h-12 w-12 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center shrink-0">
                                <Stethoscope className="h-5 w-5 text-[#598b61]" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-[17px] text-[#355f41]">{apt.doctor?.name || "Unknown Doctor"}</h3>
                                <p className="text-sm font-medium text-[#598b61]">{apt.doctor?.specialty || "Ayurvedic Expert"}</p>

                                <div className="flex flex-wrap items-center gap-4 mt-2 text-[13px] text-slate-500">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(apt.date).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {apt.doctor?.location || "Online"} (In-Clinic)</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${apt.status?.toUpperCase() !== 'COMPLETED' ? 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]' : 'bg-[#f0fdf4] text-[#15803d] border border-[#dcfce7]'}`}>
                                    {apt.status?.toUpperCase() === 'COMPLETED' && <CheckCircle className="h-3.5 w-3.5" />}
                                    {apt.status || "Pending"}
                                </span>

                                {apt.status?.toUpperCase() !== 'COMPLETED' && apt.status?.toUpperCase() !== 'CANCELLED' && (
                                    <div className="flex gap-2">
                                        <button className="text-sm border border-slate-200 text-slate-600 px-4 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition font-medium">Reschedule</button>
                                        <button className="text-sm font-medium bg-[#598b61] text-white px-4 py-1.5 rounded-lg hover:bg-[#4b7752] transition shadow-sm">Join Now</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
