"use client";

import { useRouter } from "next/navigation";

export function DoctorSelector({
    doctors,
    selectedDoctorId
}: {
    doctors: { id: string, name: string }[],
    selectedDoctorId: string
}) {
    const router = useRouter();

    return (
        <select
            name="did"
            defaultValue={selectedDoctorId}
            onChange={(e) => {
                router.push(`?did=${e.target.value}`);
            }}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:outline-none"
        >
            {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
        </select>
    );
}
