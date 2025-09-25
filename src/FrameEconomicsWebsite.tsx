import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, Brain, Users, TrendingUp, ChevronDown, ChevronRight,
  CheckCircle, ArrowRight, Target, Shield, Clock, Zap, Printer,
  Download, AlertTriangle, Lightbulb, BarChart3
} from "lucide-react";
import Assessment from "./components/Assessment";

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

type SectionId = "introduction" | "assessment" | "rules" | "science" | "advanced" | "casestudies" | "practice";

const STORAGE_KEY = "frame_econ_completed_rules_v2";
const PROGRESS_KEY = "frame_econ_progress_v1";

const HASH_TO_SECTION: Record<string, SectionId> = {
  "#introduction": "introduction",
  "#assessment": "assessment",
  "#rules": "rules", 
  "#science": "science",
  "#advanced": "advanced", 
  "#casestudies": "casestudies", 
  "#practice": "practice",
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
    { id: "assessment", title: "Assessment", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "rules", title: "The 10 Rules", icon: <Target className="w-5 h-5" /> },
    { id: "science", title: "The Science", icon: <Brain className="w-5 h-5" /> },
    { id: "advanced", title: "Advanced Theory", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "casestudies", title: "Case Studies", icon: <Users className="w-5 h-5" /> },
    { id: "practice", title: "Practice Guide", icon: <CheckCircle className="w-5 h-5" /> },
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-3 glass-effect rounded-2xl px-6 py-3 mb-6 shadow-lg">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Frame Economics
            </h1>
          </div>
          <p className="text-xl text-slate-700 dark:text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Master the hidden psychology of influence through behavioral economics and frame control.
          </p>
          {completedRules.size > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-purple-200">
                {completionPercentage}% Complete ({completedRules.size}/{rules.length} rules mastered)
              </span>
            </div>
          )}
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8 md:mb-12 sticky top-2 z-20" aria-label="Primary">
          <div 
            role="tablist" 
            aria-orientation="horizontal"
            className="flex glass-effect rounded-2xl p-2 overflow-x-auto shadow-lg"
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
                    flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap 
                    transition-all duration-200 focus:outline-none focus:ring-2 
                    focus:ring-purple-400/60
                    ${selected 
                      ? "bg-purple-600 text-white shadow-lg transform scale-105" 
                      : "text-slate-700 dark:text-purple-200 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {section.icon}
                  {section.title}
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                The Intersection of Psychology and Power
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  Understand the hidden economics of behavior and keep your center when others try to destabilize it.
                </p>
                <p>
                  We respond to biases, anchors, losses, and context in predictable ways. 
                  Frame control is holding steady in those storms.
                </p>
                <div className="bg-violet-100 dark:bg-purple-900/50 rounded-2xl p-6 my-8 border-l-4 border-purple-500">
                  <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-3">
                    Core Principle
                  </h3>
                  <p className="text-purple-900 dark:text-purple-100 mb-0">
                    Masters don't fight for control—they become the stable center others orbit.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      What You'll Learn
                    </h4>
                    <ul className="space-y-2 text-blue-900 dark:text-blue-100">
                      <li>• 10 behavioral economics principles</li>
                      <li>• Frame control techniques</li>
                      <li>• Practical counter-strategies</li>
                      <li>• Real-world applications</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                      How It Works
                    </h4>
                    <ul className="space-y-2 text-green-900 dark:text-green-100">
                      <li>• Interactive rule exploration</li>
                      <li>• Progress tracking</li>
                      <li>• Print-friendly guides</li>
                      <li>• Practice exercises</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center space-x-4">
              <button
                onClick={() => setSectionAndHash("assessment")}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Take Assessment
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSectionAndHash("rules")}
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Browse Rules
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
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
                  <p className="text-lg text-slate-700 dark:text-purple-200 mb-6">
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
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    Behavioral Economics Foundations
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>System 1:</strong> Fast, automatic, emotional decision-making
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>System 2:</strong> Slow, deliberate, rational thinking
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
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Frame Control Psychology
                  </h3>
                  <ul className="space-y-3">
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
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                    Neuroscience Insights
                  </h3>
                  <ul className="space-y-3">
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
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
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
          <section 
            id="section-advanced" 
            aria-labelledby="tab-advanced" 
            className="max-w-5xl mx-auto animate-fade-in"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Advanced Theoretical Framework
              </h2>
              <p className="text-lg text-slate-700 dark:text-purple-200">
                Deep dive into game theory and cognitive load management.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="glass-effect rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Target className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  Game Theory Applications
                </h3>
                <div className="space-y-6">
                  <div className="rounded-xl p-6 bg-violet-50 dark:bg-purple-900/40">
                    <h4 className="font-bold mb-3 text-violet-800 dark:text-violet-200">
                      Nash Equilibrium in Social Dynamics
                    </h4>
                    <p className="mb-4 text-violet-900 dark:text-violet-100">
                      Equilibrium occurs when neither party can improve their outcome by changing strategy unilaterally. 
                      The person with the steadier frame often reaches equilibrium first.
                    </p>
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Example:</h5>
                      <p className="text-sm">
                        In a heated argument, if one person remains calm while the other escalates, 
                        the calm person's frame becomes the stable equilibrium that others eventually adopt.
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-6 bg-blue-50 dark:bg-blue-900/40">
                    <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-200">
                      Zero-Sum vs. Positive-Sum Frames
                    </h4>
                    <p className="text-blue-900 dark:text-blue-100">
                      Reframing competitions from zero-sum (winner takes all) to positive-sum 
                      (mutual benefit) often defuses tension and creates better outcomes for everyone.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-effect rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Brain className="w-7 h-7 text-green-600 dark:text-green-400" />
                  Cognitive Load Theory
                </h3>
                <div className="space-y-6">
                  <div className="rounded-xl p-6 bg-green-50 dark:bg-green-900/40">
                    <h4 className="font-bold mb-3 text-green-800 dark:text-green-200">
                      Working Memory Limitations
                    </h4>
                    <p className="mb-4 text-green-900 dark:text-green-100">
                      Working memory can only hold ~7±2 items simultaneously. Cognitive overload 
                      is a common attack vector in frame battles.
                    </p>
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Defense Strategy:</h5>
                      <p className="text-sm">
                        When overwhelmed by complexity, simplify the situation into a binary choice: 
                        "This either works for both of us, or it doesn't."
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-6 bg-amber-50 dark:bg-amber-900/40">
                    <h4 className="font-bold mb-3 text-amber-800 dark:text-amber-200">
                      Attention as a Finite Resource
                    </h4>
                    <p className="text-amber-900 dark:text-amber-100">
                      Directing attention strategically is key to frame control. 
                      What gets attention gets importance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                Advanced Frame Dynamics
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl p-6 bg-purple-50 dark:bg-purple-900/40">
                  <h4 className="font-bold mb-3 text-purple-800 dark:text-purple-200">
                    Meta-Frames
                  </h4>
                  <p className="text-purple-900 dark:text-purple-100">
                    Frames about frames. Acknowledging the frame battle itself: 
                    "I notice we're both trying to control how this conversation goes."
                  </p>
                </div>
                
                <div className="rounded-xl p-6 bg-indigo-50 dark:bg-indigo-900/40">
                  <h4 className="font-bold mb-3 text-indigo-800 dark:text-indigo-200">
                    Frame Stacking
                  </h4>
                  <p className="text-indigo-900 dark:text-indigo-100">
                    Layering multiple complementary frames to create robust positioning. 
                    Professional + Personal + Ethical frames working together.
                  </p>
                </div>
                
                <div className="rounded-xl p-6 bg-pink-50 dark:bg-pink-900/40">
                  <h4 className="font-bold mb-3 text-pink-800 dark:text-pink-200">
                    Frame Aikido
                  </h4>
                  <p className="text-pink-900 dark:text-pink-100">
                    Using the opponent's frame energy to redirect rather than resist. 
                    "You're right to be concerned about X, which is why Y makes sense."
                  </p>
                </div>
              </div>
            </div>
          </section>
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
              <p className="text-lg text-slate-700 dark:text-purple-200">
                Real-world applications and detailed breakdowns.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="glass-effect rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-green-700 dark:text-green-400" />
                  High-Stakes Business Negotiation
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h4 className="font-bold mb-3">Scenario</h4>
                    <p className="mb-4">
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
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Users className="w-7 h-7 text-blue-700 dark:text-blue-400" />
                  Team Leadership Challenge
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h4 className="font-bold mb-3">Scenario</h4>
                    <p className="mb-4">
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
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-purple-700 dark:text-purple-400" />
                  Personal Relationship Dynamics
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h4 className="font-bold mb-3">Scenario</h4>
                    <p className="mb-4">
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
            className="max-w-4xl mx-auto animate-fade-in"
          >
            <div className="glass-effect rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Practice Guide & Daily Exercises
                </h2>
                <p className="text-lg text-slate-700 dark:text-purple-200">
                  Turn knowledge into instinct through structured practice.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Daily Practice Routine
                  </h3>
                  <ol className="list-decimal pl-6 space-y-4 text-blue-900 dark:text-blue-100">
                    <li>
                      <strong>10-Second Pause:</strong> Before responding to any trigger, 
                      pause and scan for the underlying bias or frame being deployed.
                    </li>
                    <li>
                      <strong>Reframe Script:</strong> Practice saying: "We may be using different frames here. 
                      Let me share mine..." This acknowledges the frame battle without fighting it.
                    </li>
                    <li>
                      <strong>Silence Drill:</strong> Practice holding 3-5 seconds of composed quiet 
                      when others expect immediate reaction. Silence is powerful.
                    </li>
                    <li>
                      <strong>Boundary Statement:</strong> "That's not a standard I use. If we can align on X, I'm in. 
                      Otherwise, let's find a different approach."
                    </li>
                    <li>
                      <strong>Tempo Control:</strong> Declare your communication windows and stick to them. 
                      "I check messages at 9 AM and 4 PM" sets expectations.
                    </li>
                  </ol>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-green-800 dark:text-green-200">
                      Weekly Challenges
                    </h4>
                    <ul className="space-y-2 text-green-900 dark:text-green-100">
                      <li>• Identify one frame battle you're currently in</li>
                      <li>• Practice one counter-move from the 10 rules</li>
                      <li>• Notice when others try to control the emotional pace</li>
                      <li>• Experiment with reframing a recurring conflict</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6">
                    <h4 className="font-bold mb-3 text-purple-800 dark:text-purple-200">
                      Self-Assessment
                    </h4>
                    <ul className="space-y-2 text-purple-900 dark:text-purple-100">
                      <li>• How quickly do you recognize frame attacks?</li>
                      <li>• Can you stay calm under emotional pressure?</li>
                      <li>• Do you chase when others withdraw?</li>
                      <li>• Are you defending or leading conversations?</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    Scenario Training
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Email Pressure</h5>
                      <p className="text-sm mb-2">
                        <em>"I need this by end of day or we'll miss the deadline."</em>
                      </p>
                      <p className="text-sm">
                        <strong>Practice response:</strong> "I can deliver quality work by [realistic timeframe]. 
                        If that doesn't work for your timeline, let's discuss prioritization."
                      </p>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Social Comparison</h5>
                      <p className="text-sm mb-2">
                        <em>"Everyone else is already doing X. Why aren't you?"</em>
                      </p>
                      <p className="text-sm">
                        <strong>Practice response:</strong> "I make decisions based on what works for my situation. 
                        What works for others might not work for me."
                      </p>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Guilt Induction</h5>
                      <p className="text-sm mb-2">
                        <em>"I can't believe you forgot [important thing]. I'm so disappointed."</em>
                      </p>
                      <p className="text-sm">
                        <strong>Practice response:</strong> "I understand you're disappointed. 
                        Let's focus on how to address this moving forward."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-violet-100 dark:bg-purple-900/40 rounded-2xl p-6 border-l-4 border-purple-500">
                  <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
                    Master's Mindset
                  </h3>
                  <p className="text-purple-900 dark:text-purple-100 text-lg leading-relaxed">
                    Remember: You're not trying to "win" every interaction. You're building an unshakeable 
                    internal frame based on your values, standards, and long-term vision. 
                    The goal is authentic power, not manipulation.
                  </p>
                </div>
                
                <div className="flex justify-center gap-4 pt-6 no-print">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    <Printer className="w-5 h-5" />
                    Print Practice Guide
                  </button>
                  <a
                    href="#rules"
                    onClick={(e) => {
                      e.preventDefault();
                      setSectionAndHash("rules");
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    <BookOpen className="w-5 h-5" />
                    Review the Rules
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 md:mt-16 text-center">
          <div className="glass-effect rounded-2xl px-8 py-6 mb-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              <p className="text-lg font-medium text-slate-800 dark:text-purple-200">
                Build an unshakeable frame: calm, consistent, value-anchored.
              </p>
            </div>
            
            <div className="flex justify-center gap-4 mb-6 no-print">
              {completedRules.size < rules.length ? (
                <button
                  onClick={() => setSectionAndHash("rules")}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Continue Learning
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setSectionAndHash("practice")}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  <Target className="w-5 h-5" />
                  Master Your Practice
                </button>
              )}
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 glass-effect hover:bg-white/15 text-slate-700 dark:text-purple-200 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Save as PDF
              </button>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-purple-300/80">
            © {new Date().getFullYear()} Frame Economics • 
            Master the psychology of influence through behavioral economics
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FrameEconomicsWebsite;