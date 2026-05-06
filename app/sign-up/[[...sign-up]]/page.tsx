import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      {/* ─── Tricolor Top ─── */}
      <div className="gov-tricolor">
        <div className="saffron" />
        <div className="white" />
        <div className="green" />
      </div>

      {/* ─── Header ─── */}
      <header className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-[#003366] flex items-center justify-center text-white font-black text-xl border border-[#FF9933]">
              N
            </div>
            <div>
              <h1 className="text-lg font-black text-[#003366] tracking-tighter uppercase">
                NirnayAI
              </h1>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                Secure Evaluation Portal
              </p>
            </div>
          </a>
          <a href="/sign-in" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#003366] transition-colors">
            Already Enrolled? Login →
          </a>
        </div>
      </header>

      {/* ─── Sign Up ─── */}
      <main className="flex-1 flex items-center justify-center p-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003366 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-md border border-gray-200 !rounded-none",
                headerTitle: "text-[#003366] font-black uppercase tracking-tighter",
                headerSubtitle: "text-gray-500 font-bold text-xs uppercase tracking-wider",
                formButtonPrimary: "bg-[#003366] hover:bg-[#002244] !rounded-none font-black text-xs uppercase tracking-[0.2em]",
                formFieldInput: "border-2 border-gray-100 !rounded-none focus:border-[#003366] font-medium",
                formFieldLabel: "text-xs font-black text-[#003366] uppercase tracking-widest",
                footerActionLink: "text-[#003366] font-bold hover:text-[#FF9933]",
                socialButtonsBlockButton: "!rounded-none border-2 border-gray-100 font-bold",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-400 font-black text-xs uppercase tracking-widest",
              },
            }}
          />
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            © 2026 NirnayAI Platform | Ministry of Home Affairs | e-Governance Division
          </p>
        </div>
      </footer>
    </div>
  );
}
