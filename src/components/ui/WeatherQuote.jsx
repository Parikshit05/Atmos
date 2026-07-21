import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import GlassCard from './GlassCard';

const quotes = [
  { text: "Weather is a great metaphor for life sometimes.", author: "Kevin Johnson" },
  { text: "There's no such thing as bad weather, only different kinds of good weather.", author: "John Ruskin" },
  { text: "The weather and my mood have little to do with my life's direction.", author: "Gail Caldwell" },
  { text: "Life's not about waiting for the storm to pass, it's about learning to dance in the rain.", author: "Vivian Greene" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  { text: "The sun did not know how beautiful its light was, until it was reflected off this world.", author: "Ruth St. Denis" },
  { text: "After every rain, there is always a rainbow.", author: "Unknown" },
  { text: "A change in the weather is sufficient to recreate the world and ourselves.", author: "Marcel Proust" },
];

const WeatherQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="p-6">
      <div className="flex items-start gap-4">
        <Quote size={24} className="text-blue-400/50 shrink-0 mt-1" />
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg italic bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                "{currentQuote.text}"
              </p>
              <p className="mt-3 text-sm text-slate-400">
                — {currentQuote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
};

export default WeatherQuote;
