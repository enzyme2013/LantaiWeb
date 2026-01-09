
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scroll, Search, BookOpen, Quote, Library } from 'lucide-react';
import { useLanguage } from '../App';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543165796-5426273eaec3?auto=format&fit=crop&q=80&w=2000" 
            alt="Historical Background" 
            className="w-full h-full object-cover opacity-20 sepia"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf6]/10 via-[#fdfaf6] to-[#fdfaf6]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-8">
              <span className="text-red-700 text-xs font-bold uppercase tracking-widest">Digital Historical Archive</span>
            </div>
            <h1 className="font-scholar text-5xl md:text-8xl text-neutral-900 font-bold leading-tight mb-8 whitespace-pre-line">
              {t('古籍之韵，', '古籍之韻，')}<br/><span className="text-red-700">{t('智启新章', '智啟新章')}</span>
            </h1>
            <p className="text-neutral-600 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-scholar">
              {t('穿梭五千年历史长河，利用 AI 深度解析古典名著。搜尋、閱讀、並理解藏於 Wikisource 的華夏智慧。', '穿梭五千年歷史長河，利用 AI 深度解析古典名著。搜尋、閱讀、並理解藏於 Wikisource 的華夏智慧。')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/search" 
                className="bg-neutral-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {t('开始探索', '開始探索')} <Search size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: t('经部', '經部'), desc: t('儒家经典与思想', '儒家經典與思想'), icon: BookOpen },
              { title: t('史部', '史部'), desc: t('正史、野史与地理', '正史、野史與地理'), icon: Scroll },
              { title: t('子部', '子部'), desc: t('诸子百家与科学', '諸子百家與科學'), icon: Quote },
              { title: t('集部', '集部'), desc: t('文学作品与诗词', '文學作品與詩詞'), icon: Library },
            ].map((cat, i) => (
              <div key={i} className="p-8 bg-white border border-neutral-100 rounded-2xl hover:border-red-200 transition-all hover:shadow-lg group">
                <cat.icon size={32} className="text-red-700 mb-6" />
                <h3 className="text-2xl font-scholar font-bold mb-3">{cat.title}</h3>
                <p className="text-neutral-500 text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
