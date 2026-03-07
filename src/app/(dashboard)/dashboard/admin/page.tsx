import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldCheck, UserCheck, FileText, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import AdminActionsClient from "./AdminActionsClient";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // Hardcode check: we assume the user role must be "admin" to view this.
    // If not, kick them out. Note: we might need to add an admin account manually.
    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const pendingDoctors = await prisma.doctor.findMany({
        where: { verificationStatus: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#e2efe2] pb-4">
                <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[#355f41]">Admin Verification Center</h1>
                    <p className="text-slate-500 text-sm">Review doctor applications and uploaded credentials securely.</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto pb-10">
                {pendingDoctors.length === 0 ? (
                    <div className="bg-white/60 rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-slate-500">
                        <UserCheck className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="font-semibold text-lg">No Pending Applications</p>
                        <p className="text-sm">All doctor applications have been processed.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {pendingDoctors.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-[20px] shadow-sm border border-[#e2efe2] overflow-hidden flex flex-col md:flex-row">
                                {/* Doctor Details */}
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#e2efe2] bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-[#2E7D32] mb-1">{doc.name}</h2>
                                    <p className="text-sm font-semibold text-[#598b61] mb-6">{doc.specialty}</p>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Clinic Information</p>
                                            <p className="text-sm text-slate-700 font-medium">{doc.clinicName || "N/A"}</p>
                                            <p className="text-xs text-slate-500">{doc.clinicAddress || doc.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Licensure</p>
                                            <p className="text-sm text-slate-700 font-medium flex justify-between">
                                                <span>License:</span> <span>{doc.licenseNumber || "N/A"}</span>
                                            </p>
                                            <p className="text-sm text-slate-700 font-medium flex justify-between">
                                                <span>Council Reg:</span> <span>{doc.registrationNumber || "N/A"}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                                            <p className="text-sm text-slate-700 font-medium">{doc.contactInfo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Documents */}
                                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Uploaded Documents
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                            {/* Document Links */}
                                            <a href={doc.degreeCertificate || "#"} target="_blank" rel="noreferrer" className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition group">
                                                <div className="h-20 w-full bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                    {doc.degreeCertificate ? <Image src={doc.degreeCertificate} alt="Degree" width={200} height={200} className="object-cover h-full w-full opacity-60 group-hover:opacity-100 transition" /> : <span className="text-xs text-slate-400">Missing</span>}
                                                </div>
                                                <span className="text-xs font-semibold text-center text-slate-600">Degree</span>
                                            </a>
                                            <a href={doc.governmentId || "#"} target="_blank" rel="noreferrer" className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition group">
                                                <div className="h-20 w-full bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                    {doc.governmentId ? <Image src={doc.governmentId} alt="Govt ID" width={200} height={200} className="object-cover h-full w-full opacity-60 group-hover:opacity-100 transition" /> : <span className="text-xs text-slate-400">Missing</span>}
                                                </div>
                                                <span className="text-xs font-semibold text-center text-slate-600">Government ID</span>
                                            </a>
                                            <a href={doc.licenseDocument || "#"} target="_blank" rel="noreferrer" className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition group">
                                                <div className="h-20 w-full bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                    {doc.licenseDocument ? <Image src={doc.licenseDocument} alt="License" width={200} height={200} className="object-cover h-full w-full opacity-60 group-hover:opacity-100 transition" /> : <span className="text-xs text-slate-400">Missing</span>}
                                                </div>
                                                <span className="text-xs font-semibold text-center text-slate-600">License Doc</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Client-side actions to Approve / Reject */}
                                    <AdminActionsClient doctorId={doc.id} userId={doc.userId || ""} doctorName={doc.name} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
