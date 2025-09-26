import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, Brain, Users, TrendingUp, ChevronDown, ChevronRight,
  CheckCircle, ArrowRight, Target, Shield, Clock, Zap,
  Download, AlertTriangle, Lightbulb, BarChart3, Calendar,
  Layers, Globe
} from "lucide-react";
import Assessment from "./components/Assessment";
import About from "./components/About";
import ScenarioSimulator from "./components/ScenarioSimulator";
import HabitTracker from "./components/HabitTracker";
import Flashcards from "./components/Flashcards";
import InteractiveCommunity from "./components/InteractiveCommunity";
import Connect from "./components/Connect";
import CommunityTest from "./components/CommunityTest";
import ProjectsRoadmap from "./components/ProjectsRoadmap";
import AdvancedTheoryCarousel from "./components/AdvancedTheoryCarousel";

interface Rule {
  id: number;
  title: string;
  behavioralPrinciple: string;
  description: string;
  test: string;
  trap: string;
  counterMove: string;
  icon: React.ReactNode;
  keyInsight: string;
  practicalExample: string;
}

type SectionId = "introduction" | "about" | "projects" | "assessment" | "rules" | "science" | "advanced" | "casestudies" | "practice" | "habits" | "flashcards" | "community" | "connect" | "test";

const STORAGE_KEY = "frame_econ_completed_rules_v2";
const PROGRESS_KEY = "frame_econ_progress_v1";

const HASH_TO_SECTION: Record<string, SectionId> = {
  "": "introduction",
  "#introduction": "introduction", 
  "#about": "about",
  "#projects": "projects",
  "#rules": "rules", 
  "#science": "science",
  "#advanced": "advanced", 
  "#casestudies": "casestudies", 
  "#practice": "practice",
  "#habits": "habits",
  "#flashcards": "flashcards",
  "#community": "community",
  "#connect": "connect",
  "#test": "test",
};

const FrameEconomicsWebsite: React.FC = () => {
  const [activeRule, setActiveRule] = useState<number | null>(null);
  const [completedRules, setCompletedRules] = useState<Set<number>>(new Set());
  const [currentSection, setCurrentSection] = useState<SectionId>("introduction");
  const [isLoading, setIsLoading] = useState(true);


  // Load saved data
  useEffect(() => {
    try {
      const rulesData = localStorage.getItem(STORAGE_KEY);
      const progressData = localStorage.getItem(PROGRESS_KEY);
      
      if (rulesData) {
        const parsed = JSON.parse(rulesData);
        setCompletedRules(new Set(parsed));
      }
      
      if (progressData) {
        const { section, expandedRule } = JSON.parse(progressData);
        if (section) setCurrentSection(section);
        if (expandedRule) setActiveRule(expandedRule);
      }
    } catch (error) {
      console.warn('Failed to load saved progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (isLoading) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedRules]));
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        section: currentSection,
        expandedRule: activeRule
      }));
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }, [completedRules, currentSection, activeRule, isLoading]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const section = HASH_TO_SECTION[window.location.hash];
      if (section && section !== currentSection) {
        setCurrentSection(section);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentSection]);

  const setSectionAndHash = useCallback((id: SectionId) => {
    setCurrentSection(id);
    const hash = Object.entries(HASH_TO_SECTION).find(([, v]) => v === id)?.[0] ?? "";
    if (hash && window.location.hash !== hash) {
      history.pushState(null, "", hash);
    }
  }, []);

  const rules: Rule[] = useMemo(() => [
    {
      id: 1, title: "Patience Under Fire", behavioralPrinciple: "Present Bias",
      description: "Humans discount the future and overreact to the present. Sudden drama feels urgent but rarely is.",
      test: "Delays, inconveniences, or last-minute emotional storms", 
      trap: "Impatience—snapping or scrambling for immediacy",
      counterMove: "Stay calm. Don't pay 'interest' on emotional present bias.", 
      icon: <Clock className="w-6 h-6" />,
      keyInsight: "Present bias makes people overvalue immediate rewards.", 
      practicalExample: "Pause 10s. Ask: \"Will this matter in a week?\""
    },
    {
      id: 2, title: "Refusing Unfair Blame", behavioralPrinciple: "Framing Effect",
      description: "Frames dictate perceived fairness.", 
      test: "\"You should've reminded me.\"", 
      trap: "Defending inside their frame",
      counterMove: "Reframe: clarify ownership without accepting false premises.", 
      icon: <Shield className="w-6 h-6" />,
      keyInsight: "Frames swing outcomes even with identical facts.", 
      practicalExample: "\"Looks like different views on responsibility.\""
    },
    {
      id: 3, title: "Silence Games", behavioralPrinciple: "Loss Aversion",
      description: "Silence is misread as loss; we chase.", 
      test: "Withdrawal or stonewalling", 
      trap: "Over-giving to win back attention",
      counterMove: "Treat silence as neutral; don't chase.", 
      icon: <Target className="w-6 h-6" />,
      keyInsight: "Losses loom larger than gains.", 
      practicalExample: "Return to your priorities; let silence inform, not control."
    },
    {
      id: 4, title: "Mood Swings & Emotional Pace", behavioralPrinciple: "Anchoring",
      description: "First emotions anchor the exchange.", 
      test: "Volatility & dramatic shifts", 
      trap: "Mirroring the chaos",
      counterMove: "Lower voice, slow pace; reset the anchor.", 
      icon: <Zap className="w-6 h-6" />,
      keyInsight: "Arbitrary anchors still bite.", 
      practicalExample: "Deliberate tempo forces a new anchor."
    },
    {
      id: 5, title: "Public Pressure", behavioralPrinciple: "Social Proof",
      description: "Groups follow calm confidence.", 
      test: "Public teasing or challenges", 
      trap: "Over-defensiveness",
      counterMove: "Playful redirection.", 
      icon: <Users className="w-6 h-6" />,
      keyInsight: "People echo groups even when wrong.", 
      practicalExample: "\"Tough crowd tonight!\" + smile."
    },
    {
      id: 6, title: "The Masculinity Challenge", behavioralPrinciple: "Nudge Theory",
      description: "Choice architecture steers behavior.", 
      test: "\"A real man would…\"", 
      trap: "Explaining yourself",
      counterMove: "Refuse the frame; live your code.", 
      icon: <ArrowRight className="w-6 h-6" />,
      keyInsight: "Nudges shift choices 30–40%.", 
      practicalExample: "\"I don't use that definition.\" (pivot)"
    },
    {
      id: 7, title: "Moving Goalposts", behavioralPrinciple: "Hyperbolic Discounting",
      description: "Shifting standards tax the present.", 
      test: "Escalating requirements", 
      trap: "Chasing to catch up",
      counterMove: "Set consistent standards & horizon.", 
      icon: <TrendingUp className="w-6 h-6" />,
      keyInsight: "We over-discount future value.", 
      practicalExample: "\"Let's agree stable standards, then proceed.\""
    },
    {
      id: 8, title: "Selective Memory", behavioralPrinciple: "Availability Bias",
      description: "Recency & drama overweigh memory.", 
      test: "Forgetting contributions", 
      trap: "Arguing your track record",
      counterMove: "Quiet consistency.", 
      icon: <Brain className="w-6 h-6" />,
      keyInsight: "Dramatic events feel more likely than they are.", 
      practicalExample: "Keep delivering; let evidence accumulate."
    },
    {
      id: 9, title: "Jealousy Traps", behavioralPrinciple: "Relative Comparison",
      description: "Value judged relatively.", 
      test: "Unfavorable comparisons", 
      trap: "Playing their comparison game",
      counterMove: "Opt out; pivot to mission.", 
      icon: <Target className="w-6 h-6" />,
      keyInsight: "People trade absolute value for relative wins.", 
      practicalExample: "\"Everyone has strengths.\" (pivot)"
    },
    {
      id: 10, title: "Rhythm Control", behavioralPrinciple: "Default Effect",
      description: "People adopt the default pace.", 
      test: "Urgency & tempo control", 
      trap: "Dancing to their rhythm",
      counterMove: "Lead cadence; declare reply windows.", 
      icon: <Clock className="w-6 h-6" />,
      keyInsight: "Defaults dominate behavior.", 
      practicalExample: "\"I check messages at 9 & 4.\""
    },
  ], []);

  const sections: { id: SectionId; title: string; icon: React.ReactNode }[] = useMemo(() => [
    { id: "introduction", title: "Introduction", icon: <BookOpen className="w-5 h-5" /> },
    { id: "about", title: "About", icon: <Users className="w-5 h-5" /> },
    { id: "projects", title: "Projects", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "assessment", title: "Assessment", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "rules", title: "The 10 Rules", icon: <Target className="w-5 h-5" /> },
    { id: "practice", title: "Practice", icon: <CheckCircle className="w-5 h-5" /> },
    { id: "habits", title: "Habit Tracker", icon: <Calendar className="w-5 h-5" /> },
    { id: "flashcards", title: "Flashcards", icon: <Layers className="w-5 h-5" /> },
    { id: "science", title: "The Science", icon: <Brain className="w-5 h-5" /> },
    { id: "advanced", title: "Advanced Theory", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "casestudies", title: "Case Studies", icon: <Users className="w-5 h-5" /> },
    { id: "community", title: "Community", icon: <Globe className="w-5 h-5" /> },
    { id: "connect", title: "Connect", icon: <Users className="w-5 h-5" /> },
    { id: "test", title: "🧪 Test", icon: <Zap className="w-5 h-5" /> },
  ], []);

  const toggleRule = useCallback((id: number) => {
    setActiveRule((prev) => (prev === id ? null : id));
  }, []);

  const markCompleted = useCallback((id: number) => {
    setCompletedRules((prev) => new Set([...prev, id]));
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const completionPercentage = useMemo(() => {
    return Math.round((completedRules.size / rules.length) * 100);
  }, [completedRules.size, rules.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-top safe-area-bottom">
      <div className="container mx-auto container-mobile py-4 sm:py-8">
        {/* Hero Section */}
        <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 mb-6 sm:mb-8 md:mb-12 overflow-hidden">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/60 to-purple-50/70 dark:from-slate-900/90 dark:via-blue-900/30 dark:to-purple-900/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(120,119,198,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(120,119,198,0.08),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06),transparent_50%)]"></div>
          
          {/* Enhanced floating elements - reduced on mobile */}
          <div className="hidden sm:block absolute top-12 left-12 w-16 h-16 sm:w-24 sm:h-24 rotate-45 bg-gradient-to-br from-blue-200/25 to-purple-200/25 dark:from-blue-800/15 dark:to-purple-800/15 blur-sm animate-pulse"></div>
          <div className="hidden md:block absolute top-40 right-20 w-24 h-24 sm:w-36 sm:h-36 rotate-12 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 dark:from-purple-800/12 dark:to-indigo-800/12 blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="hidden sm:block absolute bottom-24 left-1/3 w-12 h-12 sm:w-20 sm:h-20 -rotate-12 bg-gradient-to-br from-cyan-200/25 to-blue-200/25 dark:from-cyan-800/15 dark:to-blue-800/15 blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="hidden md:block absolute top-20 right-1/4 w-10 h-10 sm:w-14 sm:h-14 rotate-45 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="container mx-auto container-mobile relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Strong tagline - mobile optimized */}
              <h1 className="text-responsive-4xl font-bold mb-4 sm:mb-6 animate-slide-up">
                <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight block">
                  Master the Hidden
                </span>
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent block">
                  Psychology of Influence
                </span>
              </h1>
              
              {/* Compelling subtitle */}
              <p className="text-responsive-xl text-slate-700 dark:text-slate-300 mb-6 sm:mb-8 leading-relaxed font-medium">
                Through behavioral economics and frame control
              </p>
              
              {/* Value proposition - mobile optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 max-w-5xl mx-auto">
                <div className="group text-center p-4 sm:p-6 glass-effect-mobile section-card-mobile rounded-xl sm:rounded-2xl">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-responsive-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">10 Proven Rules</h3>
                  <p className="text-responsive-sm text-slate-600 dark:text-slate-400 leading-relaxed">Science-backed behavioral economics principles that reveal the hidden psychology of influence</p>
                </div>
                <div className="group text-center p-4 sm:p-6 glass-effect-mobile section-card-mobile rounded-xl sm:rounded-2xl">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-responsive-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">Interactive Training</h3>
                  <p className="text-responsive-sm text-slate-600 dark:text-slate-400 leading-relaxed">Practice real-world scenarios with instant feedback and personalized learning paths</p>
                </div>
                <div className="group text-center p-4 sm:p-6 glass-effect-mobile section-card-mobile rounded-xl sm:rounded-2xl sm:col-span-2 md:col-span-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-responsive-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">Unshakeable Frame</h3>
                  <p className="text-responsive-sm text-slate-600 dark:text-slate-400 leading-relaxed">Build authentic confidence rooted in your values, not reactive to others' manipulation</p>
                </div>
              </div>
              
              {/* Clear call to action - mobile optimized */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                <button
                  onClick={() => setSectionAndHash("assessment")}
                  className="group w-full sm:w-auto btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Start Your Assessment</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => setSectionAndHash("rules")}
                  className="w-full sm:w-auto btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-slate-900 font-semibold rounded-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Explore the Rules</span>
                  </span>
                </button>
              </div>
              
              {/* Progress indicator for returning users - mobile optimized */}
              {completedRules.size > 0 && (
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 glass-effect-mobile rounded-lg sm:rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-responsive-sm text-center">
                    <span className="hidden xs:inline">{completionPercentage}% Complete • {completedRules.size}/{rules.length} rules mastered</span>
                    <span className="xs:hidden">{completedRules.size}/{rules.length} Complete</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Navigation - Mobile Optimized */}
        <nav className="flex justify-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 sticky top-16 sm:top-4 z-30 container-mobile" aria-label="Primary">
          <div 
            role="tablist" 
            aria-orientation="horizontal"
            className="flex glass-effect-mobile rounded-xl sm:rounded-2xl p-1.5 sm:p-2 overflow-x-auto shadow-lg sm:shadow-xl border border-white/20 dark:border-white/10 backdrop-blur-md w-full max-w-full scrollbar-hide"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {sections.map((section, idx) => {
              const selected = currentSection === section.id;
              return (
                <button 
                  key={section.id} 
                  role="tab" 
                  aria-selected={selected}
                  aria-controls={`section-${section.id}`} 
                  id={`tab-${section.id}`}
                  onClick={() => setSectionAndHash(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      setSectionAndHash(sections[(idx + 1) % sections.length].id);
                    } else if (e.key === "ArrowLeft") {
                      setSectionAndHash(sections[(idx - 1 + sections.length) % sections.length].id);
                    } else if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setSectionAndHash(section.id);
                    }
                  }}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl whitespace-nowrap flex-shrink-0
                    transition-all duration-300 focus:outline-none focus:ring-2 
                    focus:ring-purple-400/60 font-medium text-xs sm:text-sm md:text-base btn-touch
                    scroll-snap-align: start;
                    ${selected 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md sm:shadow-lg transform scale-100 sm:scale-105" 
                      : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-sm sm:hover:shadow-md"
                    }
                  `}
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0">
                    {section.icon}
                  </span>
                  <span className="hidden xs:inline sm:inline">{section.title}</span>
                  <span className="xs:hidden text-xs font-semibold">
                    {section.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sections */}
        {currentSection === "introduction" && (
          <section 
            id="section-introduction" 
            aria-labelledby="tab-introduction" 
            className="max-w-4xl mx-auto animate-fade-in"
          >
            <div className="glass-effect rounded-3xl p-8 mb-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                The Intersection of Psychology and Power
              </h2>
              
              {/* Key concept - scannable */}
              <div className="text-center mb-10">
                <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                  Understand the hidden economics of behavior.
                </p>
                <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                  Keep your center when others try to destabilize it.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  We respond to biases, anchors, losses, and context in predictable ways.<br />
                  Frame control is holding steady in those storms.
                </p>
              </div>
              
              {/* Core principle - prominent */}
              <div className="bg-gradient-to-r from-violet-100 via-purple-50 to-indigo-100 dark:from-purple-900/50 dark:via-purple-900/30 dark:to-indigo-900/50 rounded-2xl p-8 my-10 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-4">
                    Core Principle
                  </h3>
                  <p className="text-xl text-purple-900 dark:text-purple-100 font-medium">
                    Masters don't fight for control—they become the stable center others orbit.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-8 shadow-sm border border-blue-100 dark:border-blue-800/30">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                      What You'll Master
                    </h4>
                  </div>
                  <ul className="space-y-3 text-blue-900 dark:text-blue-100">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>10 behavioral economics principles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Frame control techniques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Practical counter-strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Real-world applications</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 shadow-sm border border-green-100 dark:border-green-800/30">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                      Interactive Training
                    </h4>
                  </div>
                  <ul className="space-y-3 text-green-900 dark:text-green-100">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Scenario-based practice</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Habit tracking system</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Spaced repetition flashcards</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Progress analytics</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl p-8 shadow-sm border border-purple-100 dark:border-purple-800/30">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                      Community Wisdom
                    </h4>
                  </div>
                  <ul className="space-y-3 text-purple-900 dark:text-purple-100">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Peer success stories</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Expert insights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Practice statistics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Learning community</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Ready to Build Your Unshakeable Frame?
              </h3>
              
              {/* Primary actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button
                  onClick={() => setSectionAndHash("assessment")}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" />
                    Start Assessment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => setSectionAndHash("rules")}
                  className="px-8 py-4 bg-transparent border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-slate-900 font-semibold rounded-xl transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    Explore the Rules
                  </span>
                </button>
              </div>
              
              {/* Secondary quick access - more spaced */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">Quick Access:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                  <button
                    onClick={() => setSectionAndHash("practice")}
                    className="flex flex-col items-center gap-2 p-4 glass-effect hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
                  >
                    <CheckCircle className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Practice</span>
                  </button>
                  <button
                    onClick={() => setSectionAndHash("habits")}
                    className="flex flex-col items-center gap-2 p-4 glass-effect hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-200 group"
                  >
                    <Calendar className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Track</span>
                  </button>
                  <button
                    onClick={() => setSectionAndHash("flashcards")}
                    className="flex flex-col items-center gap-2 p-4 glass-effect hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all duration-200 group"
                  >
                    <Layers className="w-6 h-6 text-teal-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Study</span>
                  </button>
                  <button
                    onClick={() => setSectionAndHash("community")}
                    className="flex flex-col items-center gap-2 p-4 glass-effect hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200 group"
                  >
                    <Globe className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Community</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentSection === "about" && (
          <section 
            id="section-about" 
            aria-labelledby="tab-about" 
            className="max-w-4xl mx-auto animate-fade-in"
          >
            <About onNavigateToProjects={() => setSectionAndHash("projects")} />
          </section>
        )}

        {currentSection === "projects" && (
          <section 
            id="section-projects" 
            aria-labelledby="tab-projects" 
            className="max-w-6xl mx-auto animate-fade-in"
          >
            <ProjectsRoadmap />
          </section>
        )}

        {currentSection === "assessment" && (
          <section 
            id="section-assessment" 
            aria-labelledby="tab-assessment" 
            className="animate-fade-in"
          >
            <Assessment />
          </section>
        )}

        {currentSection === "rules" && (
          <section 
            id="section-rules" 
            aria-labelledby="tab-rules" 
            className="max-w-4xl mx-auto animate-fade-in"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                The 10 Rules of Frame Economics
              </h2>
              <p className="text-lg text-slate-700 dark:text-purple-200 mb-4">
                Each rule pairs a behavioral principle with a tactical response.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Progress: {completedRules.size}/10 mastered</span>
                </div>
                <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {rules.map((rule) => {
                const open = activeRule === rule.id;
                const isCompleted = completedRules.has(rule.id);
                
                return (
                  <div 
                    key={rule.id} 
                    className={`
                      glass-effect rounded-2xl overflow-hidden shadow-lg rule-card
                      transition-all duration-200 hover:shadow-xl
                      ${isCompleted ? 'ring-2 ring-green-500/50' : ''}
                    `}
                  >
                    <button 
                      onClick={() => toggleRule(rule.id)} 
                      aria-expanded={open} 
                      aria-controls={`rule-panel-${rule.id}`}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          flex items-center justify-center w-12 h-12 rounded-xl text-white transition-colors duration-200
                          ${isCompleted ? 'bg-green-600' : 'bg-purple-600 dark:bg-purple-500'}
                        `}>
                          {isCompleted ? <CheckCircle className="w-6 h-6" /> : rule.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Rule {rule.id}: {rule.title}
                          </h3>
                          <p className="text-slate-700 dark:text-purple-200">
                            Behavioral Principle: {rule.behavioralPrinciple}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isCompleted && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                            Mastered
                          </span>
                        )}
                        <div className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                          {open ? (
                            <ChevronDown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <ChevronRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {open && (
                      <div 
                        id={`rule-panel-${rule.id}`} 
                        className="px-6 pb-6 animate-slide-up"
                      >
                        <div className="rounded-xl p-6 space-y-6 bg-violet-50 dark:bg-purple-900/30">
                          <div>
                            <h4 className="font-semibold text-violet-700 dark:text-purple-300 mb-2">
                              Description
                            </h4>
                            <p className="text-slate-900 dark:text-white">
                              {rule.description}
                            </p>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="rounded-lg p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                              <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                The Test
                              </h5>
                              <p className="text-sm text-red-900 dark:text-red-100">
                                {rule.test}
                              </p>
                            </div>
                            
                            <div className="rounded-lg p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                              <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                The Trap
                              </h5>
                              <p className="text-sm text-orange-900 dark:text-orange-100">
                                {rule.trap}
                              </p>
                            </div>
                            
                            <div className="rounded-lg p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                              <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Counter-Move
                              </h5>
                              <p className="text-sm text-green-900 dark:text-green-100">
                                {rule.counterMove}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                              <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                Key Insight
                              </h5>
                              <p className="text-blue-900 dark:text-blue-100">
                                {rule.keyInsight}
                              </p>
                            </div>
                            
                            <div className="rounded-lg p-4 bg-violet-100 dark:bg-purple-900/40 border border-violet-200 dark:border-purple-800">
                              <h5 className="font-semibold text-violet-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Practical Example
                              </h5>
                              <p className="text-violet-900 dark:text-purple-100">
                                {rule.practicalExample}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <button 
                              onClick={() => markCompleted(rule.id)} 
                              disabled={isCompleted}
                              className={`
                                px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium
                                ${isCompleted 
                                  ? "bg-green-600 text-white cursor-not-allowed" 
                                  : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
                                }
                              `}
                            >
                              <CheckCircle className="w-4 h-4" />
                              {isCompleted ? "Mastered!" : "Mark as Understood"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {completedRules.size === rules.length && (
              <div className="mt-8 text-center animate-fade-in">
                <div className="glass-effect rounded-2xl p-8 border-2 border-green-500/50">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                    You've mastered all 10 rules of Frame Economics. Ready to put them into practice?
                  </p>
                  <button
                    onClick={() => setSectionAndHash("practice")}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Go to Practice Guide
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {currentSection === "science" && (
          <section 
            id="section-science" 
            aria-labelledby="tab-science" 
            className="max-w-4xl mx-auto animate-fade-in"
          >
            <div className="glass-effect rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                The Science Behind Frame Economics
              </h2>
              <div className="space-y-8">
                <div className="rounded-2xl p-6 bg-violet-50 dark:bg-purple-900/30 border border-violet-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    Behavioral Economics Foundations
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900 dark:text-white">System 1:</strong> Fast, automatic, emotional decision-making
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900 dark:text-white">System 2:</strong> Slow, deliberate, rational thinking
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        Most social exchanges operate in System 1 mode
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Frame Control Psychology
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        Frames set the context and meaning of interactions
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        The clearest, calmest frame typically wins
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        Authenticity beats manipulation in long-term relationships
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                    Neuroscience Insights
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        Limbic system signals precede prefrontal cortex reasoning
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        Mirror neurons cause people to echo visible calm or chaos
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        Elevated cortisol narrows cognitive flexibility
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl p-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    Key Research Studies
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                        Kahneman & Tversky (1979) - Prospect Theory
                      </h4>
                      <p className="text-amber-900 dark:text-amber-100 mt-1">
                        People feel losses more intensely than equivalent gains, explaining why silence games are so effective.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                        Cialdini (1984) - Social Proof
                      </h4>
                      <p className="text-amber-900 dark:text-amber-100 mt-1">
                        People look to others' behavior for cues, especially under uncertainty or social pressure.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                        Thaler & Sunstein (2008) - Nudge Theory
                      </h4>
                      <p className="text-amber-900 dark:text-amber-100 mt-1">
                        Choice architecture can predictably alter behavior without restricting options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentSection === "advanced" && (
          <AdvancedTheoryCarousel />
        )}

        {currentSection === "casestudies" && (
          <section 
            id="section-casestudies" 
            aria-labelledby="tab-casestudies" 
            className="max-w-5xl mx-auto animate-fade-in"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Frame Economics Case Studies
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                Real-world applications and detailed breakdowns.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="glass-effect rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <TrendingUp className="w-7 h-7 text-green-600 dark:text-green-400" />
                  High-Stakes Business Negotiation
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-slate-900 dark:text-white">Scenario</h4>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                      Startup acquisition negotiation. Initial offer: $50M. Target value: $120M. 
                      Buyer uses time pressure and anchoring attacks.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                        <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Attacks Used</h5>
                        <ul className="space-y-1 text-red-900 dark:text-red-100 text-sm">
                          <li>• "Offer expires Friday" → Present bias</li>
                          <li>• "Similar companies sold for $30-40M" → Anchoring</li>
                          <li>• "Market conditions are worsening" → Loss aversion</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                        <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Counter-Strategies</h5>
                        <ul className="space-y-1 text-green-900 dark:text-green-100 text-sm">
                          <li>• Re-anchor with future growth metrics</li>
                          <li>• "Good deals don't need artificial deadlines"</li>
                          <li>• Present multi-scenario valuations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-200">Outcome</h4>
                    <p className="text-blue-900 dark:text-blue-100">
                      Final sale: $95M. By refusing the rushed timeline and reframing around sustainable growth, 
                      the seller created space for proper due diligence and fair valuation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-effect rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  Team Leadership Challenge
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-slate-900 dark:text-white">Scenario</h4>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                      Project team facing tight deadlines and quality concerns. Team member publicly challenges 
                      leader's prioritization in front of stakeholders.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
                        <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Challenge</h5>
                        <ul className="space-y-1 text-orange-900 dark:text-orange-100 text-sm">
                          <li>• Public undermining → Social proof</li>
                          <li>• Quality vs. speed false dilemma</li>
                          <li>• Stakeholder anxiety about delays</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                        <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Frame Response</h5>
                        <ul className="space-y-1 text-green-900 dark:text-green-100 text-sm">
                          <li>• "Great teams surface concerns early"</li>
                          <li>• Reframe as quality-first approach</li>
                          <li>• "Let's solve this together"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-purple-800 dark:text-purple-200">Key Moves</h4>
                    <ul className="space-y-2 text-purple-900 dark:text-purple-100">
                      <li>1. <strong>Acknowledge publicly:</strong> "Sarah raises important quality concerns"</li>
                      <li>2. <strong>Reframe the dilemma:</strong> "Our goal is sustainable delivery, not just speed"</li>
                      <li>3. <strong>Include the challenger:</strong> "Sarah, can you lead the quality review workstream?"</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="glass-effect rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <Shield className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  Personal Relationship Dynamics
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-slate-900 dark:text-white">Scenario</h4>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                      Partner uses silent treatment after disagreement about weekend plans. 
                      Classic silence game combined with guilt induction.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                        <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Manipulation Tactics</h5>
                        <ul className="space-y-1 text-red-900 dark:text-red-100 text-sm">
                          <li>• Withdrawal of attention → Loss aversion</li>
                          <li>• Making you chase for reconciliation</li>
                          <li>• Implicit message: "You should have known better"</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Frame Economics Response</h5>
                        <ul className="space-y-1 text-blue-900 dark:text-blue-100 text-sm">
                          <li>• Don't chase or over-pursue</li>
                          <li>• Maintain your own emotional baseline</li>
                          <li>• "I'm here when you're ready to talk"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-green-800 dark:text-green-200">Long-term Strategy</h4>
                    <p className="text-green-900 dark:text-green-100">
                      Establish clear communication norms: "Silent treatment doesn't work for me. 
                      If you need space, just say 'I need space' and I'll respect that. 
                      But withdrawal without communication isn't fair to either of us."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentSection === "practice" && (
          <section 
            id="section-practice" 
            aria-labelledby="tab-practice" 
            className="animate-fade-in"
          >
            <ScenarioSimulator />
          </section>
        )}

        {currentSection === "habits" && (
          <section 
            id="section-habits" 
            aria-labelledby="tab-habits" 
            className="animate-fade-in"
          >
            <HabitTracker />
          </section>
        )}

        {currentSection === "flashcards" && (
          <section 
            id="section-flashcards" 
            aria-labelledby="tab-flashcards" 
            className="animate-fade-in"
          >
            <Flashcards />
          </section>
        )}

        {currentSection === "community" && (
          <section 
            id="section-community" 
            aria-labelledby="tab-community" 
            className="animate-fade-in"
          >
            <InteractiveCommunity />
          </section>
        )}

        {currentSection === "connect" && (
          <section 
            id="section-connect" 
            aria-labelledby="tab-connect" 
            className="animate-fade-in"
          >
            <Connect />
          </section>
        )}

        {currentSection === "test" && (
          <section 
            id="section-test" 
            aria-labelledby="tab-test" 
            className="animate-fade-in"
          >
            <CommunityTest />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 md:mt-16 text-center">
          <div className="glass-effect rounded-2xl px-8 py-6 mb-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                Build an unshakeable frame: calm, consistent, value-anchored.
              </p>
            </div>
            
            <div className="flex justify-center gap-2 mb-6 no-print flex-wrap">
              {completedRules.size < rules.length ? (
                <button
                  onClick={() => setSectionAndHash("rules")}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setSectionAndHash("practice")}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
                >
                  <Target className="w-4 h-4" />
                  Practice
                </button>
              )}
              
              <button
                onClick={() => setSectionAndHash("habits")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
              >
                <Calendar className="w-4 h-4" />
                Track
              </button>
              
              <button
                onClick={() => setSectionAndHash("flashcards")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
              >
                <Layers className="w-4 h-4" />
                Study
              </button>
              
              <button
                onClick={() => setSectionAndHash("community")}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                Community
              </button>
              
              <button
                onClick={() => setSectionAndHash("connect")}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
              >
                <Users className="w-4 h-4" />
                Connect
              </button>
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 glass-effect hover:bg-white/15 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Frame Economics • 
            Master the psychology of influence through behavioral economics
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FrameEconomicsWebsite;