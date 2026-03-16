'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Star, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import { searchExperts, type ExpertProfile, type MarketplaceSearchParams } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const CATEGORY_TO_ENUM: Record<string, string> = {
  fitness: 'FITNESS',
  education: 'EDUCATION',
  design: 'ART',
  law: 'LAW',
  business: 'BUSINESS',
  technology: 'TECHNOLOGY',
  coaching: 'PSYCHOLOGY',
  languages: 'LANGUAGES',
};

const categoryKeys = ['all', 'fitness', 'education', 'design', 'law', 'business', 'technology', 'coaching', 'languages'] as const;

const GRADIENT_BY_CATEGORY: Record<string, string> = {
  FITNESS: 'from-rose-400 to-orange-400',
  EDUCATION: 'from-blue-500 to-indigo-500',
  ART: 'from-emerald-400 to-teal-400',
  LAW: 'from-amber-500 to-orange-500',
  BUSINESS: 'from-violet-400 to-purple-400',
  TECHNOLOGY: 'from-blue-400 to-cyan-400',
  PSYCHOLOGY: 'from-pink-400 to-rose-400',
  LANGUAGES: 'from-amber-400 to-yellow-400',
};

const PAGE_SIZE = 20;

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatPrice(millimes: number): number {
  return Math.round(millimes / 1000);
}

export function MarketplacePage({ dict, lang }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchExperts = useCallback(async (
    category: string,
    searchTerm: string,
    pageNum: number,
    append: boolean,
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const params: MarketplaceSearchParams = {
        page: pageNum,
        limit: PAGE_SIZE,
      };
      if (category !== 'all') {
        params.category = CATEGORY_TO_ENUM[category] ?? category.toUpperCase();
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const result = await searchExperts(params);
      if (append) {
        setExperts((prev) => [...prev, ...result.data]);
      } else {
        setExperts(result.data);
      }
      setTotalPages(result.meta.totalPages);
      setPage(pageNum);
    } catch {
      setError(dict.marketplace.error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [dict.marketplace.error]);

  // Initial load + re-fetch when category changes
  useEffect(() => {
    fetchExperts(activeCategory, search, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchExperts(activeCategory, search, 1, false);
    }, 350);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchExperts(activeCategory, search, page + 1, true);
    }
  };

  const getCategoryLabel = (key: string): string => {
    if (key === 'all') return dict.marketplace.all;
    const catKey = key as keyof typeof dict.categories;
    return dict.categories[catKey] as string;
  };

  return (
    <section className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight mb-1">
            {dict.marketplace.title}
          </h1>
          <p className="text-ink-500 text-sm">{dict.marketplace.subtitle}</p>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input
              type="text"
              placeholder={dict.marketplace.searchPlaceholder}
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="default" className="gap-2 shrink-0">
            <SlidersHorizontal size={14} />
            {dict.marketplace.filters}
          </Button>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap border-2 transition-all ${
                activeCategory === key
                  ? 'bg-ink-900 text-white border-ink-900 shadow-retro-sm'
                  : 'bg-white text-ink-600 border-ink-900 hover:bg-ink-50'
              }`}
            >
              {getCategoryLabel(key)}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-ink-400 mr-2" />
            <span className="text-ink-400 text-sm">{dict.marketplace.loading}</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-ink-500 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fetchExperts(activeCategory, search, 1, false)}
            >
              {dict.marketplace.loadMore}
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && experts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-ink-500 text-sm">{dict.marketplace.noResults}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && experts.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map((expert) => {
                const gradient = GRADIENT_BY_CATEGORY[expert.category] ?? 'from-gray-400 to-gray-500';
                const initials = getInitials(expert.firstName, expert.lastName);
                const price = formatPrice(expert.sessionPriceMillimes);

                return (
                  <a
                    key={expert.id}
                    href={localePath(lang, `/${expert.slug}`)}
                    className="group rounded-2xl border-2 border-ink-900 bg-white p-5 shadow-retro transition-all duration-200 hover:-translate-y-0.5 hover:shadow-retro-md"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full border-2 border-ink-900 bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-black`}>
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-500 transition-colors">
                            {expert.firstName} {expert.lastName}
                          </h3>
                          <p className="text-xs text-ink-400">{expert.headline ?? expert.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border-2 border-ink-900">
                        <Star size={10} fill="#F59E0B" stroke="none" />
                        {expert.averageRating.toFixed(1)}
                      </div>
                    </div>

                    {expert.tags && expert.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {expert.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-ink-50 text-ink-600 border-2 border-ink-900">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3.5 border-t-2 border-ink-900/10">
                      <span className="text-xs text-ink-400">{expert.totalSessions} {dict.marketplace.sessions}</span>
                      <span className="text-base font-bold text-ink-900">
                        {price} <span className="text-xs font-normal text-ink-400">{dict.common.tnd}</span>
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Load more */}
            {page < totalPages && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  {dict.marketplace.loadMore}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
