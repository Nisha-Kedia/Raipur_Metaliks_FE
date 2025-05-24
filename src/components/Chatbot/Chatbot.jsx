import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { MessageCircle, X, ChevronUp, Send } from 'lucide-react';

const predefinedQAs = [
  {
    question: "What services do you offer?",
    answer: "We offer a wide range of services including web development, mobile app development, UI/UX design, digital marketing, and IT consultancy."
  },
  {
    question: "How can I schedule a consultation?",
    answer: "You can schedule a consultation by filling out the form on our Contact page or by calling our customer service at (555) 123-4567."
  },
  {
    question: "What are your business hours?",
    answer: "Our business hours are Monday through Friday, 9:00 AM to 6:00 PM EST. We're closed on weekends and major holidays."
  },
  {
    question: "Do you offer support after project completion?",
    answer: "Yes, we provide ongoing support and maintenance services for all our projects. Our support packages can be customized based on your needs."
  },
  {
    question: "What is your pricing structure?",
    answer: "Our pricing varies depending on project requirements and scope. We offer both fixed-price contracts and hourly rates. Contact us for a personalized quote."
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! How can I help you today? Feel free to ask a question or click on one of the suggestions below.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);

  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputText('');
    
    const matchedQA = predefinedQAs.find(qa => 
      qa.question.toLowerCase().includes(text.toLowerCase()) || 
      text.toLowerCase().includes(qa.question.toLowerCase())
    );
    
    setTimeout(() => {
      if (matchedQA) {
        setMessages(prev => [...prev, { type: 'bot', text: matchedQA.answer }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "I don't have specific information about that. Please contact our team directly for more assistance or try one of the suggested questions." 
        }]);
      }
    }, 500);
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatBodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 50);
      }
    };

    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.addEventListener('scroll', handleScroll);
      return () => chatBody.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
        <span>Chat with us</span>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Customer Support</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {showScrollButton && (
              <button className="scroll-button" onClick={scrollToBottom}>
                <ChevronUp size={20} />
              </button>
            )}
          </div>

          <div className="chatbot-suggestions">
            <p>Frequently Asked Questions:</p>
            <div className="suggestion-buttons">
              {predefinedQAs.map((qa, index) => (
                <button 
                  key={index} 
                  onClick={() => handleQuestionClick(qa.question)}
                  className="suggestion-button"
                >
                  {qa.question}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-button" 
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;