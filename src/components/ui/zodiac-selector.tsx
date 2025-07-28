import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const zodiacSigns = [
  { sign: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire" },
  { sign: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth" },
  { sign: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air" },
  { sign: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water" },
  { sign: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire" },
  { sign: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth" },
  { sign: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air" },
  { sign: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water" },
  { sign: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire" },
  { sign: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth" },
  { sign: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air" },
  { sign: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water" },
];

interface ZodiacSelectorProps {
  selectedSign?: string;
  onSignSelect: (sign: string) => void;
  className?: string;
}

export function ZodiacSelector({ selectedSign, onSignSelect, className = "" }: ZodiacSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = zodiacSigns.find(z => z.sign === selectedSign);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-14 text-lg cosmic-card border-2 border-primary/20 hover:border-primary/40"
      >
        {selected ? (
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{selected.symbol}</span>
            <div className="text-left">
              <div className="font-display font-semibold">{selected.sign}</div>
              <div className="text-sm text-muted-foreground">{selected.dates}</div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Select your zodiac sign</span>
        )}
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 cosmic-card border border-border/50 max-h-[300px] overflow-y-auto z-[9999] bg-background/95 backdrop-blur-sm shadow-2xl">
          <div className="grid grid-cols-2 gap-1 p-1">
            {zodiacSigns.map((zodiac) => (
              <button
                key={zodiac.sign}
                onClick={() => {
                  onSignSelect(zodiac.sign);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left min-h-[50px]"
              >
                <span className="text-xl">{zodiac.symbol}</span>
                <div className="flex-1">
                  <div className="font-display font-semibold text-foreground text-sm">{zodiac.sign}</div>
                  <div className="text-xs text-muted-foreground">{zodiac.dates}</div>
                  <div className="text-xs text-accent font-medium">{zodiac.element}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}