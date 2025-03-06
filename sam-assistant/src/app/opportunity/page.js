// pages/opportunity.js
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { ArrowRight, Clipboard, Send, Download, Robot, X, Loader2 } from 'lucide-react';

export default function OpportunityPage() {
  // State management
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState(null);
  const [opportunityData, setOpportunityData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSelection, setShowSelection] = useState(true);
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Mock function to fetch opportunity data
  const fetchOpportunityData = async (url) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to your backend
    // that would scrape and process the SAM.gov data
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data
      const data = {
        title: "Cloud Migration Services for Department of Defense",
        agency: "Department of Defense",
        solicitationNumber: "DOD-2025-CMS-001",
        responseDate: "April 15, 2025",
        description: "This opportunity seeks cloud migration services to transition legacy systems to a secure cloud environment with FedRAMP High certification.",
        requirements: [
          "Experience with FedRAMP High compliance",
          "Minimum 5 years of DoD cloud migration experience",
          "Security clearance requirements for key personnel",
          "Agile methodology implementation"
        ]
      };
      
      setOpportunityData(data);
      setShowSelection(false);
      
      // Add welcome message from system
      setMessages([
        {
          role: 'system',
          content: `Successfully extracted opportunity data for "${data.title}". Please select an AI assistant to begin working on this opportunity.`
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching opportunity data:', error);
      setMessages([
        {
          role: 'system',
          content: 'Error extracting opportunity data. Please check the URL and try again.'
        }
      ]);
    }
    
    setIsLoading(false);
  };
  
  // Select an assistant
  const selectAssistant = (assistant) => {
    setActiveAssistant(assistant);
    
    // Add welcome message from the selected assistant
    const welcomeMessages = {
      'rfi': "I'm the RFI Assistant. I'll help you draft detailed responses to this Request for Information. What specific questions or requirements would you like to address first?",
      'solution': "I'm the Solution Brief Assistant. I'll help you create a technical overview that highlights your capabilities. Let's start by discussing your company's strengths related to this opportunity.",
      'proposal': "I'm the Proposal Assistant. I'll help you develop a comprehensive proposal response. Let's begin by outlining the key requirements and your approach to meeting them."
    };
    
    setMessages([
      ...messages,
      {
        role: 'assistant',
        content: welcomeMessages[assistant]
      }
    ]);
  };
  
  // Send a message to the assistant
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: inputMessage
      }
    ];
    
    setMessages(newMessages);
    setInputMessage('');
    
    // Simulate assistant response
    simulateAssistantResponse(inputMessage);
  };
  
  // Mock function to simulate AI assistant response
  const simulateAssistantResponse = (userMessage) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to your AI service
    setTimeout(() => {
      let response = "";
      
      // Generate different responses based on the active assistant and user input
      if (activeAssistant === 'rfi') {
        response = "Based on the RFI requirements, I've drafted the following response that addresses their questions about cloud migration experience:\n\n" +
          "Our organization has successfully completed 15+ DoD cloud migrations over the past 8 years, including projects with similar scope to this opportunity. All migrations were completed on schedule and within budget, with zero security incidents during transition periods.";
      } else if (activeAssistant === 'solution') {
        response = "Here's a technical solution approach that emphasizes your strengths:\n\n" +
          "Our phased migration methodology minimizes disruption while ensuring continuous operation. Phase 1 includes comprehensive assessment and planning, Phase 2 covers data migration with parallel systems, and Phase 3 implements final cutover with performance validation.";
      } else if (activeAssistant === 'proposal') {
        response = "I've analyzed the requirements and prepared the following proposal components:\n\n" +
          "1. Technical Approach: Utilizing our proven 5-step migration framework\n" +
          "2. Past Performance: Highlighting 3 similar DoD cloud migrations\n" +
          "3. Personnel: Recommending a team structure with 8 key roles\n" +
          "4. Pricing: Suggesting a phased pricing model with milestone payments";
      }
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: response
        }
      ]);
      
      setIsLoading(false);
    }, 2000);
  };
  
  // Reset the current session
  const resetSession = () => {
    setUrl('');
    setOpportunityData(null);
    setActiveAssistant(null);
    setMessages([]);
    setShowSelection(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Contract Opportunity Platform</title>
        <meta name="description" content="AI-powered government contract opportunity platform" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        {showSelection ? (
          // URL Input Section
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Contract Opportunity Platform</h1>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">Enter a SAM.gov opportunity URL to begin analyzing the contract data</p>
                <div className="flex">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://sam.gov/opportunity/12345"
                    className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => fetchOpportunityData(url)}
                    disabled={!url || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center justify-center disabled:bg-blue-400"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Opportunities</h2>
                <ul className="space-y-3">
                  {['Cloud Infrastructure Services - Department of Energy', 'IT Support Services - Department of Health', 'Cybersecurity Assessment - Department of Defense'].map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                      <span className="text-gray-700">{item}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Opportunity and Chat Interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Opportunity Details Panel */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Opportunity Details</h2>
                  <button onClick={resetSession} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {opportunityData && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">{opportunityData.title}</h3>
                      <p className="text-gray-600">{opportunityData.agency}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Solicitation #:</span>
                      <span className="text-gray-700">{opportunityData.solicitationNumber}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Response Due:</span>
                      <span className="text-gray-700">{opportunityData.responseDate}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{opportunityData.description}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Requirements</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {opportunityData.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <Clipboard className="h-4 w-4 mr-1" />
                        Copy opportunity details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[700px]">
              {/* Chat header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {activeAssistant ? (
                      <span className="flex items-center">
                        <Robot className="h-5 w-5 mr-2 text-blue-600" />
                        {activeAssistant === 'rfi' && 'RFI Assistant'}
                        {activeAssistant === 'solution' && 'Solution Brief Assistant'}
                        {activeAssistant === 'proposal' && 'Proposal Assistant'}
                      </span>
                    ) : (
                      'AI Assistant'
                    )}
                  </h2>
                  
                  {messages.length > 1 && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Export conversation
                    </button>
                  )}
                </div>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!activeAssistant && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="text-md font-semibold text-blue-800 mb-2">Select an AI Assistant</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => selectAssistant('rfi')}
                        className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
                      >
                        <h4 className="font-semibold text-gray-800">RFI Assistant</h4>
                        <p className="text-xs text-gray-500 mt-1">Draft detailed RFI responses</p>
                      </button>
                      
                      <button
                        onClick={() => selectAssistant('solution')}
                        className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
                      >
                        <h4 className="font-semibold text-gray-800">Solution Brief</h4>
                        <p className="text-xs text-gray-500 mt-1">Create technical overviews</p>
                      </button>
                      
                      <button
                        onClick={() => selectAssistant('proposal')}
                        className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
                      >
                        <h4 className="font-semibold text-gray-800">Proposal Assistant</h4>
                        <p className="text-xs text-gray-500 mt-1">Generate comprehensive proposals</p>
                      </button>
                    </div>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.role === 'system'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 max-w-[80%] rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        <span>Generating response...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat input */}
              {activeAssistant && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message here..."
                      className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-md disabled:bg-blue-400"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}