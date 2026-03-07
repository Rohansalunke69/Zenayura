import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Activity, Apple, Scale, Calendar, Flame, AlertCircle, TestTube, ArrowUpRight, Edit3 } from "lucide-react";

export default async function ProfileView() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const profile = await prisma.healthProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) {
        redirect("/profile-setup");
    }

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto pb-20">
            {/* Header / Hero */}
            <div className="relative rounded-3xl overflow-hidden bg-[#2E7D32] text-white shadow-lg mb-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                        {profile.profilePictureUrl ? (
                            <Image
                                src={profile.profilePictureUrl}
                                alt={profile.fullName}
                                fill
                                className="object-cover rounded-full border-4 border-white/20 shadow-xl"
                            />
                        ) : (
                            <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center border-4 border-white/40 shadow-xl backdrop-blur-sm tracking-tight text-4xl font-bold">
                                {profile.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.fullName}</h1>
                                <p className="text-white/80 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                                    {profile.age} years old • {profile.gender}
                                </p>
                            </div>
                            <Link
                                href="/dashboard/profile/edit"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 transition backdrop-blur-md px-6 py-2.5 rounded-xl font-medium"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Physical Vitals */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#2E7D32]" />
                        Physical Vitals
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                            <p className="text-sm text-slate-500 font-medium mb-1">Height</p>
                            <p className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">
                                {profile.height} <span className="text-sm font-medium text-slate-400">cm</span>
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                            <p className="text-sm text-slate-500 font-medium mb-1">Weight</p>
                            <p className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">
                                {profile.weight} <span className="text-sm font-medium text-slate-400">kg</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lifestyle & Diet */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-2">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-[#2E7D32]" />
                        Lifestyle & Diet
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Activity Level</p>
                                <p className="text-lg font-semibold text-slate-800 mt-0.5">{profile.lifestyle}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 text-[#2E7D32] flex items-center justify-center shrink-0">
                                <Apple className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Dietary Preference</p>
                                <p className="text-lg font-semibold text-slate-800 mt-0.5">{profile.dietType}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Priorities */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-3">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TestTube className="w-5 h-5 text-[#2E7D32]" />
                        Health Overview
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-[#f4f9f4]/50 rounded-xl p-5 border border-[#eaf4ea]">
                            <h3 className="text-sm font-semibold text-[#2E7D32] mb-2 uppercase tracking-wide">Primary Health Concern</h3>
                            <p className="text-slate-700 text-lg">{profile.healthConcern}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-500" /> Allergies
                                </h3>
                                {profile.allergies ? (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-700">
                                        {profile.allergies}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 border-dashed text-slate-400 italic">
                                        None reported
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" /> Medical Conditions
                                </h3>
                                {profile.medicalConditions ? (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-700">
                                        {profile.medicalConditions}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 border-dashed text-slate-400 italic">
                                        None reported
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
