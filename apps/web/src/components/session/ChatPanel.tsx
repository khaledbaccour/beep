'use client';

import { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './types';

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (content: string) => void;
  onClose: () => void;
}

export function ChatPanel({ messages, currentUserId, onSend, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  }

  return (
    <div className="w-80 flex flex-col bg-ink-900 border-l-2 border-ink-700 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700">
        <h3 className="text-sm font-display font-bold text-white">Chat</h3>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-ink-700 transition-colors"
        >
          <XIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" role="log" aria-label="Chat messages">
        {messages.length === 0 && (
          <p className="text-xs text-ink-500 text-center mt-8">No messages yet</p>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div key={`${msg.timestamp}-${i}`} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  isOwn
                    ? 'bg-peach-500 text-ink-950 rounded-br-sm'
                    : 'bg-ink-800 text-white border border-ink-700 rounded-bl-sm'
                }`}
              >
                <p className="font-body break-words">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isOwn ? 'text-ink-700' : 'text-ink-500'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-ink-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            aria-label="Chat message input"
            className="flex-1 px-3 py-2 rounded-lg bg-ink-800 border border-ink-700 text-white text-sm font-body placeholder:text-ink-500 focus:outline-none focus:border-peach-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="px-3 py-2 rounded-lg bg-peach-500 text-ink-950 font-bold text-sm border border-ink-950 hover:bg-peach-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
