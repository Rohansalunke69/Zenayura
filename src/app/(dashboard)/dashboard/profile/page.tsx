"use client";
import { useState, useEffect } from "react";
import { Save, User, Activity } from "lucide-react";

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        doshaType: "",
        age: "",
        weight: "",
        height: "",
        lifestyle: "",
        diet: "",
        chronicIssues: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/profile")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setProfile({
                        doshaType: data.doshaType || "",
                        age: data.age?.toString() || "",
                        weight: data.weight?.toString() || "",
                        height: data.height?.toString() || "",
                        lifestyle: data.lifestyle || "",
                        diet: data.diet || "",
                        chronicIssues: data.chronicIssues || ""
                    });
                }
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Profile saved successfully! Your AI Assistant is now better calibrated.");
            } else {
                setMessage("Failed to save profile: " + data.error);
            }
        } catch (err) {
            setMessage("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[28px] font-bold text-[#355f41]">Health Profile</h1>
                    <p className="text-[#598b61] text-sm mt-1">Manage your Ayurvedic details to get personalized remedies.</p>
                </div>
                <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 font-semibold shadow-sm text-sm shrink-0">
                    <User className="w-5 h-5 text-[#598b61]" />
                </div>
            </div>

            {/* Container */}
            <div className="flex-1 overflow-y-auto relative rounded-[20px] bg-white/90 backdrop-blur-md border border-[#e2efe2] shadow-sm flex flex-col p-6 md:p-8">
                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-[#dcfce7] text-sm font-medium">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-2xl">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Primary Dosha</label>
                            <select name="doshaType" value={profile.doshaType} onChange={handleChange} className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition">
                                <option value="">Unknown / I don't know</option>
                                <option value="Vata">Vata (Air & Space)</option>
                                <option value="Pitta">Pitta (Fire & Water)</option>
                                <option value="Kapha">Kapha (Earth & Water)</option>
                                <option value="Vata-Pitta">Vata-Pitta</option>
                                <option value="Pitta-Kapha">Pitta-Kapha</option>
                                <option value="Vata-Kapha">Vata-Kapha</option>
                                <option value="Tridoshic">Tridoshic (All Three)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Age</label>
                            <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="e.g. 28" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Weight (kg)</label>
                            <input type="number" step="0.1" name="weight" value={profile.weight} onChange={handleChange} placeholder="e.g. 70" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Height (cm)</label>
                            <input type="number" step="0.1" name="height" value={profile.height} onChange={handleChange} placeholder="e.g. 175" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Lifestyle Routine</label>
                            <select name="lifestyle" value={profile.lifestyle} onChange={handleChange} className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition">
                                <option value="">Select Routine</option>
                                <option value="Sedentary">Sedentary (Desk Job, little exercise)</option>
                                <option value="Moderate">Moderate (Active 2-3 days a week)</option>
                                <option value="Active">Highly Active (Daily workout/sports)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Dietary Preferences</label>
                            <select name="diet" value={profile.diet} onChange={handleChange} className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition">
                                <option value="">Select Diet</option>
                                <option value="Vegan">Vegan (Plant-based)</option>
                                <option value="Vegetarian">Vegetarian (Includes Dairy)</option>
                                <option value="Omnivore">Omnivore (Meat & Plants)</option>
                                <option value="Pescatarian">Pescatarian (Fish & Plants)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 sm:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Chronic Issues / Ongoing Symptoms</label>
                            <textarea name="chronicIssues" value={profile.chronicIssues} onChange={handleChange} rows={3} placeholder="e.g. Frequent acidity, asthma, lower back pain..." className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition resize-none" />
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="self-end inline-flex items-center gap-2 bg-[#2E7D32] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1f5c22] transition shadow-md disabled:opacity-50 mt-4">
                        <Save className="w-4 h-4" />
                        {saving ? "Saving Profile..." : "Save Health Profile"}
                    </button>

                </form>
            </div>
        </div>
    );
}
