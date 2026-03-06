"use client";
import { useState } from "react";
import { MapPin, Star, Calendar } from "lucide-react";

export function DoctorsClient({ doctors }: { doctors: any[] }) {
    const [booking, setBooking] = useState<string | null>(null);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map(doc => (
                    <div key={doc.id} className="rounded-xl border bg-white text-slate-950 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="flex gap-4 items-center mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800">{doc.name}</h3>
                                    <p className="text-sm font-medium text-green-700">{doc.specialty}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2"><BriefcaseIcon className="w-4 h-4" /> {doc.experience} Years Experience</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {doc.location}</div>
                                <div className="flex items-center gap-2 text-amber-600 font-medium"><Star className="fill-amber-500 w-4 h-4" /> {doc.rating} Rating</div>
                            </div>
                        </div>
                        <div className="border-t p-4 flex gap-2 bg-slate-50">
                            <button
                                onClick={() => setBooking(doc.id)}
                                className="inline-flex flex-1 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition">
                                <Calendar className="mr-2 h-4 w-4" /> Book Consultation
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {booking && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-green-900">Confirm Booking</h2>
                        <p className="text-slate-600">You are requesting a consultation with {doctors.find(d => d.id === booking)?.name}.</p>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-sm font-medium text-slate-700">Preferred Date & Time</label>
                            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button onClick={() => setBooking(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
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
                                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                                {loading ? "Booking..." : "Confirm Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
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
