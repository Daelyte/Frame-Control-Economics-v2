import React, { useState, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  UserPlus,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  Target,
  GraduationCap,
  Clock,
  Star,
  Search
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  expertise: string[];
  interests: string[];
  status: 'online' | 'away' | 'offline';
  matchPercentage: number;
  bio: string;
  completedRules: number;
  mentorAvailable: boolean;
  seekingMentor: boolean;
  languages: string[];
  timeZone: string;
  joinDate: string;
}

interface NetworkingEvent {
  id: string;
  title: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  date: string;
  time: string;
  duration: string;
  attendees: number;
  maxAttendees: number;
  description: string;
  host: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  topics: string[];
  location?: string;
  meetingLink?: string;
}

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  maxMembers: number;
  schedule: string;
  description: string;
  nextMeeting: string;
  difficulty: string;
  languages: string[];
  isPrivate: boolean;
}

const Connect: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'find-peers' | 'events' | 'study-groups' | 'mentorship'>('find-peers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterExpertise, setFilterExpertise] = useState('all');

  // Mock data for demonstration
  const users: UserProfile[] = useMemo(() => [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior Product Manager',
      location: 'San Francisco, CA',
      avatar: '👩‍💼',
      expertise: ['Negotiation', 'Leadership', 'Team Dynamics'],
      interests: ['Public Speaking', 'Conflict Resolution'],
      status: 'online',
      matchPercentage: 92,
      bio: 'Passionate about applying frame control in tech leadership. 5 years experience in high-stakes negotiations.',
      completedRules: 10,
      mentorAvailable: true,
      seekingMentor: false,
      languages: ['English', 'Mandarin'],
      timeZone: 'PST',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      title: 'Sales Director',
      location: 'New York, NY',
      avatar: '👨‍💼',
      expertise: ['Sales Psychology', 'Client Relations', 'Influence'],
      interests: ['Business Development', 'Relationship Building'],
      status: 'away',
      matchPercentage: 87,
      bio: 'Frame Economics transformed my sales approach. Love helping others master these principles.',
      completedRules: 9,
      mentorAvailable: true,
      seekingMentor: false,
      languages: ['English', 'Spanish'],
      timeZone: 'EST',
      joinDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'Dr. Anisha Patel',
      title: 'Clinical Psychologist',
      location: 'London, UK',
      avatar: '👩‍⚕️',
      expertise: ['Behavioral Psychology', 'Therapy', 'Research'],
      interests: ['Applied Psychology', 'Human Behavior'],
      status: 'online',
      matchPercentage: 95,
      bio: 'Researching the intersection of frame control and therapeutic interventions. Always eager to discuss the science.',
      completedRules: 10,
      mentorAvailable: true,
      seekingMentor: false,
      languages: ['English', 'Hindi', 'French'],
      timeZone: 'GMT',
      joinDate: '2024-01-10'
    },
    {
      id: '4',
      name: 'Jake Thompson',
      title: 'Marketing Coordinator',
      location: 'Austin, TX',
      avatar: '👨‍💻',
      expertise: ['Digital Marketing', 'Content Strategy'],
      interests: ['Personal Development', 'Frame Control'],
      status: 'online',
      matchPercentage: 78,
      bio: 'New to frame economics but eager to learn and practice with others. Looking for accountability partners.',
      completedRules: 6,
      mentorAvailable: false,
      seekingMentor: true,
      languages: ['English'],
      timeZone: 'CST',
      joinDate: '2024-08-15'
    }
  ], []);

  const events: NetworkingEvent[] = useMemo(() => [
    {
      id: '1',
      title: 'Frame Control in High-Pressure Negotiations',
      type: 'virtual',
      date: '2025-10-02',
      time: '2:00 PM EST',
      duration: '90 minutes',
      attendees: 45,
      maxAttendees: 100,
      description: 'Interactive workshop focusing on maintaining composure during intense negotiations. Real case studies and practice scenarios included.',
      host: 'Sarah Chen',
      level: 'intermediate',
      topics: ['Negotiation', 'Pressure Management', 'Business Applications'],
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      id: '2',
      title: 'Frame Economics Study Group - Weekly Meetup',
      type: 'hybrid',
      date: '2025-10-05',
      time: '7:00 PM PST',
      duration: '60 minutes',
      attendees: 12,
      maxAttendees: 20,
      description: 'Weekly discussion group covering one rule per session. This week: Rule 3 - Silence Games.',
      host: 'Marcus Rodriguez',
      level: 'all',
      topics: ['Rule Discussion', 'Peer Learning', 'Practice Scenarios'],
      location: 'Coffee Shop Downtown + Virtual',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '3',
      title: 'Behavioral Economics & Frame Control Research Forum',
      type: 'virtual',
      date: '2025-10-10',
      time: '11:00 AM GMT',
      duration: '2 hours',
      attendees: 78,
      maxAttendees: 150,
      description: 'Academic discussion of latest research in behavioral economics as it applies to frame control. Guest speakers from leading universities.',
      host: 'Dr. Anisha Patel',
      level: 'advanced',
      topics: ['Research', 'Academic Discussion', 'Behavioral Science']
    }
  ], []);

  const studyGroups: StudyGroup[] = useMemo(() => [
    {
      id: '1',
      name: 'Frame Masters Circle',
      topic: 'Advanced Frame Control Techniques',
      members: 8,
      maxMembers: 12,
      schedule: 'Weekly - Thursdays 8 PM EST',
      description: 'Experienced practitioners sharing advanced techniques and real-world applications.',
      nextMeeting: '2025-10-03',
      difficulty: 'Advanced',
      languages: ['English'],
      isPrivate: false
    },
    {
      id: '2',
      name: 'Beginners Accountability Group',
      topic: 'Learning the Fundamentals',
      members: 15,
      maxMembers: 20,
      schedule: 'Bi-weekly - Sundays 3 PM PST',
      description: 'Supportive environment for new learners to practice and discuss challenges.',
      nextMeeting: '2025-10-06',
      difficulty: 'Beginner',
      languages: ['English', 'Spanish'],
      isPrivate: false
    },
    {
      id: '3',
      name: 'Business Applications Focus Group',
      topic: 'Professional Frame Control',
      members: 6,
      maxMembers: 10,
      schedule: 'Weekly - Tuesdays 12 PM EST',
      description: 'Focus on applying frame economics principles in business and professional settings.',
      nextMeeting: '2025-10-01',
      difficulty: 'Intermediate',
      languages: ['English'],
      isPrivate: true
    }
  ], []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = filterLocation === 'all' || 
        user.location.toLowerCase().includes(filterLocation.toLowerCase());
      
      const matchesExpertise = filterExpertise === 'all' || 
        user.expertise.some(skill => skill.toLowerCase().includes(filterExpertise.toLowerCase()));
      
      return matchesSearch && matchesLocation && matchesExpertise;
    });
  }, [users, searchQuery, filterLocation, filterExpertise]);

  const getStatusColor = (status: UserProfile['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const tabs = [
    { id: 'find-peers' as const, label: 'Find Peers', icon: <Users className="w-5 h-5" /> },
    { id: 'events' as const, label: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'study-groups' as const, label: 'Study Groups', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'mentorship' as const, label: 'Mentorship', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Connect with Fellow Learners
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Build relationships, find mentors, and grow together in your Frame Economics journey.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="glass-effect rounded-2xl p-2 inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Find Peers Tab */}
      {activeTab === 'find-peers' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, expertise, or interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder-slate-500"
                />
              </div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              >
                <option value="all">All Locations</option>
                <option value="san francisco">San Francisco</option>
                <option value="new york">New York</option>
                <option value="london">London</option>
                <option value="austin">Austin</option>
              </select>
              <select
                value={filterExpertise}
                onChange={(e) => setFilterExpertise(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              >
                <option value="all">All Expertise</option>
                <option value="negotiation">Negotiation</option>
                <option value="leadership">Leadership</option>
                <option value="sales">Sales</option>
                <option value="psychology">Psychology</option>
              </select>
            </div>
          </div>

          {/* User Profiles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(user.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{user.matchPercentage}%</div>
                    <div className="text-xs text-slate-500">match</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{user.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {user.expertise.slice(0, 2).map((skill, idx) => (
                    <span key={idx} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs">
                      {skill}
                    </span>
                  ))}
                  {user.expertise.length > 2 && (
                    <span className="text-xs text-slate-500">+{user.expertise.length - 2} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600 dark:text-slate-400">{user.completedRules}/10 rules</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {user.mentorAvailable && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs">Mentor</span>
                    )}
                    {user.seekingMentor && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">Seeking Mentor</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Message
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event.id} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                      <span className={`
                        px-2 py-1 rounded-lg text-xs font-medium
                        ${event.type === 'virtual' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                          event.type === 'in-person' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                          'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}
                      `}>
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-3">{event.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Hosted by:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{event.host}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                      Join Event
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                      Add to Calendar
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.topics.map((topic, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'study-groups' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <div key={group.id} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{group.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{group.topic}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${group.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                          group.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}
                      `}>
                        {group.difficulty}
                      </span>
                      {group.isPrivate && (
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{group.members}/{group.maxMembers}</div>
                    <div className="text-xs text-slate-500">members</div>
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{group.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    {group.schedule}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Next: {group.nextMeeting}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Globe className="w-4 h-4" />
                    {group.languages.join(', ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    {group.isPrivate ? 'Request to Join' : 'Join Group'}
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Create Your Own Study Group
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Start a group focused on your specific interests or learning goals.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
              <UserPlus className="w-5 h-5 inline mr-2" />
              Create Study Group
            </button>
          </div>
        </div>
      )}

      {/* Mentorship Tab */}
      {activeTab === 'mentorship' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Find a Mentor</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Connect with experienced practitioners who can guide your Frame Economics journey.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
                Browse Mentors
              </button>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Become a Mentor</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Share your expertise and help others master frame control principles.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
                Become a Mentor
              </button>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Available Mentors</h3>
            <div className="space-y-4">
              {users.filter(user => user.mentorAvailable).map((mentor) => (
                <div key={mentor.id} className="bg-white/30 dark:bg-black/20 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                      {mentor.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{mentor.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{mentor.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {mentor.completedRules}/10 rules mastered
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Request Mentorship
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connect;