import React, { useMemo, useRef, useState } from "react";
import { Brain, Target, TrendingUp, BookOpen, Zap, Layers, Lightbulb, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
}

const AdvancedTheoryCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: Slide[] = useMemo(() => [
    {
      id: "game-theory",
      title: "Game Theory Applications",
      subtitle: "Equilibria, strategies, and reframing competitions",
      icon: <Target className="w-6 h-6" />,
      color: "from-purple-500 to-blue-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-violet-50 dark:bg-purple-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-violet-800 dark:text-violet-200">
              Nash Equilibrium in Social Dynamics
            </h4>
            <p className="mb-3 sm:mb-4 text-violet-900 dark:text-violet-100 text-sm sm:text-base">
              Equilibrium occurs when neither party can improve their outcome by changing strategy unilaterally. The steadier frame often reaches equilibrium first.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Example</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                In a heated argument, remaining calm turns your frame into the stable equilibrium others adopt.
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-blue-800 dark:text-blue-200">Zero-Sum vs. Positive-Sum Frames</h4>
            <p className="text-blue-900 dark:text-blue-100 text-sm sm:text-base">
              Reframe outcomes from winner-takes-all to mutual benefit to reduce tension and create collaboration.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "cognitive-load",
      title: "Cognitive Load Theory",
      subtitle: "Working memory, overload attacks, and defense",
      icon: <Brain className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-green-50 dark:bg-green-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-green-800 dark:text-green-200">Working Memory Limits</h4>
            <p className="mb-3 sm:mb-4 text-green-900 dark:text-green-100 text-sm sm:text-base">
              Working memory holds ~7±2 items. Overload is a common attack vector in frame battles.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Defense Strategy</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                When overwhelmed, simplify to a binary choice: "This works for both of us, or it doesn’t."
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-amber-800 dark:text-amber-200">Attention as a Resource</h4>
            <p className="text-amber-900 dark:text-amber-100 text-sm sm:text-base">
              What gets attention gets importance. Direct attention deliberately to lead the frame.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "advanced-dynamics",
      title: "Advanced Frame Dynamics",
      subtitle: "Meta-frames, stacking, and aikido",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-pink-500 to-violet-500",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="rounded-xl p-4 sm:p-6 bg-purple-50 dark:bg-purple-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-purple-800 dark:text-purple-200">Meta-Frames</h4>
            <p className="text-purple-900 dark:text-purple-100 text-sm sm:text-base">
              Frames about frames: "I notice we’re both trying to control how this goes." Call out the layer above.
            </p>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-indigo-50 dark:bg-indigo-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-indigo-800 dark:text-indigo-200">Frame Stacking</h4>
            <p className="text-indigo-900 dark:text-indigo-100 text-sm sm:text-base">
              Combine Professional + Personal + Ethical frames to create robust positioning.
            </p>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-pink-50 dark:bg-pink-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-pink-800 dark:text-pink-200">Frame Aikido</h4>
            <p className="text-pink-900 dark:text-pink-100 text-sm sm:text-base">
              Redirect the opponent’s energy: "You’re right to be concerned about X, which is why Y makes sense."
            </p>
          </div>
        </div>
      )
    },
    {
      id: "signals",
      title: "Signals, Credibility, and Commitment",
      subtitle: "Costly signals and commitment devices",
      icon: <Layers className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-cyan-50 dark:bg-cyan-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-cyan-800 dark:text-cyan-200">Costly Signals</h4>
            <p className="text-cyan-900 dark:text-cyan-100 text-sm sm:text-base">
              Signals are credible when they’re costly to fake. Calm under pressure is a costly signal; it can’t be faked for long.
            </p>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-blue-800 dark:text-blue-200">Commitment Devices</h4>
            <p className="text-blue-900 dark:text-blue-100 text-sm sm:text-base">
              Declare reply windows or non-negotiables. Public commitments align behavior and make your frame predictable.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "escalation",
      title: "Escalation Control",
      subtitle: "Tempo leadership and rhythm resets",
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-500 to-red-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-amber-800 dark:text-amber-200">Tempo Leadership</h4>
            <p className="text-amber-900 dark:text-amber-100 text-sm sm:text-base">
              Set the pace. Declare reply windows. Slow your voice to reset anchors and reduce cortisol spikes.
            </p>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-red-50 dark:bg-red-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-red-800 dark:text-red-200">Escalation Ladders</h4>
            <p className="text-red-900 dark:text-red-100 text-sm sm:text-base">
              Pre-define levels of response: clarify → boundary → consequence. Calmly climb only as needed.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "case-patterns",
      title: "Case Patterns & Counterplays",
      subtitle: "Repeatable playbooks for common traps",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-rose-500 to-fuchsia-500",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <div className="rounded-xl p-4 sm:p-6 bg-rose-50 dark:bg-rose-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-rose-800 dark:text-rose-200">Public Pressure</h4>
            <p className="text-rose-900 dark:text-rose-100 text-sm sm:text-base">Playful deflection + positive reframe. Don’t feed the crowd’s cortisol.
            </p>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-fuchsia-50 dark:bg-fuchsia-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-fuchsia-800 dark:text-fuchsia-200">Selective Memory</h4>
            <p className="text-fuchsia-900 dark:text-fuchsia-100 text-sm sm:text-base">Quiet consistency + objective logs beat reactive arguing.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "neuroscience-influence",
      title: "Neuroscience of Influence",
      subtitle: "Mirror neurons, emotional contagion, and cortisol management",
      icon: <Brain className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-emerald-50 dark:bg-emerald-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-emerald-800 dark:text-emerald-200">Mirror Neurons & Emotional Contagion</h4>
            <p className="text-emerald-900 dark:text-emerald-100 text-sm sm:text-base mb-3">
              Mirror neurons fire both when acting and observing actions. Your calm becomes their calm through unconscious mimicry.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Application</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Lower your voice 20% when others escalate. Their brain automatically mirrors your calm energy.
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-teal-50 dark:bg-teal-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-teal-800 dark:text-teal-200">Cortisol & Decision Making</h4>
            <p className="text-teal-900 dark:text-teal-100 text-sm sm:text-base">
              High cortisol narrows cognitive flexibility by 40%. Calm frames literally expand their thinking capacity.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "behavioral-economics",
      title: "Advanced Behavioral Economics",
      subtitle: "Prospect theory, mental accounting, and choice architecture",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-indigo-50 dark:bg-indigo-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-indigo-800 dark:text-indigo-200">Mental Accounting Frames</h4>
            <p className="text-indigo-900 dark:text-indigo-100 text-sm sm:text-base mb-3">
              People categorize money/time differently. A "business investment" feels different than "personal expense" even for identical amounts.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Frame Technique</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                "This isn't about the money, it's about the principle" vs. "What's the actual dollar impact?"
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-purple-50 dark:bg-purple-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-purple-800 dark:text-purple-200">Endowment Effect Leverage</h4>
            <p className="text-purple-900 dark:text-purple-100 text-sm sm:text-base">
              Once someone mentally "owns" an idea or outcome, they'll defend it irrationally. Help them own the right solution.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "power-dynamics",
      title: "Power Dynamics & Status",
      subtitle: "Hierarchy signals, status games, and influence vectors",
      icon: <Target className="w-6 h-6" />,
      color: "from-red-500 to-orange-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-red-50 dark:bg-red-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-red-800 dark:text-red-200">Status Signal Recognition</h4>
            <p className="text-red-900 dark:text-red-100 text-sm sm:text-base mb-3">
              Voice tone, posture, response timing, and interruption patterns reveal hidden power structures in real-time.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Counter-Status Moves</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Acknowledge their expertise first, then redirect: "You're the expert on X, so you'll appreciate Y perspective."
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-orange-50 dark:bg-orange-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-orange-800 dark:text-orange-200">Authority Without Dominance</h4>
            <p className="text-orange-900 dark:text-orange-100 text-sm sm:text-base">
              True influence comes from competence + benevolence signals, not dominance displays. Be the stable center.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "temporal-dynamics",
      title: "Temporal Frame Dynamics",
      subtitle: "Time horizons, urgency manipulation, and temporal reframing",
      icon: <Clock className="w-6 h-6" />,
      color: "from-violet-500 to-indigo-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-violet-50 dark:bg-violet-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-violet-800 dark:text-violet-200">Time Horizon Expansion</h4>
            <p className="text-violet-900 dark:text-violet-100 text-sm sm:text-base mb-3">
              When pressured for immediate decisions, expand the time frame: "Let's think about this quarterly/annually."
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Pressure Relief</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                "I want to give this the consideration it deserves" vs. "I need to think about it."
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-indigo-50 dark:bg-indigo-900/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-indigo-800 dark:text-indigo-200">Urgency Inoculation</h4>
            <p className="text-indigo-900 dark:text-indigo-100 text-sm sm:text-base">
              Pre-establish your decision timeline: "I evaluate opportunities on Fridays." Creates urgency immunity.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "information-warfare",
      title: "Information Architecture",
      subtitle: "Data framing, selective disclosure, and narrative control",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-slate-500 to-gray-500",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-slate-800 dark:text-slate-200">Information Sequencing</h4>
            <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-3">
              Order of information creates narrative. Lead with context, then data, then implications. Control the story arc.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-1 sm:mb-2 text-slate-900 dark:text-white">Narrative Frames</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                "Here's what happened" vs. "Here's the context, what happened, and what it means."
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/40">
            <h4 className="font-bold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200">Cognitive Load Management</h4>
            <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base">
              Present 3 options max. Overwhelming choice creates decision paralysis and reactive responses.
            </p>
          </div>
        </div>
      )
    }
  ], []);

  const next = () => {
    setActiveIndex((i) => (i + 1) % slides.length);
    containerRef.current?.scrollTo({ left: (activeIndex + 1) * (containerRef.current.clientWidth), behavior: 'smooth' });
  };

  const prev = () => {
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length);
    containerRef.current?.scrollTo({ left: (activeIndex - 1 + slides.length) * (containerRef.current.clientWidth), behavior: 'smooth' });
  };

  return (
    <section id="section-advanced" aria-labelledby="tab-advanced" className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-4 sm:mb-6 md:mb-8 text-center">
        <h2 className="text-responsive-3xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">
          Advanced Theoretical Framework
        </h2>
        <p className="text-responsive-base text-slate-700 dark:text-slate-300">
          Double the depth. Powerful mental models. Built for action.
        </p>
      </div>

      {/* Carousel Controls */}
      <div className="relative">
        <div
          ref={containerRef}
          className="overflow-x-auto whitespace-nowrap snap-x snap-mandatory scrollbar-hide rounded-2xl glass-effect-mobile p-2 sm:p-3"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-roledescription="carousel"
        >
          <div className="flex gap-3 sm:gap-6">
            {slides.map((slide, idx) => (
              <article
                key={slide.id}
                className={`snap-start min-w-[92%] xs:min-w-[88%] sm:min-w-[75%] md:min-w-[60%] lg:min-w-[48%] p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${slide.color} text-white shadow-xl section-card-mobile transition-transform duration-300 ${idx === activeIndex ? 'scale-[1.0] sm:scale-[1.02]' : 'scale-[0.98]'}`}
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${slides.length}`}
              >
                <header className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                    <span className="w-5 h-5 text-white">{slide.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold leading-tight">{slide.title}</h3>
                    <p className="text-xs sm:text-sm text-white/90">{slide.subtitle}</p>
                  </div>
                </header>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-md">
                  {slide.content}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <button
            onClick={prev}
            className="btn-touch inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="flex items-center gap-1">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === activeIndex ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                aria-hidden
              />
            ))}
          </div>
          <button
            onClick={next}
            className="btn-touch inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Next slide"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Extra content grid under carousel */}
      <div className="mt-6 sm:mt-8 grid md:grid-cols-2 gap-3 sm:gap-6">
        <div className="glass-effect-mobile rounded-2xl p-4 sm:p-6">
          <h3 className="text-responsive-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Practical Heuristics
          </h3>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-responsive-sm">
            <li>• Name the frame, then name your standard</li>
            <li>• Slow your breath, slow the room</li>
            <li>• Move to higher time horizons when pressured</li>
            <li>• Ask binary questions when overwhelmed</li>
          </ul>
        </div>
        <div className="glass-effect-mobile rounded-2xl p-4 sm:p-6">
          <h3 className="text-responsive-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Pattern Library
          </h3>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-responsive-sm">
            <li>• Deadline rush → Present bias reframed as diligence</li>
            <li>• Public challenge → Playful redirection + invite</li>
            <li>• Moving goalposts → Re-anchor to agreed standards</li>
            <li>• Silence game → Return to mission, don’t chase</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdvancedTheoryCarousel;
