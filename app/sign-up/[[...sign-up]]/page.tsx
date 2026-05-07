"use client";

import { SignUp } from "@clerk/nextjs";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Link from "next/link";
import { RetroGrid } from "@/components/ui/retro-grid";

export default function SignUpPage() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* ─── Left Side: Form ─── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-zinc-950 h-full overflow-hidden">
        {/* Top bar with back button and theme toggle */}
        <div className="flex items-center justify-between px-6 lg:px-10 py-5 flex-shrink-0">
          <Link 
            href="/sign-in" 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-[#003366] dark:hover:text-[#FF9933] transition-colors"
          >
            ← Already have an account? Sign in
          </Link>
          <AnimatedThemeToggler 
            variant="circle" 
            duration={400} 
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors" 
          />
        </div>

        {/* Form container - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-sm py-8">
              <SignUp 
                fallbackRedirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 rounded-xl",
                    headerTitle: "text-[#003366] dark:text-zinc-100 font-semibold text-2xl tracking-tight mb-2 text-center",
                    headerSubtitle: "text-slate-500 dark:text-zinc-400 text-sm mb-6 text-center",
                    formButtonPrimary: "bg-[#003366] hover:bg-[#002244] dark:bg-[#003d7a] dark:hover:bg-[#004a99] !rounded-lg font-medium text-sm h-11 transition-colors w-full",
                    formFieldInput: "border border-slate-300 dark:border-zinc-600 !rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all h-11 px-4",
                    formFieldLabel: "text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5 block",
                    footerActionLink: "text-[#003366] dark:text-[#FF9933] font-medium hover:underline",
                    socialButtonsBlockButton: "!rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors h-11",
                    dividerLine: "bg-slate-300 dark:bg-zinc-600",
                    dividerText: "text-slate-500 dark:text-zinc-300 text-xs font-medium",
                    formFieldErrorText: "text-red-500 text-xs mt-1 dark:text-red-400",
                    formFieldSuccessText: "text-green-600 text-xs mt-1 dark:text-green-400",
                    identityPreviewEditButton: "text-[#003366] dark:text-[#FF9933]",
                    formResendCodeLink: "text-[#003366] dark:text-[#FF9933] font-medium",
                    otpCodeFieldInput: "!h-11 !rounded-lg bg-white dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 text-slate-900 dark:text-white",
                    formFieldRow: "mb-4",
                    formButtonRow: "mt-6",
                    main: "gap-5",
                    form: "gap-4",
                    alternativeMethodsBlockButton: "border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-700",
                    identityPreviewText: "text-slate-700 dark:text-zinc-300",
                    formFieldInfoText: "text-slate-500 dark:text-zinc-300 text-xs",
                    formFieldWarningText: "text-amber-600 dark:text-amber-400 text-xs",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    showOptionalFields: true,
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 lg:px-10 py-5 text-center flex-shrink-0 border-t border-slate-100 dark:border-zinc-800">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Protected by AES-256 Encryption • GFR 2024 Compliant
          </p>
        </div>
      </div>

      {/* ─── Right Side: Branding ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#003366] relative overflow-hidden items-center justify-center">
        {/* Background effects */}
        <div className="absolute inset-0">
          <RetroGrid 
            className="opacity-20"
            angle={65} 
            cellSize={60} 
            opacity={0.3}
            lightLineColor="#ffffff30"
            darkLineColor="#ffffff20"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003366] via-[#002244] to-[#001a33]" />
        
        {/* Decorative elements - glassmorphism circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#FF9933]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-[#FF9933]/20 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-xl border border-white/20 rounded-lg">
              N
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">NirnayAI</span>
          </div>

          {/* Tagline */}
          <h2 className="text-3xl font-semibold text-white mb-4 leading-tight">
            Join the Future of Procurement
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your account to access AI-powered tender evaluation and streamline your compliance workflow
          </p>

          {/* Stats or features */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-semibold text-[#FF9933]">500+</div>
              <div className="text-xs text-white/60 mt-1">Tenders Processed</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#FF9933]">50+</div>
              <div className="text-xs text-white/60 mt-1">Govt Organizations</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#FF9933]">Zero</div>
              <div className="text-xs text-white/60 mt-1">Data Breaches</div>
            </div>
          </div>
        </div>

        {/* Bottom corner accent */}
        <div className="absolute bottom-8 right-8 text-right">
          <p className="text-xs text-white/40">
            Need help getting started?<br />
            Contact support@nirnayai.gov.in
          </p>
        </div>
      </div>
    </div>
  );
}
