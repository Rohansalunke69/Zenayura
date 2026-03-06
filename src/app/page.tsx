import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";

export default function PublicLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FFF8] font-sans selection:bg-[#2E7D32] selection:text-white">
      {/* 
        HERO SECTION + HEADER 
        Dark green background with rounded bottom corners.
      */}
      <div className="relative bg-[#2E7D32] rounded-b-[3rem] md:rounded-b-[6rem] pb-32 md:pb-64 pt-6 px-6 md:px-12 flex flex-col items-center overflow-hidden">
        {/* Header / Nav */}
        <header className="w-full max-w-7xl flex items-center justify-between z-20">
          <div className="text-white text-2xl font-bold tracking-tight">
            Zenayura.
          </div>
          <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm">
            <Link href="#" className="hover:text-white transition">Home</Link>
            <Link href="#" className="hover:text-white transition">About us</Link>
            <Link href="#" className="hover:text-white transition">Contact us</Link>
            <Link href="#" className="hover:text-white transition">Services</Link>
          </nav>
          <div className="hidden md:block">
            <Link href="/dashboard/ai-assistant" className="bg-white text-[#2E7D32] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-50 transition shadow-sm">
              Book Appointment
            </Link>
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
          <Link href="/dashboard/ai-assistant" className="bg-[#1f5c22] text-white px-8 py-3 rounded-full font-medium shadow-md hover:bg-[#1a4f1d] transition">
            Book Appointment
          </Link>
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
        FLOATING APPOINTMENT BOOKING CARD
        Pulls up over the dark green background.
      */}
      <div className="w-full max-w-5xl mx-auto px-4 relative z-30 -mt-24 md:-mt-16">
        <div className="bg-white rounded-2xl md:rounded-full shadow-xl shadow-green-900/5 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 border border-slate-100">

          <div className="flex flex-col w-full md:w-auto px-4 md:border-r border-slate-100">
            <label className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Choose Services</label>
            <div className="flex items-center justify-between gap-2 text-slate-800 font-medium cursor-pointer">
              Dosha Balancing <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto px-4 md:border-r border-slate-100">
            <label className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Choose Date</label>
            <div className="flex items-center justify-between gap-2 text-slate-800 font-medium cursor-pointer">
              DD/MM/YYYY <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto px-4">
            <label className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Contact Number</label>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> +91 968 727 9122
            </div>
          </div>

          <div className="w-full md:w-auto px-2">
            <Link href="/dashboard/ai-assistant" className="flex w-full md:w-auto justify-center rounded-full border-2 border-[#A5D6A7] text-[#2E7D32] px-6 py-2.5 font-semibold text-sm hover:bg-[#A5D6A7]/10 transition whitespace-nowrap">
              Book Appointment
            </Link>
          </div>

        </div>
      </div>

      {/* 
        SERVICES SECTION 
        Dark Green solid background block
      */}
      <div className="w-full bg-[#2E7D32] mt-32 py-24 px-6 md:px-12">
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

      {/* 
        STATISTICS SECTION
        White background, large circular dials
      */}
      <div className="w-full bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-[#A5D6A7] flex items-center justify-center bg-[#2E7D32] shadow-xl shadow-green-900/10 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 border-[6px] border-white rounded-full pointer-events-none"></div>
              <span className="text-white text-3xl font-bold">67+</span>
            </div>
            <h3 className="font-bold text-[#2E7D32] text-lg mb-2">Qualified Doctors</h3>
            <p className="text-slate-500 text-sm max-w-[200px]">Medical experts present in our clinic</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-[#A5D6A7] flex items-center justify-center bg-[#2E7D32] shadow-xl shadow-green-900/10 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 border-[6px] border-white rounded-full pointer-events-none"></div>
              <span className="text-white text-3xl font-bold">99%</span>
            </div>
            <h3 className="font-bold text-[#2E7D32] text-lg mb-2">Recover Patients</h3>
            <p className="text-slate-500 text-sm max-w-[200px]">Your life is more important to us for growth</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-[#A5D6A7] flex items-center justify-center bg-[#2E7D32] shadow-xl shadow-green-900/10 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 border-[6px] border-white rounded-full pointer-events-none"></div>
              <span className="text-white text-3xl font-bold">98%</span>
            </div>
            <h3 className="font-bold text-[#2E7D32] text-lg mb-2">Satisfaction Rate</h3>
            <p className="text-slate-500 text-sm max-w-[200px]">More than 10,000+ seats by our team</p>
          </div>

        </div>
      </div>

      {/* 
        DOCTORS / EXPERTS CLOSING SECTION
        Bottom image showcase overlay.
      */}
      <div className="w-full relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
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
