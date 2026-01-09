
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles, Wand2, Type as FontIcon, Languages } from 'lucide-react';
import { getPageContent } from '../services/wikisourceService';
import { interpretHistoricalText } from '../services/geminiService';
import { BookContent } from '../types';
import { useLanguage } from '../App';

const ReaderPage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const navigate = useNavigate();
  const { variant, t } = useLanguage();
  const [book, setBook] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [interpreting, setInterpreting] = useState(false);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (title) {
      loadContent();
    }
  }, [title, variant]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await getPageContent(decodeURIComponent(title!), variant);
      setBook(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterpret = async () => {
    if (!book) return;
    setInterpreting(true);
    try {
      const prompt = t(
        "请解释这段文字的核心意义，并将其翻译为现代汉语。如果有生僻字或历史背景，请一并说明。",
        "請解釋這段文字的核心意義，並將其翻譯為現代漢語。如果有生僻字或歷史背景，請一併說明。"
      );
      const result = await interpretHistoricalText(book.content, prompt, variant);
      setInterpretation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setInterpreting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-700" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col md:flex-row">
      <div className="flex-1 max-h-screen overflow-y-auto px-4 py-12 md:px-20 lg:px-40">
        <button 
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-neutral-500 hover:text-red-700 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> {t('返回搜尋', '返回搜尋')}
        </button>

        <article className="max-w-3xl mx-auto">
          <header className="mb-16 border-b border-neutral-200 pb-12">
            <h1 className="text-5xl font-scholar font-bold text-neutral-900 mb-4">{book?.title}</h1>
            <div className="flex items-center gap-6">
              <span className="text-red-700 text-sm font-bold tracking-widest uppercase">Wikisource Archive</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="p-1 hover:bg-neutral-100 rounded text-neutral-400"><FontIcon size={14} /></button>
                <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-1 hover:bg-neutral-100 rounded text-neutral-800"><FontIcon size={18} /></button>
              </div>
            </div>
          </header>

          <div 
            className="font-scholar leading-relaxed whitespace-pre-wrap text-neutral-800"
            style={{ fontSize: `${fontSize}px` }}
          >
            {book?.content}
          </div>
        </article>
      </div>

      <div className="w-full md:w-[450px] bg-white border-l border-neutral-200 flex flex-col h-screen overflow-hidden">
        <div className="p-6 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500" size={20} />
            <h2 className="font-bold">{t('AI 学术助手', 'AI 學術助手')}</h2>
          </div>
          <button 
            onClick={handleInterpret}
            disabled={interpreting}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {interpreting ? <Loader2 className="animate-spin" size={14} /> : <Languages size={14} />}
            {t('解析全文', '解析全文')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
          {!interpretation ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-300 mb-6">
                <Wand2 size={32} />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">{t('需要解读吗？', '需要解讀嗎？')}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {t('点击「解析全文」让 AI 为您翻译古文、分析背景并解释深奥术语。', '點擊「解析全文」讓 AI 為您翻譯古文、分析背景並解釋深奧術語。')}
              </p>
            </div>
          ) : (
            <div className="prose prose-sm prose-neutral">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm font-scholar whitespace-pre-wrap leading-relaxed text-neutral-700">
                {interpretation}
              </div>
              <p className="text-[10px] text-neutral-400 mt-4 text-center">
                {t('AI 生成内容仅供参考，请结合传统注疏进行研究。', 'AI 生成內容僅供參考，請結合傳統註疏進行研究。')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;
