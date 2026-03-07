"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AppointmentActions({ appointmentId }: { appointmentId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const updateStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, status }),
            });
            if (res.ok) {
                router.refresh(); // Refresh the server component to show new status
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2 w-full">
            <button
                onClick={() => updateStatus('CONFIRMED')}
                disabled={isLoading}
                className="flex items-center gap-1 text-sm font-medium bg-[#598b61] text-white px-3 py-2 rounded-lg hover:bg-[#4b7752] transition shadow-sm w-full justify-center disabled:opacity-50"
            >
                <CheckCircle className="w-4 h-4" /> Accept
            </button>
            <button
                onClick={() => updateStatus('CANCELLED')}
                disabled={isLoading}
                className="flex items-center gap-1 text-sm font-medium bg-white text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition shadow-sm w-full justify-center disabled:opacity-50"
            >
                <XCircle className="w-4 h-4" /> Reject
            </button>
        </div>
    );
}
