
import React, { useState, useEffect, useRef } from 'react';
import { t } from '../constants/translations';
import { Language } from '../types';
import { XIcon, PaperAirplaneIcon, LogoIcon } from './Icons';
import { getChatResponse, ChatMessage } from '../services/geminiService';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialContext?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, language, initialContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initialization and context
  useEffect(() => {
      if (isOpen) {
          if (!hasInitialized.current) {
               // Initial greeting
               setMessages([{ role: 'model', text: t('aiGreeting', language) }]);
               hasInitialized.current = true;
          }
          
          // If specific context is passed (e.g. from medicine card), send it immediately as a user prompt
          if (initialContext) {
               handleSend(initialContext);
          }
      }
  }, [isOpen, initialContext]);

  const handleSend = async (text: string) => {
      if (!text.trim()) return;
      
      const userMsg: ChatMessage = { role: 'user', text: text };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
          const responseText = await getChatResponse(messages, text);
          setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSend(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-full max-w-[380px] h-[600px] bg-white rounded-[2rem] shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-100 animate-bounce-in origin-bottom-right ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-5 flex justify-between items-center text-white shadow-md z-10">
        <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <LogoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-base tracking-wide">{t('chatHeader', language)}</h3>
                <span className="text-xs text-teal-100 flex items-center font-medium mt-0.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    Online
                </span>
            </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors active:scale-90">
            <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow bg-slate-50 p-5 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-teal-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                    }`}
                >
                    {msg.text}
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                    <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={onFormSubmit} className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center shadow-sm rounded-2xl bg-slate-50">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('typeMessage', language)}
                className="w-full pl-5 pr-14 py-4 bg-transparent border-none focus:ring-0 text-slate-700 text-sm font-medium"
            />
            <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md active:scale-95"
            >
                <PaperAirplaneIcon className="w-4 h-4" />
            </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">AI generated advice. Always consult a doctor.</p>
      </form>
    </div>
  );
};
