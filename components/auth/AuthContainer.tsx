import { ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import { SocialLogin } from "./SocialLogin";

interface AuthContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  showSocial?: boolean;
}

export function AuthContainer({ title, description, children, showSocial = true }: AuthContainerProps) {
  return (
    <div className="w-[92%] max-w-[430px] bg-black/60 backdrop-blur-xl border border-green-deep/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(72,255,36,0.05)] relative z-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/" 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-green-neon hover:bg-white/10 hover:border-green-neon/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-green-deep/30 border border-green-neon/20 shadow-[0_0_10px_rgba(72,255,36,0.3)]">
            <Crown className="w-4 h-4 text-green-neon" />
          </div>
          <span className="text-sm font-bold tracking-tight text-green-neon">O REI DO PROMPT</span>
        </div>
        <div className="w-10"></div> {/* Placeholder for centering */}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      <div className="relative">
        {children}
      </div>

      {showSocial && <SocialLogin />}
    </div>
  );
}
