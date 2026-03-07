"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminActionsClient({ doctorId, userId, doctorName }: { doctorId: string, userId: string, doctorName: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (actionType: "APPROVED" | "REJECTED") => {
        if (!confirm(`Are you sure you want to ${actionType} the application for ${doctorName}?`)) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/verify-doctor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctorId, userId, action: actionType })
            });

            if (res.ok) {
                alert(`Doctor application ${actionType} successfully!`);
                router.refresh(); // Refresh the Server Component to hide the approved doctor
            } else {
                const data = await res.json();
                alert(data.error || "Failed to process application.");
            }
        } catch (error) {
            console.error("Verification error:", error);
            alert("An error occurred during verification.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
                onClick={() => handleAction("REJECTED")}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reject
            </button>
            <button
                onClick={() => handleAction("APPROVED")}
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2E7D32] hover:bg-[#1b5e20] text-white rounded-xl font-bold transition shadow-sm disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve & Activate
            </button>
        </div>
    );
}
