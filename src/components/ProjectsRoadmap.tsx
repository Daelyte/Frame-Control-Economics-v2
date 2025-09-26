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
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center glass-effect rounded-3xl p-8 shadow-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Rocket className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Projects & Roadmap
          </h1>
        </div>
        
        <p className="text-xl text-slate-700 dark:text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed">
          Building the future of sales technology, AI-human collaboration, and psychology-driven experiences
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Planned Initiatives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Future Possibilities</div>
          </div>
        </div>
      </div>

      {/* Current Projects */}
      <div className="glass-effect rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Current Projects</h2>
            <p className="text-slate-600 dark:text-slate-400">Active development and ongoing initiatives</p>
          </div>
        </div>

        <div className="space-y-6">
          {currentProjects.map((project) => (
            <div key={project.title} className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    {getPriorityIcon(project.priority)}
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Key Features:</h4>
                    <ul className="grid md:grid-cols-2 gap-1 text-sm text-slate-600 dark:text-slate-400">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <div className="font-semibold text-slate-900 dark:text-white capitalize">{key}</div>
                        <div className="text-slate-600 dark:text-slate-400">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {project.links && (
                  <div className="flex flex-col gap-2">
                    {project.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 whitespace-nowrap text-sm font-medium"
                      >
                        {link.icon}
                        {link.name}
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

      {/* Upcoming Projects Roadmap */}
      <div className="glass-effect rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">2025 Roadmap</h2>
            <p className="text-slate-600 dark:text-slate-400">Planned initiatives and future development</p>
          </div>
        </div>

        <div className="grid gap-6">
          {upcomingProjects.map((project, index) => (
            <div key={project.title} className="relative">
              {/* Timeline connector */}
              {index < upcomingProjects.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-purple-400"></div>
              )}
              
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          {project.timeline}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${getImpactColor(project.impact)}`}>
                      {project.impact} Impact
                    </div>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Planned Features:</h4>
                    <div className="grid md:grid-cols-2 gap-1">
                      {project.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Philosophy */}
      <div className="glass-effect rounded-3xl p-8 shadow-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-700/50">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Long-term Vision</h2>
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Building bridges between technology, psychology, and human potential through innovative experiences and AI-human collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {visionItems.map((item) => (
            <div key={item.title} className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-700/50 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center glass-effect rounded-3xl p-8 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Want to Follow the Journey?</h3>
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-bounce" />
        </div>
        
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          These projects represent my commitment to bridging technical innovation with human psychology. 
          Follow along as we build the future of sales technology and AI-human collaboration.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://github.com/Daelyte"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Github className="w-4 h-4" />
            Follow on GitHub
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="https://icecoldfroste.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-transparent border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-slate-900 font-semibold rounded-xl transition-all duration-300"
          >
            <Globe className="w-4 h-4" />
            Try Frame Economics
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsRoadmap;