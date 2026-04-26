"use client";

import { RefreshCcw, Quote, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VerseCardProps {
  initialVerse: { text: string; category: string };
  category: string;
}

export default function VerseCard({ initialVerse, category }: VerseCardProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <main className="w-full max-w-lg z-10">
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-wider text-primary mb-4">
          <Sparkles className="w-3 h-3" />
          NFC Activated
        </div>
        <h2 className="text-4xl font-heading font-bold tracking-tight text-foreground">
          Daily {category}
        </h2>
      </div>

      <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-700">
        <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/10 -z-10" />
        
        <div className="flex flex-col gap-6 text-center">
          <p className="text-xl md:text-2xl leading-relaxed font-medium text-foreground/90 italic">
            "{initialVerse.text}"
          </p>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />
          
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              New Verse
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-muted-foreground text-sm animate-in fade-in duration-1000 delay-500">
        <p>© {new Date().getFullYear()} NFC Bracelet System</p>
      </footer>
    </main>
  );
}
