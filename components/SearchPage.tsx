
import React, { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, Clock, ChevronRight, UserCircle, Landmark } from 'lucide-react';
import { searchWikiSource } from '../services/wikisourceService';
import { fetchBiography } from '../services/geminiService';
import { WikiSearchResult, BiographyData } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const SearchPage: React.FC = () => {
  const { variant, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResult[]>([]);
  const [bio, setBio] = useState<BiographyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger re-search if language changes and results exist
  useEffect(() => {
    if (results.length > 0 && query) {
      handleSearch();
    }
  }, [variant]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // Keep current results while searching for better UX unless it's a new query
    if (e) setBio(null); 
    
    try {
      const [wikiResults, bioResult] = await Promise.all([
        searchWikiSource(query, variant),
        fetchBiography(query, variant)
      ]);
      setResults(wikiResults);
      setBio(bioResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <h1 className="text-4xl font-scholar font-bold mb-8 text-neutral-900">{t('搜尋兰台', '搜尋蘭台')}</h1>
        
        <form onSubmit={handleSearch} className="relative mb-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('搜尋古籍、人名或歷史事件（如：汲黯、史記）', '搜尋古籍、人名或歷史事件（如：汲黯、史記）')}
            className="w-full bg-white border-2 border-neutral-200 rounded-2xl pl-6 pr-16 py-5 text-lg font-scholar focus:border-red-700 focus:ring-0 transition-all shadow-sm"
          />
          <button 
            type="submit"
            className="absolute right-3 top-3 bottom-3 w-14 bg-red-700 text-white rounded-xl flex items-center justify-center hover:bg-red-800 transition-all shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
          </button>
        </form>

        {/* Biography Plaque */}
        {bio && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-[#fefcf9] border-2 border-red-700/20 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/5 -mr-16 -mt-16 rounded-full"></div>
              <div className="relative flex flex-col md:flex-row gap-8">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-20 h-20 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner">
                    <UserCircle size={48} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
                    {t('人物小传', '人物小傳')}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-4 mb-3">
                    <h2 className="text-3xl font-scholar font-bold text-neutral-900">{bio.name}</h2>
                    {bio.courtesyName && <span className="text-neutral-500 font-scholar">{t('字', '字')} {bio.courtesyName}</span>}
                    {bio.years && <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-bold">{bio.years}</span>}
                  </div>
                  <p className="text-neutral-700 font-scholar leading-relaxed mb-4">
                    {bio.bio}
                  </p>
                  <div className="flex items-start gap-2 bg-white/50 p-4 rounded-xl border border-neutral-100 italic text-sm text-neutral-600">
                    <Landmark size={16} className="shrink-0 mt-1 text-red-700" />
                    <span>{t('历史定位：', '歷史定位：')}{bio.historicalSignificance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2 text-neutral-400 font-medium text-xs uppercase tracking-widest px-2">
            <BookOpen size={14} /> {t('相关典籍文献', '相關典籍文獻')}
          </div>
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                key={item.pageid}
                to={`/reader/${encodeURIComponent(item.title)}`}
                className="block bg-white border border-neutral-100 p-8 rounded-2xl hover:border-red-200 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-scholar font-bold text-neutral-900 group-hover:text-red-700">
                    {item.title}
                  </h3>
                  <ChevronRight size={20} className="text-neutral-300 group-hover:text-red-700 transition-transform group-hover:translate-x-1" />
                </div>
                <div 
                  className="text-neutral-500 text-sm font-scholar leading-relaxed line-clamp-3 mb-6"
                  dangerouslySetInnerHTML={{ __html: item.snippet + '...' }}
                />
                <div className="flex items-center gap-6 text-xs text-neutral-400 font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-red-700/60 uppercase">Wikisource</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {t('更新于', '更新於')} {new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          ) : !isLoading && query && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
              <p className="text-neutral-400 font-scholar">{t('兰台未藏此卷，请更换关键字再行检索。', '蘭台未藏此卷，請更換關鍵字再行檢索。')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
