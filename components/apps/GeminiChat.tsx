import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import type { AppProps } from '../../types';
import { callGeminiStream } from '../../services/geminiService';
import { audioService } from '../../services/audioService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const GeminiChat: React.FC<AppProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
      { sender: 'bot', text: 'Hello! I am G-Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    audioService.playSound('click');
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessage: Message = { sender: 'bot', text: '' };
    setMessages(prev => [...prev, botMessage]);

    try {
      const stream = await callGeminiStream(input);
      let botText = '';
      for await (const chunk of stream) {
        botText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = botText;
          return newMessages;
        });
      }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = 'Sorry, I encountered an error. Please try again.';
            return newMessages;
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col text-sm">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <ICONS.SparkleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].sender === 'bot' && (
            <div className="flex items-start gap-3">
                <ICONS.SparkleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1"/>
                <div className="bg-slate-700 p-3 rounded-lg rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-slate-700">
        <div className="flex items-center bg-slate-800 rounded-lg">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-2 text-slate-200 placeholder-slate-500 outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
