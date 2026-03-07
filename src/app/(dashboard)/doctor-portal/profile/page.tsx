"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Briefcase, GraduationCap, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        location: "",
        experience: "",
        bio: "",
        consultationFee: "",
        certifications: "",
        contactInfo: "",
        timeSlots: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/doctor/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data && Object.keys(data).length > 0) {
                        setFormData({
                            name: data.name || "",
                            specialty: data.specialty || "",
                            location: data.location || "",
                            experience: data.experience?.toString() || "",
                            bio: data.bio || "",
                            consultationFee: data.consultationFee?.toString() || "",
                            certifications: data.certifications || "",
                            contactInfo: data.contactInfo || "",
                            timeSlots: data.timeSlots || '["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]'
                        });
                    } else {
                        // set defaults if completely empty
                        setFormData(prev => ({
                            ...prev,
                            timeSlots: '["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]'
                        }))
                    }
                }
            } catch (error) {
                console.error("Failed to load doctor profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/doctor/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Professional Profile saved successfully!");
                router.push('/doctor-portal');
            } else {
                alert("Failed to save profile. Please try again.");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#598b61]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-6 mt-4 pb-12">
            <div className="flex flex-col">
                <h1 className="text-[28px] font-bold text-[#355f41]">Professional Profile</h1>
                <p className="text-[#598b61] text-sm mt-1">Manage your public marketplace listing.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md rounded-[20px] shadow-sm border border-[#e2efe2] p-8 mt-2 flex flex-col gap-8 flex-1 overflow-y-auto">
                {/* Basic Info */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <User className="w-5 h-5" /> Provider Identity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name (with Dr. prefix)</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. Dr. Vaidya Sharma" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Specialty</label>
                            <select required name="specialty" value={formData.specialty} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition">
                                <option value="">Select Specialty</option>
                                <option value="Ayurvedic General Medicine">Ayurvedic General Medicine</option>
                                <option value="Panchakarma Specialist">Panchakarma Specialist</option>
                                <option value="Nadi Pariksha Expert">Nadi Pariksha Expert</option>
                                <option value="Ayurvedic Diagnostics">Ayurvedic Diagnostics</option>
                                <option value="Herbalist">Herbalist</option>
                                <option value="Diet and Nutrition">Diet and Nutrition</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <MapPin className="w-5 h-5" /> Clinic & Contact
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">City & State</label>
                            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. Mumbai, India" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                            <input required type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="+91 9876543210" />
                        </div>
                    </div>
                </div>

                {/* Professional Qualifications */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-[#2E7D32] flex items-center gap-2 border-b border-[#e2efe2] pb-2">
                        <GraduationCap className="w-5 h-5" /> Qualifications
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Years of Experience</label>
                            <input required type="number" name="experience" value={formData.experience} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="e.g. 15" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Degrees / Certifications</label>
                            <input required type="text" name="certifications" value={formData.certifications} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition" placeholder="BAMS, MD (Ayurveda)" />
                        </div>
                    </div>
                </div>

                {/* Marketplace Listing details */}
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
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Available Time Slots (JSON)</label>
                            <input type="text" name="timeSlots" value={formData.timeSlots} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition text-xs font-mono" placeholder='["09:00", "10:00", "11:00"]' />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Professional Bio</label>
                        <textarea required name="bio" value={formData.bio} onChange={handleChange} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#598b61]/20 transition min-h-[120px] resize-y" placeholder="Summarize your approach to Ayurvedic healing..."></textarea>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSaving} className="bg-[#2E7D32] hover:bg-[#1b5e20] text-white px-8 py-3 rounded-xl font-medium shadow-md transition-all flex items-center gap-2 disabled:opacity-70">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        {isSaving ? "Saving Profile..." : "Publish Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
