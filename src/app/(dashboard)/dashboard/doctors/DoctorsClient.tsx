"use client";
import { useState } from "react";
import { MapPin, Star, Calendar, Search, Filter } from "lucide-react";

export function DoctorsClient({ doctors }: { doctors: any[] }) {
    const [booking, setBooking] = useState<string | null>(null);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    // Filters
    const [specialtyFilter, setSpecialtyFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique specialties for the dropdown
    const specialties = Array.from(new Set(doctors.map(d => d.specialty).filter(Boolean)));

    // Filtered Doctors
    const filteredDoctors = doctors.filter(doc => {
        // ONLY SHOW APPROVED DOCTORS
        if (doc.verificationStatus !== "APPROVED") return false;

        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = specialtyFilter === "" || doc.specialty === specialtyFilter;
        return matchesSearch && matchesSpecialty;
    });

    const activeDoctor = doctors.find(d => d.id === booking);

    return (
        <div className="flex flex-col gap-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white/60 p-4 rounded-[16px] border border-[#e2efe2] shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition"
                    />
                </div>
                <div className="sm:w-64 relative flex items-center">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <select
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                        className="w-full pl-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition appearance-none"
                    >
                        <option value="">All Specialties</option>
                        {specialties.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredDoctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="font-medium text-slate-600">No doctors found matching filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDoctors.map(doc => (
                        <div key={doc.id} className="rounded-[16px] border border-[#e2efe2] bg-white text-slate-950 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all">
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div>
                                    <h3 className="font-bold text-[18px] text-[#355f41]">{doc.name}</h3>
                                    <p className="text-sm font-semibold text-[#598b61]">{doc.specialty}</p>
                                </div>
                                <div className="space-y-2.5 text-[13px] text-slate-600 font-medium">
                                    <div className="flex items-center gap-2"><BriefcaseIcon className="w-4 h-4 text-slate-400" /> {doc.experience} Years Experience</div>
                                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {doc.location}</div>
                                    <div className="flex items-center gap-2"><IndianRupeeIcon className="w-4 h-4 text-slate-400" /> ₹{doc.consultationFee || 500} Consultation Fee</div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 text-amber-600 font-bold"><Star className="fill-amber-500 w-4 h-4" /> {doc.rating}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <button
                                    onClick={() => setBooking(doc.id)}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-bold tracking-wide text-white hover:bg-[#1b5e20] transition-colors shadow-[0_2px_10px_rgba(46,125,50,0.2)]">
                                    Book Consultation
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {booking && activeDoctor && (
                <div className="fixed inset-0 bg-[#355f41]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 transform transition-all">
                        <div>
                            <h2 className="text-[22px] font-bold text-[#2E7D32]">Consultation Booking</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">You are requesting an appointment with <strong className="text-slate-700">{activeDoctor.name}</strong>.</p>
                        </div>

                        <div className="flex flex-col gap-4 bg-[#f8fafc] p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-500">Consultation Fee</span>
                                <span className="text-[#355f41] font-bold">₹{activeDoctor.consultationFee || 500}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-500">Duration</span>
                                <span className="text-[#355f41] font-bold">45 mins</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Preferred Date & Time</label>

                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={date.split('T')[0] || ''}
                                    onChange={(e) => {
                                        const newDate = e.target.value;
                                        if (newDate) {
                                            setDate(`${newDate}T${date.split('T')[1] || '09:00'}`);
                                        } else {
                                            setDate('');
                                        }
                                    }}
                                    className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#598b61]/30 transition"
                                />
                                <select
                                    value={date.split('T')[1] || ''}
                                    onChange={(e) => {
                                        const time = e.target.value;
                                        if (date.split('T')[0]) {
                                            setDate(`${date.split('T')[0]}T${time}`);
                                        }
                                    }}
                                    className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#598b61]/30 transition"
                                >
                                    <option value="">Select Time</option>
                                    {activeDoctor?.timeSlots ? (
                                        (() => {
                                            try {
                                                const slots = JSON.parse(activeDoctor.timeSlots);
                                                if (Array.isArray(slots)) {
                                                    return slots.map((time: string) => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ));
                                                }
                                                return null;
                                            } catch (e) {
                                                return <option value="09:00">09:00 AM</option>;
                                            }
                                        })()
                                    ) : (
                                        <>
                                            <option value="09:00">09:00 AM</option>
                                            <option value="10:00">10:00 AM</option>
                                            <option value="11:00">11:00 AM</option>
                                            <option value="14:00">02:00 PM</option>
                                            <option value="15:00">03:00 PM</option>
                                            <option value="16:00">04:00 PM</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setBooking(null)}
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading || !date}
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const res = await fetch("/api/appointments", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ doctorId: booking, date })
                                        });
                                        if (res.ok) {
                                            alert('Appointment Request Sent!');
                                            setBooking(null);
                                            setDate("");
                                        } else {
                                            alert('Failed to book appointment.');
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="flex-[2] rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1b5e20] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {loading ? "Booking..." : "Confirm Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BriefcaseIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
    )
}

function IndianRupeeIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12" />
            <path d="M6 8h12" />
            <path d="m6 13 8.5 8" />
            <path d="M6 13h3" />
            <path d="M9 13c6.667 0 6.667-10 0-10" />
        </svg>
    )
}
