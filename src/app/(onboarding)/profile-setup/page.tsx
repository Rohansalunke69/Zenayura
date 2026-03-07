"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfileSetup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            let profilePictureUrl = "";

            // 1. Upload the image if one was selected
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
                throw new Error(await profileRes.text() || "Failed to save profile.");
            }

            // Successfully created. Redirect to the viewing portal
            router.push("/dashboard/profile");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-[#2E7D32] selection:text-white">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                {/* Header */}
                <div className="bg-[#2E7D32] p-8 text-white relative">
                    <h1 className="text-3xl font-bold mb-2">Create Health Profile</h1>
                    <p className="text-white/80">Help us personalize your Ayurvedic journey</p>
                    {/* Decorative pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Picture Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-32 h-32 rounded-full border-4 border-slate-50 bg-slate-100 flex items-center justify-center cursor-pointer group hover:bg-slate-200 transition overflow-hidden shadow-sm"
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <Camera className="w-10 h-10 text-slate-400 group-hover:text-[#2E7D32] transition" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">Upload Photo</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3 text-center">JPG, PNG, WEBP (Max 5MB)</p>
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
                            <input required type="text" id="fullName" name="fullName" placeholder="Rahul Sharma" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Age */}
                        <div>
                            <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1.5">Age <span className="text-red-500">*</span></label>
                            <input required type="number" id="age" name="age" min="1" max="120" placeholder="32" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                            <select required id="gender" name="gender" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition bg-white text-slate-700">
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
                            <input required type="number" id="height" name="height" step="0.1" placeholder="175" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Weight */}
                        <div>
                            <label htmlFor="weight" className="block text-sm font-semibold text-slate-700 mb-1.5">Weight (kg) <span className="text-red-500">*</span></label>
                            <input required type="number" id="weight" name="weight" step="0.1" placeholder="70.5" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Health Concern */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="healthConcern" className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Health Concern <span className="text-red-500">*</span></label>
                            <input required type="text" id="healthConcern" name="healthConcern" placeholder="e.g. Digestive issues, Stress, Joint pain" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Lifestyle */}
                        <div>
                            <label htmlFor="lifestyle" className="block text-sm font-semibold text-slate-700 mb-1.5">Lifestyle Type <span className="text-red-500">*</span></label>
                            <select required id="lifestyle" name="lifestyle" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition bg-white text-slate-700">
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
                            <select required id="dietType" name="dietType" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition bg-white text-slate-700">
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
                            <input type="text" id="allergies" name="allergies" placeholder="Peanuts, Dairy, Dust..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400" />
                        </div>

                        {/* Medical Conditions */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="medicalConditions" className="block text-sm font-semibold text-slate-700 mb-1.5">Existing Medical Conditions (Optional)</label>
                            <textarea id="medicalConditions" name="medicalConditions" rows={3} placeholder="Provide any relevant medical history..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition placeholder-slate-400 resize-none"></textarea>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#2E7D32] hover:bg-[#1f5c22] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Profile...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Complete Profile
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-400">By completing this profile, you agree to our privacy terms covering health data safely.</p>
                </form>
            </div>
        </div>
    );
}
