"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EditProfile() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [profile, setProfile] = useState<any>(null);

    // Fetch existing profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile");
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    if (data.profilePictureUrl) {
                        setImagePreview(data.profilePictureUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setIsFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation for size
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        // Validation for type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            setError("Only JPG, PNG and WEBP formats are allowed");
            return;
        }

        setError("");
        setSelectedFile(file);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget);
            let profilePictureUrl = profile?.profilePictureUrl || "";

            // 1. Upload the image if a new one was selected
            if (selectedFile) {
                const imageForm = new FormData();
                imageForm.append("file", selectedFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: imageForm,
                });

                if (!uploadRes.ok) {
                    throw new Error(await uploadRes.text() || "Failed to upload image.");
                }

                const uploadData = await uploadRes.json();
                profilePictureUrl = uploadData.url;
            }

            // 2. Submit the profile data
            const payload = {
                fullName: formData.get("fullName"),
                age: formData.get("age"),
                gender: formData.get("gender"),
                height: formData.get("height"),
                weight: formData.get("weight"),
                healthConcern: formData.get("healthConcern"),
                lifestyle: formData.get("lifestyle"),
                dietType: formData.get("dietType"),
                allergies: formData.get("allergies"),
                medicalConditions: formData.get("medicalConditions"),
                profilePictureUrl
            };

            const profileRes = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!profileRes.ok) {
                throw new Error(await profileRes.text() || "Failed to update profile.");
            }

            // Successfully updated. Redirect to the viewing portal
            router.push("/dashboard/profile");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex-1 w-full flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto pb-20 selection:bg-[#2E7D32] selection:text-white">

            <div className="mb-6 flex items-center gap-4">
                <Link href="/dashboard/profile" className="p-2 hover:bg-slate-200 rounded-full transition text-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Edit Health Profile</h1>
            </div>

            <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Picture Upload */}
                    <div className="flex flex-col items-start gap-4 pb-4 border-b border-slate-100">
                        <label className="block text-sm font-semibold text-slate-700">Profile Picture</label>
                        <div className="flex items-center gap-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center cursor-pointer group hover:border-[#2E7D32] transition overflow-hidden shadow-sm shrink-0"
                            >
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#2E7D32] transition" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-[#2E7D32] hover:text-[#1f5c22] transition bg-[#eaf4ea] px-4 py-2 rounded-lg">
                                    Change Photo
                                </button>
                                <p className="text-xs text-slate-500 mt-2">JPG, PNG, WEBP (Max 5MB)</p>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                            <input required type="text" id="fullName" name="fullName" defaultValue={profile?.fullName} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Age */}
                        <div>
                            <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1.5">Age <span className="text-red-500">*</span></label>
                            <input required type="number" id="age" name="age" min="1" max="120" defaultValue={profile?.age} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                            <select required id="gender" name="gender" defaultValue={profile?.gender} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition bg-white text-slate-700">
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>

                        {/* Height */}
                        <div>
                            <label htmlFor="height" className="block text-sm font-semibold text-slate-700 mb-1.5">Height (cm) <span className="text-red-500">*</span></label>
                            <input required type="number" id="height" name="height" step="0.1" defaultValue={profile?.height} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Weight */}
                        <div>
                            <label htmlFor="weight" className="block text-sm font-semibold text-slate-700 mb-1.5">Weight (kg) <span className="text-red-500">*</span></label>
                            <input required type="number" id="weight" name="weight" step="0.1" defaultValue={profile?.weight} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Health Concern */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="healthConcern" className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Health Concern <span className="text-red-500">*</span></label>
                            <input required type="text" id="healthConcern" name="healthConcern" defaultValue={profile?.healthConcern} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Lifestyle */}
                        <div>
                            <label htmlFor="lifestyle" className="block text-sm font-semibold text-slate-700 mb-1.5">Lifestyle Type <span className="text-red-500">*</span></label>
                            <select required id="lifestyle" name="lifestyle" defaultValue={profile?.lifestyle} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition bg-white text-slate-700">
                                <option value="">Select lifestyle</option>
                                <option value="Sedentary">Sedentary (Little to no exercise)</option>
                                <option value="Moderate">Moderate (Active 2-3 days/week)</option>
                                <option value="Active">Active (Active 4+ days/week)</option>
                                <option value="Athlete">Athlete / Very Active</option>
                            </select>
                        </div>

                        {/* Diet Type */}
                        <div>
                            <label htmlFor="dietType" className="block text-sm font-semibold text-slate-700 mb-1.5">Dietary Preference <span className="text-red-500">*</span></label>
                            <select required id="dietType" name="dietType" defaultValue={profile?.dietType} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition bg-white text-slate-700">
                                <option value="">Select diet</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Pescatarian">Pescatarian</option>
                                <option value="Omnivore">Omnivore (Mixed)</option>
                                <option value="Ayurvedic">Ayurvedic Specific</option>
                            </select>
                        </div>

                        {/* Allergies */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="allergies" className="block text-sm font-semibold text-slate-700 mb-1.5">Allergies (Optional)</label>
                            <input type="text" id="allergies" name="allergies" defaultValue={profile?.allergies || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Medical Conditions */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="medicalConditions" className="block text-sm font-semibold text-slate-700 mb-1.5">Existing Medical Conditions (Optional)</label>
                            <textarea id="medicalConditions" name="medicalConditions" defaultValue={profile?.medicalConditions || ""} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400 resize-none"></textarea>
                        </div>

                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/profile")}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 max-w-xs bg-[#2E7D32] hover:bg-[#1f5c22] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ml-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
