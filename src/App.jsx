import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [incidents, setIncidents] = useState([
    { 
      id: 1, 
      title: "Biased Recommendation Algorithm", 
      description: "Algorithm consistently favored certain demographics in job recommendations, creating an unfair advantage for some user groups while disadvantaging others.", 
      severity: "Medium", 
      reported_at: "2025-03-15T10:00:00Z",
      status: "Investigating",
      assignee: "Emma Thompson"
    },
    { 
      id: 2, 
      title: "LLM Hallucination in Critical Info", 
      description: "Large language model provided incorrect safety procedure information when queried about emergency protocols, potentially endangering users in critical situations.", 
      severity: "High", 
      reported_at: "2025-04-02T14:30:00Z",
      status: "Open",
      assignee: "Alex Chen"
    },
    { 
      id: 3, 
      title: "Minor Data Leak via Chatbot", 
      description: "Chatbot inadvertently exposed non-sensitive user metadata through its debugging logs, creating a minor privacy concern that was quickly addressed.", 
      severity: "Low", 
      reported_at: "2025-03-20T09:15:00Z",
      status: "Resolved",
      assignee: "Jordan Lee"
    }
  ]);
  
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedIncidentId, setExpandedIncidentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "Low",
    status: "Open",
    assignee: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setInitialLoadDone(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle notification display
  const displayNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Filter incidents by severity and status
  const filteredIncidents = incidents.filter(incident => {
    const matchesSeverity = filter === "All" || incident.severity === filter;
    const matchesStatus = statusFilter === "All" || incident.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // Sort incidents by date
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const dateA = new Date(a.reported_at);
    const dateB = new Date(b.reported_at);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Handle incident expansion
  const toggleIncidentExpansion = (id) => {
    setExpandedIncidentId(expandedIncidentId === id ? null : id);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncident({
      ...newIncident,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!newIncident.title.trim()) errors.title = "Title is required";
    if (!newIncident.description.trim()) errors.description = "Description is required";
    if (!newIncident.assignee.trim()) errors.assignee = "Assignee is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Add new incident
    const currentDate = new Date().toISOString();
    const newId = incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1;
    
    setIncidents([
      ...incidents,
      {
        id: newId,
        ...newIncident,
        reported_at: currentDate
      }
    ]);
    
    // Reset form
    setNewIncident({
      title: "",
      description: "",
      severity: "Low",
      status: "Open",
      assignee: ""
    });
    setFormErrors({});
    setShowForm(false);
    setActiveTab("list");
    displayNotification("New incident reported successfully!");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get severity badge style
  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'Low':
        return {
          badge: "bg-gradient-to-r from-green-400 to-green-500 text-white",
          text: "text-green-600",
          border: "border-green-200",
          bg: "bg-green-50",
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      case 'Medium':
        return {
          badge: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
          text: "text-yellow-600",
          border: "border-yellow-200",
          bg: "bg-yellow-50",
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          )
        };
      case 'High':
        return {
          badge: "bg-gradient-to-r from-red-400 to-red-500 text-white",
          text: "text-red-600",
          border: "border-red-200",
          bg: "bg-red-50",
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800",
          text: "text-gray-600",
          border: "border-gray-200",
          bg: "bg-gray-50",
          icon: null
        };
    }
  };

  // Get status style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Open':
        return {
          class: "status-indicator warning",
          bg: "bg-yellow-100",
          text: "text-yellow-800"
        };
      case 'Investigating':
        return {
          class: "status-indicator",
          bg: "bg-blue-100",
          text: "text-blue-800"
        };
      case 'Resolved':
        return {
          class: "status-indicator success",
          bg: "bg-green-100",
          text: "text-green-800"
        };
      default:
        return {
          class: "status-indicator",
          bg: "bg-gray-100",
          text: "text-gray-800"
        };
    }
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      setIsFullScreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(
        !!document.fullscreenElement || 
        !!document.mozFullScreenElement || 
        !!document.webkitFullscreenElement || 
        !!document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Apply dark mode class to document body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Calculate statistics
  const calculateStatistics = () => {
    const totalIncidents = incidents.length;
    const highSeverity = incidents.filter(i => i.severity === "High").length;
    const resolved = incidents.filter(i => i.status === "Resolved").length;
    const open = incidents.filter(i => i.status === "Open").length;
    const investigating = incidents.filter(i => i.status === "Investigating").length;

    return {
      totalIncidents,
      highSeverity,
      resolved,
      open,
      investigating,
      resolutionRate: totalIncidents > 0 ? Math.round((resolved / totalIncidents) * 100) : 0
    };
  };

  const stats = calculateStatistics();
  
  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'} dashboard-pattern`}>
      {showNotification && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in-out z-50 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {notificationMessage}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className={`text-center md:text-left ${initialLoadDone ? 'animate-fade-in' : ''}`}>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              AI Safety Incident Dashboard
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor and manage potential AI safety incidents
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} transition-all duration-300 shadow-md transform hover:scale-105 btn-3d`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <>
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </header>
        
        {showStatistics && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 staggered-fade-in ${initialLoadDone ? 'animate-fade-in' : ''}`}>
            <div className={`${darkMode ? 'bg-gray-800 glass-effect_dark' : 'bg-white glass-effect'} rounded-xl shadow-sm p-5  feature-card`}>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Incidents</h3>
                  <p className="text-2xl font-bold">{stats.totalIncidents}</p>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800 glass-effect_dark' : 'bg-white glass-effect'} rounded-xl shadow-sm p-5  feature-card`}>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-400 to-red-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">High Severity</h3>
                  <p className="text-2xl font-bold">{stats.highSeverity}</p>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800 glass-effect_dark' : 'bg-white glass-effect'} rounded-xl shadow-sm p-5  feature-card`}>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
                  <p className="text-2xl font-bold">{stats.open + stats.investigating}</p>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800 glass-effect_dark' : 'bg-white glass-effect'} rounded-xl shadow-sm p-5  feature-card`}>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-400 to-green-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolution Rate</h3>
                  <p className="text-2xl font-bold">{stats.resolutionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-xl overflow-hidden border backdrop-blur-sm bg-opacity-80 transition-all duration-300 hover:shadow-2xl ${initialLoadDone ? 'animate-slide-up' : ''}`}>
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-6 py-4 font-medium cursor-pointer text-sm ${activeTab === 'list' ? '!text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'} ${darkMode ? 'hover:text-white text-white' : 'hover:text-gray-800'}`}
              onClick={() => setActiveTab('list')}
            >
              Incident List
            </button>
            <button 
              className={`px-6 py-4 font-medium cursor-pointer text-sm ${activeTab === 'report' ? '!text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'} ${darkMode ? 'hover:text-white text-white' : 'hover:text-gray-800'}`}
              onClick={() => {
                setActiveTab('report');
                setShowForm(true);
              }}
            >
              Report Incident
            </button>
            <button 
              className={`px-6 py-4 font-medium cursor-pointer text-sm ${activeTab === 'stats' ? '!text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'} ${darkMode ? 'hover:text-white text-white' : 'hover:text-gray-800'}`}
              onClick={() => {
                setActiveTab('stats');
                setShowStatistics(true);
              }}
            >
              Analytics
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'list' ? (
              <>
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search incidents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="relative">
                        <select
                          id="severityFilter"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className={`appearance-none border rounded-lg pl-4 pr-10 py-2.5 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                        >
                          <option value="All">All Severities</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <svg className={`fill-current h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <select
                          id="statusFilter"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className={`appearance-none border rounded-lg pl-4 pr-10 py-2.5 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                        >
                          <option value="All">All Statuses</option>
                          <option value="Open">Open</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <svg className={`fill-current h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <select
                          id="sortOrder"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className={`appearance-none border rounded-lg pl-4 pr-10 py-2.5 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <svg className={`fill-current h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setActiveTab('report');
                          setShowForm(true);
                        }}
                        className="bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 btn-3d flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Report New
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Reported Incidents</h2>
                    <span className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded-full text-sm font-medium`}>
                      {sortedIncidents.length} {sortedIncidents.length === 1 ? 'incident' : 'incidents'}
                    </span>
                  </div>
                  
                  {sortedIncidents.length === 0 ? (
                    <div className={`text-center py-16 rounded-lg border border-dashed ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
                      <svg className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      </svg>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>No incidents match your filter criteria</p>
                      <button 
                        onClick={() => {
                          setFilter("All");
                          setStatusFilter("All");
                          setSearchTerm("");
                        }}
                        className="mt-4 text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 staggered-fade-in">
                      {sortedIncidents.map((incident) => {
                        const severityStyle = getSeverityStyle(incident.severity);
                        const statusStyle = getStatusStyle(incident.status);
                        return (
                          <div 
                            key={incident.id} 
                            className={`border ${darkMode ? 'border-gray-700' : severityStyle.border} rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01] card-hover-effect`}
                          >
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-5`}>
                              <div className="flex flex-col sm:flex-row justify-between">
                                <div className="flex-grow">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${severityStyle.badge}`}>
                                      {incident.severity}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                      {incident.status}
                                    </span>
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                                      {severityStyle.icon}
                                      {formatDate(incident.reported_at)}
                                    </span>
                                  </div>
                                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{incident.title}</h3>
                                  
                                  <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-medium">Assignee:</span> {incident.assignee}
                                  </div>
                                </div>
                                <div className="mt-3 sm:mt-0 flex items-start">
                                  <button
                                    onClick={() => toggleIncidentExpansion(incident.id)}
                                    className={`text-sm cursor-pointer ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium flex items-center gap-1 transition-all duration-200`}
                                  >
                                    {expandedIncidentId === incident.id ? (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                        </svg>
                                        Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                        View Details
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {expandedIncidentId === incident.id && (
                              <div className={`px-5 py-4 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : `${severityStyle.bg} border-t ${severityStyle.border}`} animate-fade-in`}>
                                <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Description</h4>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{incident.description}</p>
                                
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <div className="flex flex-wrap gap-4">
                                    <div>
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} block mb-1`}>Incident ID</span>
                                      <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>#{incident.id.toString().padStart(4, '0')}</span>
                                    </div>
                                    <div>
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} block mb-1`}>Status</span>
                                      <span className={`text-sm ${statusStyle.class}`}>{incident.status}</span>
                                    </div>
                                    <div>
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} block mb-1`}>Reported</span>
                                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(incident.reported_at)}</span>
                                    </div>
                                    <div>
                                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} block mb-1`}>Assigned To</span>
                                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{incident.assignee}</span>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex justify-end">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                      View Full Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'report' ? (
              <div className="max-w-2xl mx-auto animate-fade-in">
                <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Report New Incident</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Incident Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newIncident.title}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.title ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg px-4 py-3 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm`}
                      placeholder="Provide a clear, descriptive title"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newIncident.description}
                      onChange={handleInputChange}
                      rows="5"
                      className={`w-full border ${formErrors.description ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg px-4 py-3 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm`}
                      placeholder="Describe the incident in detail including context, impact, and any immediate actions taken"
                    ></textarea>
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="assignee" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Assignee</label>
                    <input
                      type="text"
                      id="assignee"
                      name="assignee"
                      value={newIncident.assignee}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.assignee ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg px-4 py-3 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm`}
                      placeholder="Name of person responsible for this incident"
                    />
                    {formErrors.assignee && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {formErrors.assignee}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <fieldset>
                        <legend className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Severity Level</legend>
                        <div className="grid grid-cols-3 gap-4">
                          {['Low', 'Medium', 'High'].map((level) => {
                            const severityStyle = getSeverityStyle(level);
                            return (
                              <label 
                                key={level} 
                                className={`relative flex items-center justify-center p-4 rounded-lg border ${darkMode ? 'border-gray-700' : newIncident.severity === level ? severityStyle.border + ' ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'} cursor-pointer transition-all duration-200 hover:border-gray-300 ${darkMode ? 'bg-gray-800' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name="severity"
                                  value={level}
                                  checked={newIncident.severity === level}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div className="text-center">
                                  <span className={`block text-sm font-semibold mb-1 ${severityStyle.text}`}>
                                    {level}
                                  </span>
                                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {level === 'Low' ? 'Minor impact' : 
                                     level === 'Medium' ? 'Significant impact' : 
                                     'Critical impact'}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                    
                    <div>
                      <fieldset>
                        <legend className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Status</legend>
                        <div className="grid grid-cols-3 gap-4">
                          {['Open', 'Investigating', 'Resolved'].map((status) => {
                            const currentStyle = getStatusStyle(status);
                            return (
                              <label 
                                key={status} 
                                className={`relative flex items-center justify-center p-4 rounded-lg border ${darkMode ? 'border-gray-700' : newIncident.status === status ? 'border-blue-200 ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'} cursor-pointer transition-all duration-200 hover:border-gray-300 ${darkMode ? 'bg-gray-800' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name="status"
                                  value={status}
                                  checked={newIncident.status === status}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div className="text-center">
                                  <span className={`block text-sm font-semibold mb-1 ${currentStyle.text}`}>
                                    {status}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('list');
                        setShowForm(false);
                      }}
                      className={`px-5 py-2.5 border cursor-pointer ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 btn-3d"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>AI Safety Incident Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Incident Status Distribution</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Open</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stats.open}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${stats.open * 100 / stats.totalIncidents}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Investigating</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stats.investigating}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${stats.investigating * 100 / stats.totalIncidents}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Resolved</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stats.resolved}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ 
                            width: `${stats.resolved * 100 / stats.totalIncidents}%` 
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Severity Breakdown</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Low</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {incidents.filter(i => i.severity === "Low").length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ 
                            width: `${incidents.filter(i => i.severity === "Low").length * 100 / stats.totalIncidents}%` 
                          }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medium</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {incidents.filter(i => i.severity === "Medium").length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ 
                            width: `${incidents.filter(i => i.severity === "Medium").length * 100 / stats.totalIncidents}%` 
                          }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>High</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {stats.highSeverity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ 
                            width: `${stats.highSeverity * 100 / stats.totalIncidents}%` 
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Overall Metrics</h3>
                    <div className="space-y-5">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-blue-50'}`}>
                          <svg className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Average Response Time</p>
                          <p className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-green-50'}`}>
                          <svg className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Resolution Rate</p>
                          <p className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{stats.resolutionRate}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-red-50'}`}>
                          <svg className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Critical Incidents</p>
                          <p className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{stats.highSeverity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`mt-8 ${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Recent Activity</h3>
                  <div className="space-y-4">
                    {[...incidents]
                      .sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at))
                      .slice(0, 3)
                      .map((incident, index) => {
                      const severity = getSeverityStyle(incident.severity);
                      return (
                        <div key={index} className={`flex items-start p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${severity.badge} mr-3 flex-shrink-0`}>
                            {severity.icon || (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{incident.title}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {incident.status} • {formatDate(incident.reported_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>Made with ❤️ by Kiran Choudhary</p>
        </footer>
      </div>
    </div>
  )
}

export default App
