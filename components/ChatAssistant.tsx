
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, User, Sparkles, Loader2, Book } from 'lucide-react';
import { chatWithScholar } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../App';

const ChatAssistant: React.FC = () => {
  const { variant, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: t('您好，後學。我是蘭台學術助理。關於中國歷史、古籍或人物典故，有什麼我可以為您解答的嗎？', '您好，後學。我是蘭台學術助理。關於中國歷史、古籍或人物典故，有什麼我可以為您解答的嗎？'),
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update initial message if language changes before chat starts
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{
        id: '1',
        role: 'model',
        content: t('您好，後學。我是蘭台學術助理。關於中國歷史、古籍或人物典故，有什麼我可以為您解答的嗎？', '您好，後學。我是蘭台學術助理。關於中國歷史、古籍或人物典故，有什麼我可以為您解答的嗎？'),
        timestamp: Date.now()
      }]);
    }
  }, [variant]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithScholar([...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      })), variant);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || t("抱歉，无法生成回应。请再试一次。", "抱歉，無法生成回應。請再試一次。"),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: t("目前连线不稳定，请稍后再试。", "目前連線不穩定，請稍後再試。"),
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-neutral-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 transition-all z-[60] group border-4 border-white"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[450px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-[32px] shadow-2xl border border-neutral-100 flex flex-col z-[60] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300 font-scholar">
          <div className="bg-neutral-900 p-6 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center shadow-lg shadow-red-700/20">
              <Book size={20} />
            </div>
            <div>
              <h4 className="font-bold">{t('兰台学术助理', '蘭台學術助理')}</h4>
              <p className="text-xs text-neutral-400">{t('正在查阅历史长卷...', '正在查閱歷史長卷...')}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-neutral-100 text-neutral-600' : 'bg-red-50 text-red-700'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-neutral-900 text-white rounded-tr-none shadow-md' 
                    : 'bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="bg-neutral-100 p-4 rounded-2xl rounded-tl-none text-neutral-400 text-sm italic">
                    {t('正在翻阅典籍...', '正在翻閱典籍...')}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-neutral-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t("询问历史细节、人物或典故...", "詢問歷史細節、人物或典故...")}
                className="flex-1 bg-neutral-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-red-700"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg shadow-neutral-900/10"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
