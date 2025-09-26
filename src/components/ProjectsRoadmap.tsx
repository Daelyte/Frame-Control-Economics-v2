import React from 'react';
import { 
  Github, 
  Globe, 
  Rocket, 
  Target,
  Brain,
  Building2,
  Sparkles,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  Zap,
  Bot,
  Star,
  ArrowRight
} from 'lucide-react';

const ProjectsRoadmap: React.FC = () => {
  const currentProjects = [
    {
      title: "Frame Economics Platform",
      status: "Live & Active",
      description: "Advanced psychological resilience training platform combining behavioral economics with interactive learning experiences",
      features: [
        "10 Frame Control Rules based on behavioral psychology",
        "Interactive assessment & personalized recommendations", 
        "Real-time community with story sharing & discussions",
        "Scenario-based practice simulations",
        "Advanced authentication & security (Arcjet integration)",
        "PostgreSQL database with 7 specialized tables",
        "Modern React + TypeScript architecture"
      ],
      tech: ["React", "TypeScript", "Supabase", "PostgreSQL", "Netlify", "Tailwind CSS", "Arcjet Security"],
      metrics: {
        users: "Growing community",
        uptime: "99.9%",
        features: "Complete v3.0.0"
      },
      links: [
        { name: "Live Site", url: "https://icecoldfroste.com/", icon: <Globe className="w-4 h-4" /> },
        { name: "Backup Deploy", url: "https://frame-economics.netlify.app/", icon: <Globe className="w-4 h-4" /> }
      ],
      priority: "high",
      category: "AI-Assisted Development"
    },
    {
      title: "Tech Sales Career Development", 
      status: "In Progress",
      description: "Building expertise in enterprise software sales, client success, and technical solution positioning",
      features: [
        "Enterprise B2B sales methodology mastery",
        "Client success & post-sales account management",
        "Technical solution positioning for complex products", 
        "CRM optimization & sales process automation",
        "Cross-functional collaboration with technical teams",
        "Customer journey mapping & value realization"
      ],
      tech: ["Salesforce", "HubSpot", "Sales Methodologies", "Technical Solutions", "Client Relations"],
      metrics: {
        focus: "Enterprise SaaS",
        stage: "Building expertise", 
        timeline: "Career transition in progress"
      },
      priority: "high",
      category: "Career Development"
    },
    {
      title: "AI-Powered Workflow Optimization",
      status: "Ongoing",
      description: "Leveraging AI tools and terminal automation to maximize productivity and project delivery speed",
      features: [
        "AI-assisted development with Claude, GPT-4, and specialized tools",
        "Terminal workflow automation & PowerShell optimization",
        "Database management & deployment automation",
        "Code quality & security integration pipelines",
        "Documentation generation & maintenance automation"
      ],
      tech: ["AI Tools", "PowerShell", "Git", "CI/CD", "Database Management", "Security Tools"],
      metrics: {
        efficiency: "3x faster development",
        quality: "Higher code quality",
        maintenance: "Automated workflows"
      },
      priority: "medium", 
      category: "Productivity"
    }
  ];

  const upcomingProjects = [
    {
      title: "Sales Performance Analytics Dashboard",
      timeline: "Q1 2025",
      description: "AI-powered analytics platform for tracking and optimizing sales performance metrics",
      features: ["Real-time performance tracking", "Predictive analytics", "CRM integration", "Custom reporting"],
      impact: "High",
      category: "Sales Tech"
    },
    {
      title: "Frame Economics Mobile App", 
      timeline: "Q2 2025",
      description: "Native mobile experience for Frame Economics with offline practice modes",
      features: ["Native iOS/Android apps", "Offline practice scenarios", "Push notifications", "Progress sync"],
      impact: "High",
      category: "Product Expansion" 
    },
    {
      title: "Enterprise Client Success Platform",
      timeline: "Q2-Q3 2025", 
      description: "Comprehensive platform for managing enterprise client relationships and success metrics",
      features: ["Client health scoring", "Automated check-ins", "Success milestone tracking", "ROI reporting"],
      impact: "High",
      category: "Business Tools"
    },
    {
      title: "AI Sales Assistant Toolkit",
      timeline: "Q3 2025",
      description: "Suite of AI-powered tools for sales professionals including email optimization and lead scoring",
      features: ["Email optimization", "Lead scoring algorithms", "Conversation analysis", "Proposal generation"],
      impact: "Medium",
      category: "AI Tools"
    },
    {
      title: "Community-Driven Learning Network",
      timeline: "Q4 2025",
      description: "Expanded Frame Economics community with mentorship programs and peer learning circles", 
      features: ["Mentorship matching", "Study groups", "Live workshops", "Certification programs"],
      impact: "High",
      category: "Community"
    }
  ];

  const visionItems = [
    {
      title: "Bridge Technical & Business Worlds",
      description: "Become a trusted advisor helping enterprises navigate complex technical solutions while driving business value",
      icon: <Building2 className="w-6 h-6" />
    },
    {
      title: "AI-Human Collaboration Pioneer", 
      description: "Demonstrate how AI tools can amplify human creativity and productivity in sales, development, and experience design",
      icon: <Bot className="w-6 h-6" />
    },
    {
      title: "Psychology-Driven Product Design",
      description: "Create products that leverage behavioral economics to genuinely improve people's decision-making and resilience",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Experience Architecture Leadership",
      description: "Apply lessons from creating memorable events to designing exceptional customer and user experiences",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live & Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "Ongoing": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <Zap className="w-4 h-4 text-red-500" />;
      case "medium": return <Target className="w-4 h-4 text-yellow-500" />;
      case "low": return <Clock className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-red-600 dark:text-red-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";  
      case "Low": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
      {/* Hero Section - Mobile Optimized */}
      <div className="text-center glass-effect-mobile rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <h1 className="text-responsive-3xl font-bold text-slate-900 dark:text-white text-center">
            <span className="hidden xs:inline">Projects & Roadmap</span>
            <span className="xs:hidden">Projects</span>
          </h1>
        </div>
        
        <p className="text-responsive-lg text-slate-700 dark:text-slate-300 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed">
          <span className="hidden sm:inline">
            Building the future of sales technology, AI-human collaboration, and psychology-driven experiences
          </span>
          <span className="sm:hidden">
            Building sales tech, AI collaboration, and psychology-driven experiences
          </span>
        </p>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-lg sm:max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="hidden xs:inline">Active Projects</span>
              <span className="xs:hidden">Active</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="hidden xs:inline">Planned Initiatives</span>
              <span className="xs:hidden">Planned</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="hidden xs:inline">Future Possibilities</span>
              <span className="xs:hidden">Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Projects - Mobile Optimized */}
      <div className="glass-effect-mobile rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-responsive-2xl font-bold text-slate-900 dark:text-white">
              <span className="hidden xs:inline">Current Projects</span>
              <span className="xs:hidden">Current</span>
            </h2>
            <p className="text-responsive-sm text-slate-600 dark:text-slate-400">
              <span className="hidden sm:inline">Active development and ongoing initiatives</span>
              <span className="sm:hidden">Active development</span>
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {currentProjects.map((project) => (
            <div key={project.title} className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 section-card-mobile">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex-1">
                  {/* Mobile-optimized header */}
                  <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-3 mb-3 sm:mb-4">
                    <h3 className="text-responsive-lg font-bold text-slate-900 dark:text-white flex-1 min-w-0">
                      <span className="hidden sm:inline">{project.title}</span>
                      <span className="sm:hidden">{project.title.split(' ').slice(0, 2).join(' ')}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        <span className="hidden xs:inline">{project.status}</span>
                        <span className="xs:hidden">{project.status.split(' ')[0]}</span>
                      </span>
                      {getPriorityIcon(project.priority)}
                      <span className="px-1.5 sm:px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">
                        <span className="hidden sm:inline">{project.category}</span>
                        <span className="sm:hidden">{project.category.split(' ')[0]}</span>
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-responsive-sm text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 leading-relaxed">
                    <span className="hidden sm:inline">{project.description}</span>
                    <span className="sm:hidden">{project.description.substring(0, 120)}...</span>
                  </p>
                  
                  {/* Mobile-optimized features */}
                  <div className="mb-3 sm:mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-responsive-sm">Key Features:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {project.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-tight">
                            <span className="hidden sm:inline">{feature}</span>
                            <span className="sm:hidden">{feature.substring(0, 40)}...</span>
                          </span>
                        </li>
                      ))}
                      {project.features.length > 4 && (
                        <li className="flex items-center gap-1.5 sm:gap-2 text-purple-600 dark:text-purple-400">
                          <span className="text-xs">+{project.features.length - 4} more</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Mobile-optimized tech stack */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {project.tech.slice(0, 5).map((tech) => (
                      <span key={tech} className="px-1.5 sm:px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 5 && (
                      <span className="px-1.5 sm:px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 rounded-md text-xs font-medium">
                        +{project.tech.length - 5}
                      </span>
                    )}
                  </div>
                  
                  {/* Mobile-optimized metrics */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="bg-white dark:bg-slate-800 rounded-lg p-2 sm:p-3 border border-slate-200 dark:border-slate-600">
                        <div className="font-semibold text-slate-900 dark:text-white capitalize text-xs sm:text-sm">{key}</div>
                        <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-tight">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile-optimized links */}
                {project.links && (
                  <div className="flex flex-col xs:flex-row gap-2 mt-3 sm:mt-0">
                    {project.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 btn-touch px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 text-responsive-sm font-medium"
                      >
                        {link.icon}
                        <span className="hidden xs:inline">{link.name}</span>
                        <span className="xs:hidden">{link.name.split(' ')[0]}</span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Projects Roadmap - Mobile Optimized */}
      <div className="glass-effect-mobile rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-responsive-2xl font-bold text-slate-900 dark:text-white">
              <span className="hidden xs:inline">2025 Roadmap</span>
              <span className="xs:hidden">Roadmap</span>
            </h2>
            <p className="text-responsive-sm text-slate-600 dark:text-slate-400">
              <span className="hidden sm:inline">Planned initiatives and future development</span>
              <span className="sm:hidden">Planned initiatives</span>
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {upcomingProjects.map((project, index) => (
            <div key={project.title} className="relative">
              {/* Timeline connector - hidden on small screens */}
              {index < upcomingProjects.length - 1 && (
                <div className="hidden sm:block absolute left-4 sm:left-6 top-12 sm:top-16 w-0.5 h-12 sm:h-16 bg-gradient-to-b from-blue-400 to-purple-400"></div>
              )}
              
              <div className="flex gap-3 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 section-card-mobile">
                  <div className="flex flex-col gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-responsive-lg font-bold text-slate-900 dark:text-white mb-2">
                        <span className="hidden sm:inline">{project.title}</span>
                        <span className="sm:hidden">{project.title.split(' ').slice(0, 3).join(' ')}</span>
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium">
                          {project.timeline}
                        </span>
                        <span className="px-1.5 sm:px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                          <span className="hidden sm:inline">{project.category}</span>
                          <span className="sm:hidden">{project.category.split(' ')[0]}</span>
                        </span>
                        <div className={`text-xs sm:text-sm font-semibold ${getImpactColor(project.impact)}`}>
                          <span className="hidden xs:inline">{project.impact} Impact</span>
                          <span className="xs:hidden">{project.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-responsive-sm text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 leading-relaxed">
                    <span className="hidden sm:inline">{project.description}</span>
                    <span className="sm:hidden">{project.description.substring(0, 100)}...</span>
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-responsive-sm">Planned Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {project.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
                          <span className="leading-tight">
                            <span className="hidden sm:inline">{feature}</span>
                            <span className="sm:hidden">{feature.substring(0, 35)}...</span>
                          </span>
                        </div>
                      ))}
                      {project.features.length > 4 && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600 dark:text-purple-400">
                          <span className="text-xs">+{project.features.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Philosophy - Mobile Optimized */}
      <div className="glass-effect-mobile rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-700/50">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <h2 className="text-responsive-2xl font-bold text-slate-900 dark:text-white">
              <span className="hidden xs:inline">Long-term Vision</span>
              <span className="xs:hidden">Vision</span>
            </h2>
          </div>
          <p className="text-responsive-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            <span className="hidden sm:inline">
              Building bridges between technology, psychology, and human potential through innovative experiences and AI-human collaboration
            </span>
            <span className="sm:hidden">
              Building bridges between technology, psychology, and human potential through AI-human collaboration
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {visionItems.map((item) => (
            <div key={item.title} className="bg-white/60 dark:bg-slate-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200/50 dark:border-indigo-700/50 backdrop-blur-sm section-card-mobile">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white">
                    {item.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-responsive-lg font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                    <span className="hidden sm:inline">{item.title}</span>
                    <span className="sm:hidden">{item.title.split(' ').slice(0, 2).join(' ')}</span>
                  </h3>
                  <p className="text-responsive-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="hidden sm:inline">{item.description}</span>
                    <span className="sm:hidden">{item.description.substring(0, 120)}...</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action - Mobile Optimized */}
      <div className="text-center glass-effect-mobile rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 mb-3 sm:mb-4">
          <h3 className="text-responsive-xl font-bold text-slate-900 dark:text-white">
            <span className="hidden xs:inline">Want to Follow the Journey?</span>
            <span className="xs:hidden">Follow the Journey?</span>
          </h3>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 animate-bounce flex-shrink-0" />
        </div>
        
        <p className="text-responsive-base text-slate-700 dark:text-slate-300 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
          <span className="hidden sm:inline">
            These projects represent my commitment to bridging technical innovation with human psychology. 
            Follow along as we build the future of sales technology and AI-human collaboration.
          </span>
          <span className="sm:hidden">
            Follow along as we build the future of sales technology and AI-human collaboration.
          </span>
        </p>
        
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
          <a 
            href="https://github.com/Daelyte"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 sm:gap-3 btn-touch px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Github className="w-4 h-4 flex-shrink-0" />
            <span className="hidden xs:inline">Follow on GitHub</span>
            <span className="xs:hidden">GitHub</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="https://icecoldfroste.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 sm:gap-3 btn-touch px-4 sm:px-6 py-3 bg-transparent border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-slate-900 font-semibold rounded-lg sm:rounded-xl transition-all duration-300"
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span className="hidden xs:inline">Try Frame Economics</span>
            <span className="xs:hidden">Try It</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsRoadmap;