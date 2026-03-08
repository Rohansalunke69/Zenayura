import Link from "next/link";
import { ChevronDown, Phone, Leaf } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PublicLanding() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FFF8] font-sans selection:bg-[#2E7D32] selection:text-white">
      {/* 
        HERO SECTION + HEADER 
        Dark green background with rounded bottom corners.
      */}
      <div id="home" className="relative bg-[#2E7D32] rounded-b-[3rem] md:rounded-b-[6rem] pb-32 md:pb-64 pt-6 px-6 md:px-12 flex flex-col items-center overflow-hidden">
        {/* Header / Nav */}
        <header className="w-full max-w-7xl flex items-center justify-between z-20">
          <div className="text-white text-2xl font-bold tracking-tight">
            Zenayura.
          </div>
          <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm">
            <Link href="#home" className="hover:text-white transition">Home</Link>
            <Link href="#about" className="hover:text-white transition">About us</Link>
            <a href="mailto:Zenayuva@gmail.com" className="hover:text-white transition">Contact us</a>
            <Link href="#services" className="hover:text-white transition">Services</Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link href="/dashboard/ai-assistant" className="bg-white text-[#2E7D32] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-50 transition shadow-sm">
                Open AI Health Assistant
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-white hover:text-white/80 font-semibold text-sm transition">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-white text-[#2E7D32] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-50 transition shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Hero Content */}
        <div className="w-full max-w-3xl text-center mt-20 z-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold leading-tight tracking-tight mb-6">
            A Great Place care for<br />yourself
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-lg mb-8">
            Ayurvedic recovery is most focused in helping you discover your natural balance and most beautiful smile.
          </p>
          {session ? (
            <Link href="/dashboard/ai-assistant" className="bg-[#1f5c22] text-white px-8 py-3 rounded-full font-medium shadow-md hover:bg-[#1a4f1d] transition">
              Open AI Health Assistant
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/auth/signup" className="bg-white text-[#2E7D32] px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                Get Started
              </Link>
              <Link href="/auth/login" className="bg-[#1f5c22] text-white px-8 py-3 rounded-full font-medium shadow-md hover:bg-[#1a4f1d] hover:scale-105 active:scale-95 transition-all">
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Hero Doctors Image Composition (Absolute positioned below text) */}
        <div className="absolute -bottom-12 md:-bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl z-10 flex justify-center px-4">
          {/* Fallback composition if images aren't perfect transparent PNGs */}
          <div className="flex items-end justify-center w-full max-w-3xl mx-auto drop-shadow-2xl">
            <div className="h-48 md:h-80 w-32 md:w-56 bg-slate-200 rounded-t-full border border-white/40 -mr-6 md:-mr-12 z-0 overflow-hidden relative shadow-lg">
              <img src="/assets/indian_doc_2.png" alt="Ayurvedic Doctor" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="h-64 md:h-96 w-40 md:w-64 bg-slate-100 rounded-t-full border px-2 border-white/60 z-10 overflow-hidden relative shadow-2xl flex items-end justify-center">
              <img src="/assets/indian_doc_1.png" alt="Chief Ayurvedic Doctor" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
            <div className="h-48 md:h-80 w-32 md:w-56 bg-slate-200 rounded-t-full border border-white/40 -ml-6 md:-ml-12 z-0 overflow-hidden relative shadow-lg">
              <img src="/assets/indian_doc_3.png" alt="Ayurvedic Doctor" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>



      {/* 
        FLOATING NAGPUR TOP DOCTORS TEXT
        Subtle glassmorphism badge overlapping the hero section
      */}
      <div id="about" className="w-full max-w-4xl mx-auto px-4 relative z-30 -mt-12 md:-mt-20 mb-20 flex justify-center">
        <Link href={session ? "/dashboard/doctors" : "/auth/login"} className="group relative">
          {/* Animated glow effect behind the text */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-[#2E7D32] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

          <div className="relative bg-white/95 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-8 md:px-12 py-5 md:py-6 flex items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight text-center">
                Nagpur's Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]">Doctors</span>
              </h2>
              {/* Animated underline */}
              <div className="h-1 w-12 bg-green-200 rounded-full mt-2 group-hover:w-full group-hover:bg-[#2E7D32] transition-all duration-500 ease-out opacity-70"></div>
            </div>

            {/* Arrow icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors duration-300 ml-2 hidden sm:flex shrink-0 shadow-sm">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </Link>
      </div>

      {/* 
        SERVICES SECTION 
        Dark Green solid background block
      */}
      <div id="services" className="w-full bg-[#2E7D32] mt-32 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Side: Headline & Text */}
          <div className="text-white pe-0 md:pe-12">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              See what we provide to<br />keep you healthy
            </h2>
            <p className="text-white/80 leading-relaxed max-w-md">
              With world-class Preventive, Prescriptive & Curative Medical Practices, Zenayura has been at the helm of Nurturing Healthy Living Since the Turn of the New Century.
            </p>
            {/* Scroll Indicator Icon (Mouse) */}
            <div className="mt-12 w-6 h-10 border-2 border-white/30 rounded-full flex justify-center py-2">
              <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Right Side: Services Vertical List with indicator line */}
          <div className="relative pl-6 md:pl-12">
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/20"></div>
            {/* Active Indicator Pin */}
            <div className="absolute left-[-2px] top-12 w-[5px] h-12 bg-white rounded-full transition-all"></div>

            <div className="flex flex-col gap-6 text-white/70 text-lg md:text-xl font-medium cursor-pointer">
              <div className="hover:text-white transition group flex items-center gap-4">Panchakarma</div>
              <div className="text-white font-bold flex items-center gap-4">Nadi Pariksha</div>
              <div className="hover:text-white transition group flex items-center gap-4">Bariatric Ayurveda</div>
              <div className="hover:text-white transition group flex items-center gap-4">Herbal Therapy</div>
              <div className="hover:text-white transition group flex items-center gap-4">Diet Counseling</div>
              <div className="hover:text-white transition group flex items-center gap-4">Endocrinology & Yoga</div>
              <div className="hover:text-white transition group flex items-center gap-4">Medical Detoxification</div>
            </div>
          </div>

        </div>
      </div>

      {/* DELETED STATISTICS SECTION */}

      {/* 
        DOCTORS / EXPERTS CLOSING SECTION
        Bottom image showcase overlay.
      */}
      <div id="contact" className="w-full relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Using gradient and backdrop blur placeholder to represent the doctor photo showcase with 'Check out for more' text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E7D32]/90 to-[#A5D6A7]/40 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 z-0 flex items-end justify-center blur-[2px]">
          {/* Decorative Doctors Placeholder Forms (as full bleed image replacement) */}
          <div className="w-[80%] md:w-full h-full max-w-5xl flex justify-between items-end px-12 pb-0">
            <img src="/assets/indian_doc_2.png" alt="Team Doctor" className="w-1/4 h-[70%] object-cover rounded-t-full shadow-2xl brightness-90 grayscale-[20%]" />
            <img src="/assets/indian_doc_1.png" alt="Team Lead" className="w-1/3 h-[90%] object-cover rounded-t-full shadow-2xl z-10 brightness-110" />
            <img src="/assets/indian_doc_3.png" alt="Team Doctor" className="w-1/4 h-[80%] object-cover rounded-t-full shadow-2xl brightness-90 grayscale-[20%]" />
          </div>
        </div>
        <div className="relative z-20 flex flex-col items-center text-center pb-12">
          <h2 className="text-6xl md:text-9xl font-black text-white/50 tracking-tighter mix-blend-overlay">Zenayura.</h2>
          <Link href="/dashboard/doctors" className="mt-4 text-white font-medium hover:underline decoration-white/50 underline-offset-4 tracking-wide">
            Check out for more
          </Link>
        </div>
      </div>

    </div>
  );
}
