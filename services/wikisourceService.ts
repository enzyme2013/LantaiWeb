
import { WikiSearchResult, BookContent, LanguageVariant } from '../types';

const API_BASE = 'https://zh.wikisource.org/w/api.php';

export const searchWikiSource = async (query: string, variant: LanguageVariant = 'zh-hans'): Promise<WikiSearchResult[]> => {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    format: 'json',
    origin: '*',
    srnamespace: '0',
    srlimit: '20',
    uselang: variant
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  const data = await response.json();
  return data.query.search;
};

export const getPageContent = async (title: string, variant: LanguageVariant = 'zh-hans'): Promise<BookContent> => {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    titles: title,
    format: 'json',
    origin: '*',
    explaintext: 'true',
    uselang: variant
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  const data = await response.json();
  const pages = data.query.pages;
  const pageid = Object.keys(pages)[0];
  const page = pages[pageid];

  return {
    title: page.title,
    content: page.extract || 'No content found.',
    pageid: parseInt(pageid)
  };
};
