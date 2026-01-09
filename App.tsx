
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Library, Scroll, Languages } from 'lucide-react';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import ReaderPage from './components/ReaderPage';
import ChatAssistant from './components/ChatAssistant';
import { LanguageVariant } from './types';

interface LanguageContextType {
  variant: LanguageVariant;
  setVariant: (v: LanguageVariant) => void;
  t: (s: string, t: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const { variant, setVariant, t } = useLanguage();

  const navLinks = [
    { name: t('搜尋', '搜尋'), path: '/search', icon: Search },
    { name: t('典藏', '典藏'), path: '/', icon: Library },
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#fdfaf6]/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-red-700 p-1.5 rounded-sm rotate-3 group-hover:rotate-0 transition-transform shadow-md shadow-red-700/20">
              <Scroll className="text-white" size={20} />
            </div>
            <span className="font-scholar text-2xl font-bold tracking-tight text-neutral-900">{t('兰台', '蘭台')}</span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-red-700 ${
                    location.pathname === link.path ? 'text-red-700' : 'text-neutral-600'
                  }`}
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setVariant(variant === 'zh-hans' ? 'zh-hant' : 'zh-hans')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition-all text-xs font-bold text-neutral-600"
            >
              <Languages size={14} className="text-red-700" />
              <span>{variant === 'zh-hans' ? '简体' : '繁體'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [variant, setVariant] = useState<LanguageVariant>('zh-hans');

  // Helper to choose between Simplified and Traditional UI text
  const t = (s: string, tr: string) => (variant === 'zh-hans' ? s : tr);

  return (
    <LanguageContext.Provider value={{ variant, setVariant, t }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col selection:bg-red-100 selection:text-red-900">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/reader/:title" element={<ReaderPage />} />
            </Routes>
          </main>
          <ChatAssistant />
        </div>
      </HashRouter>
    </LanguageContext.Provider>
  );
};

export default App;
