import React from 'react';
import { 
  Github, 
  Globe, 
  Briefcase, 
  Brain,
  ExternalLink,
  TrendingUp,
  Bot,
  Terminal,
  Sparkles,
  Rocket,
  ArrowRight
} from 'lucide-react';

interface AboutProps {
  onNavigateToProjects?: () => void;
}

const About: React.FC<AboutProps> = ({ onNavigateToProjects }) => {
  const skills = [
    { name: 'Sales Strategy & Client Relations', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'Tech Solutions Positioning', level: 90, color: 'from-purple-500 to-indigo-500' },
    { name: 'AI-Assisted Development', level: 80, color: 'from-green-500 to-emerald-500' },
    { name: 'Business Development', level: 85, color: 'from-orange-500 to-red-500' },
    { name: 'Experience Design & Events', level: 90, color: 'from-pink-500 to-rose-500' },
    { name: 'Terminal & Workflow Automation', level: 75, color: 'from-violet-500 to-purple-500' }
  ];

  const projects = [
    {
      title: 'Frame Economics Platform',
      description: 'Interactive learning platform teaching psychological resilience through behavioral economics (built with AI assistance)',
      tech: ['AI-Assisted Development', 'Supabase', 'Netlify', 'Community Features'],
      link: 'https://icecoldfroste.com/'
    },
    {
      title: 'Sales Career Development',
      description: 'Building expertise in tech sales, post-sales account management, and client success frameworks',
      tech: ['Business Development', 'Client Relations', 'Technical Solutions'],
      link: '#'
    },
    {
      title: 'Experience Design Portfolio',
      description: 'From Fortune 500 campaigns to underground events - creating memorable experiences across industries',
      tech: ['Event Production', 'Brand Activation', 'Community Building'],
      link: '#'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl text-center">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Profile Image */}
          <div className="w-24 h-24 md:w-28 md:h-28 shadow-2xl border-4 border-purple-500/30 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="vash-profile.png" 
              alt="Daelyte Profile - Vash the Stampede inspired" 
              className="profile-image w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.log('Image failed to load:', target.src);
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOTMzM0VBIiByeD0iNTAiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iMjAiIHk9IjIwIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAxYy0yLjY3IDAtOCAxLjM0LTggNHYzaDE2di0zYzAtMi42Ni01LjMzLTQtOC00eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo='; // Fallback avatar
              }}
            />
          </div>
          
          {/* Main Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              👋 Hi, I'm Daelyte
            </h2>
            
            <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
              Sales Professional • AI-Assisted Creator • Experience Architect
            </p>
            
            <p className="text-base md:text-lg italic text-slate-600 dark:text-slate-400 mb-4">
              "Whether it's closing deals in boardrooms or orchestrating warehouse raves—I make connections that matter"
            </p>
            
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Building my career in tech sales with focus on client success and systems integration. 
              I use AI as my development companion and bring unique experience from advertising, e-commerce, 
              tech, and nightlife to everything I create.
            </p>
          </div>
        </div>
        
        
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
          <a 
            href="https://github.com/Daelyte" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            GitHub
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          
          <a 
            href="https://icecoldfroste.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            Latest Project
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Skills Section */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl section-card">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
            Core Strengths
          </h3>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
            Sales expertise, AI-powered productivity, and experience design across diverse industries
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <div key={skill.name} className="group space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                  {skill.name}
                </span>
                <span className="text-xs md:text-sm font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                  {skill.level}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div 
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out shadow-sm group-hover:shadow-md`}
                  style={{ 
                    width: `${skill.level}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl section-card">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <Brain className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
            Background & Philosophy
          </h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-800 dark:text-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Currently Building Career in Tech Sales
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                  Tech Sales Focus
                </h4>
              </div>
              <p className="text-blue-900 dark:text-blue-100">
                Building expertise in tech sales, post-sales account management, and client success. 
                I help bridge complex technical solutions with real business value for clients.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                  AI-Powered Productivity
                </h4>
              </div>
              <p className="text-purple-900 dark:text-purple-100">
                I don't claim to be a traditional developer—instead, I leverage AI tools and terminal 
                workflows to create meaningful projects. It's about results, not just coding skills.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-200">
                  Experience Architecture
                </h4>
              </div>
              <p className="text-green-900 dark:text-green-100">
                From Fortune 500 campaigns to underground warehouse events, I specialize in creating 
                unforgettable experiences that connect with people on an emotional level.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <h4 className="text-xl font-semibold text-orange-800 dark:text-orange-200">
                  Learning Through Doing
                </h4>
              </div>
              <p className="text-orange-900 dark:text-orange-100">
                I learn by building. Cloud computing, cybersecurity, AI fundamentals—I'm constantly 
                exploring new technologies to bridge the gap between technical solutions and business success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Projects Overview */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl section-card">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <Rocket className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
            Current Projects & Vision
          </h3>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6">
            Building the future of sales technology, AI-human collaboration, and psychology-driven experiences
          </p>
          
          {/* Projects CTA */}
          <div className="bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">2025 Initiatives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Future Vision</div>
              </div>
            </div>
            
            <div className="text-center">
              {onNavigateToProjects && (
                <button
                  onClick={onNavigateToProjects}
                  className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Full Projects & Roadmap
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Detailed breakdown of current work, 2025 roadmap, and long-term vision
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Project Highlights */}
        <div className="grid gap-4">
          {projects.slice(0, 2).map((project, index) => (
            <div 
              key={project.title}
              className="group bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">
                      {project.title}
                    </h4>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                        Live
                      </span>
                    )}
                    {index === 1 && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 rounded-md text-xs font-medium">
                        +{project.tech.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                
                {project.link !== '#' && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 whitespace-nowrap text-sm font-medium"
                  >
                    View Live
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl section-card text-center bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Ready to Connect?
          </h3>
          <div className="animate-bounce">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          Whether you're interested in sales collaboration, tech partnerships, or just want to chat about 
          behavioral economics and AI-assisted productivity, let's connect.
        </p>
        
        <div className="bg-gradient-to-r from-slate-100 to-purple-50 dark:from-slate-800/50 dark:to-purple-900/30 rounded-2xl p-5 mb-6 max-w-xl mx-auto border border-purple-200/30 dark:border-purple-700/30">
          <p className="text-slate-700 dark:text-slate-300 italic text-base md:text-lg mb-2 font-medium">
            "I don't write code—I orchestrate experiences."
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Whether guiding clients through technical decisions or turning empty warehouses into unforgettable nights, 
            AI helps me build and people skills help me succeed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="https://github.com/Daelyte"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Github className="w-4 h-4" />
            GitHub Profile
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="https://icecoldfroste.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-transparent border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-slate-900 font-semibold rounded-xl transition-all duration-300"
          >
            <Globe className="w-4 h-4" />
            Latest Project
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;