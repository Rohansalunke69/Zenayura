"use client";

import { useState } from "react";
import { User, MapPin, Briefcase, GraduationCap, CheckCircle, Loader2, UploadCloud, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BecomeDoctorPage() {
    const router = useRouter();
    const { update } = useSession();
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        experience: "",
        bio: "",
        consultationFee: "",
        contactInfo: "",
        timeSlots: '["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]',

        // Verification Fields
        licenseNumber: "",
        registrationNumber: "",
        clinicName: "",
        clinicAddress: "",

        // Document URLs
        degreeCertificate: "",
        governmentId: "",
        licenseDocument: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingField(fieldName);

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            if (res.ok) {
                const json = await res.json();
                setFormData(prev => ({ ...prev, [fieldName]: json.url }));
            } else {
                alert("File upload failed. Max size is 5MB. Must be Image or Webp.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setUploadingField(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation for documents
        if (!formData.degreeCertificate || !formData.governmentId || !formData.licenseDocument) {
            alert("Please upload all mandatory documents to proceed.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/doctor/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Send to API
                    name: formData.name,
                    specialty: formData.specialty,
                    location: formData.clinicAddress, // Map address to old location field, plus new clinicAddress field
                    experience: Number(formData.experience),
                    bio: formData.bio,
                    consultationFee: Number(formData.consultationFee),
                    contactInfo: formData.contactInfo,
                    timeSlots: formData.timeSlots,

                    licenseNumber: formData.licenseNumber,
                    registrationNumber: formData.registrationNumber,
                    clinicName: formData.clinicName,
                    clinicAddress: formData.clinicAddress,

                    degreeCertificate: formData.degreeCertificate,
                    governmentId: formData.governmentId,
                    licenseDocument: formData.licenseDocument
                }),
            });

            if (res.ok) {
                // The new API behavior will put the user in PENDING state and keep role as "user".
                // They will NOT see the doctor portal yet.
                await update();
                router.push('/dashboard/profile?verification=pending');
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit application. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting onboarding:", error);
            alert("An error occurred while submitting your application.");
        } finally {
            setIsSaving(false);
        }
    };

    const FileUploadRenderer = ({ label, fieldName }: { label: string, fieldName: keyof typeof formData }) => {
        const isUploaded = !!formData[fieldName];
        const isUploading = uploadingField === fieldName;

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">{label} <span className="text-red-500">*</span></label>
                <div className={`relative flex items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all ${isUploaded ? "border-[#598b61] bg-[#eaf4ea]/40" : "border-slate-300 hover:border-[#598b61]/50 bg-slate-50"}`}>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={(e) => handleFileUpload(e, fieldName)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={isUploading}
                    />
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {isUploading ? (
                            <><Loader2 className="w-5 h-5 text-[#598b61] animate-spin" /> Uploading...</>
                        ) : isUploaded ? (
                            <><CheckCircle className="w-5 h-5 text-[#2E7D32]" /> <span className="text-[#2E7D32]">File Uploaded</span></>
                        ) : (
                            <><UploadCloud className="w-5 h-5 text-slate-500" /> <span className="text-slate-500">Click to Upload JPG/PNG</span></>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-6 mt-4 pb-12">
            <div className="flex flex-col">
                <h1 className="text-[28px] font-bold text-[#355f41]">Join Zenayura Network</h1>
                <p className="text-[#598b61] text-sm mt-1">Submit your application to become a verified Ayurvedic practitioner.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md rounded-[20px] shadow-sm border border-[#e2efe2] p-8 mt-2 flex flex-col gap-8 flex-1 overflow-y-auto">
                {/* Basic Info */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <User className="w-5 h-5" /> Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name (with Dr. prefix)</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. Dr. Vaidya Sharma" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                            <input required type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="+91 9876543210" />
                        </div>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <GraduationCap className="w-5 h-5" /> Professional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Specialty</label>
                            <select required name="specialty" value={formData.specialty} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition">
                                <option value="">Select Specialty</option>
                                <option value="Ayurvedic General Medicine">Ayurvedic General Medicine</option>
                                <option value="Panchakarma Specialist">Panchakarma Specialist</option>
                                <option value="Nadi Pariksha Expert">Nadi Pariksha Expert</option>
                                <option value="Diet and Nutrition">Diet and Nutrition</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Years of Experience</label>
                            <input required type="number" name="experience" value={formData.experience} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. 15" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Medical License Number</label>
                            <input required type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. MCI-12345" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Council Registration Number</label>
                            <input required type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. CCIM-9876" />
                        </div>
                    </div>
                </div>

                {/* Mandatory Documents */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <FileText className="w-5 h-5" /> Mandatory Documents
                    </h2>
                    <p className="text-sm text-slate-500 mb-2">Please upload clear, legible images (JPG/PNG/WEBP). Max 5MB per file.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FileUploadRenderer label="Degree Certificate" fieldName="degreeCertificate" />
                        <FileUploadRenderer label="Government ID" fieldName="governmentId" />
                        <FileUploadRenderer label="Medical License" fieldName="licenseDocument" />
                    </div>
                </div>

                {/* Clinic Details */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <MapPin className="w-5 h-5" /> Clinic Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Clinic / Hospital Name</label>
                            <input required type="text" name="clinicName" value={formData.clinicName} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. Ayurveda Care Clinic" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Clinic Address</label>
                            <input required type="text" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. 123 Main St, Mumbai, India" />
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <Briefcase className="w-5 h-5" /> Services & Pricing
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-slate-700">Consultation Fee (₹)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                <input required type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="p-3 pl-8 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition w-full" placeholder="500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSaving} className="bg-[#2E7D32] hover:bg-[#1b5e20] text-white px-8 py-3 rounded-xl font-medium shadow-md transition-all flex items-center gap-2 disabled:opacity-70">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        {isSaving ? "Submitting Application..." : "Submit for Verification"}
                    </button>
                </div>
            </form>
        </div>
    );
}
