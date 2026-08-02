"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User, AlertCircle } from "lucide-react";
import { askAiChatbot } from "src/actions/ai";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Namaste! I am the BIT AI Assistant. I can help answer questions regarding fees, hostels, curfew rules, placements, library books, and course schedules. Ask away!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "What is the annual tuition fee?",
    "Show curfew rules for hostelers",
    "What is the placement package?",
    "Library book borrowing rules"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askAiChatbot(text);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: res.answer,
        sources: res.sources
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: "I experienced an error connecting to my university database. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print flex flex-col items-end">
      {/* Expanded Chat Pane */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-bit-blue text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-bold text-xs leading-none">BIT ERP AI Assistant</span>
                <span className="text-[10px] text-white/70">Local RAG Query System</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages view */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs ${
                  msg.sender === "user" ? "bg-bit-red text-white" : "bg-bit-blue text-white"
                }`}>
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                
                <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-bit-red-light text-bit-red-dark font-medium border border-bit-red/10 rounded-tr-none" 
                    : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none"
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 border-t border-slate-100 pt-1.5 flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-bit-blue" /> Source Citations:
                      </span>
                      {msg.sources.map((src, i) => (
                        <span key={i} className="text-[9px] text-bit-blue font-medium bg-bit-blue-light px-1.5 py-0.5 rounded self-start mt-0.5">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2 self-start items-center text-slate-400 text-xs pl-8">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Scanning rules & notices...</span>
              </div>
            )}
          </div>

          {/* Quick pills */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="text-[10px] text-slate-600 hover:text-bit-blue bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-full cursor-pointer transition"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input tray */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="border-t border-slate-200 p-2.5 flex gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-slate-200 focus:border-bit-blue rounded-md px-3 py-1.5 text-xs focus:outline-none"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-bit-blue hover:bg-bit-blue-dark text-white p-1.5 rounded-md disabled:bg-slate-300 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-bit-blue hover:bg-bit-blue-dark text-white p-3.5 rounded-full shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        title="BIT AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
