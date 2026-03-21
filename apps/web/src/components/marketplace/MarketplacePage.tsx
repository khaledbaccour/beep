'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Star, SlidersHorizontal, Loader2, X, ChevronDown } from 'lucide-react';
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

const ENUM_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_ENUM).map(([key, value]) => [value, key]),
);

const PAGE_SIZE = 20;

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatPrice(millimes: number): number {
  return Math.round(millimes / 1000);
}

export function MarketplacePage({ dict, lang }: Props) {
  const searchParams = useSearchParams();
  const initialCategory = useMemo(() => {
    const param = searchParams.get('category');
    if (!param) return 'all';
    const lower = param.toLowerCase();
    return ENUM_TO_CATEGORY[param.toUpperCase()] ?? (categoryKeys.includes(lower as typeof categoryKeys[number]) ? lower : 'all');
  }, [searchParams]);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter panel state
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>();
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>();
  const filterRef = useRef<HTMLDivElement>(null);

  // Count active filters
  const activeFilterCount = (activeCategory !== 'all' ? 1 : 0) + (appliedMinPrice != null ? 1 : 0) + (appliedMaxPrice != null ? 1 : 0);

  // Close filter panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const fetchExperts = useCallback(async (
    category: string,
    searchTerm: string,
    pageNum: number,
    append: boolean,
    pMinPrice?: number,
    pMaxPrice?: number,
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
      if (pMinPrice != null) {
        params.minPrice = pMinPrice;
      }
      if (pMaxPrice != null) {
        params.maxPrice = pMaxPrice;
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

  // Initial load + re-fetch when category or price filters change
  useEffect(() => {
    fetchExperts(activeCategory, search, 1, false, appliedMinPrice, appliedMaxPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, appliedMinPrice, appliedMaxPrice]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchExperts(activeCategory, search, 1, false, appliedMinPrice, appliedMaxPrice);
    }, 350);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchExperts(activeCategory, search, page + 1, true, appliedMinPrice, appliedMaxPrice);
    }
  };

  const getCategoryLabel = (key: string): string => {
    if (key === 'all') return dict.marketplace.all;
    const catKey = key as keyof typeof dict.categories;
    return dict.categories[catKey] as string;
  };

  const handleApplyFilters = () => {
    setActiveCategory(pendingCategory);
    setAppliedMinPrice(minPrice ? Number(minPrice) * 1000 : undefined);
    setAppliedMaxPrice(maxPrice ? Number(maxPrice) * 1000 : undefined);
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setPendingCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setActiveCategory('all');
    setAppliedMinPrice(undefined);
    setAppliedMaxPrice(undefined);
    setFilterOpen(false);
  };

  // Sync pending state when opening the panel
  const handleToggleFilter = () => {
    if (!filterOpen) {
      setPendingCategory(activeCategory);
      setMinPrice(appliedMinPrice != null ? String(appliedMinPrice / 1000) : '');
      setMaxPrice(appliedMaxPrice != null ? String(appliedMaxPrice / 1000) : '');
    }
    setFilterOpen(!filterOpen);
  };

  return (
    <section className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-ink-900 tracking-normal mb-1">
            {dict.marketplace.title}
          </h1>
          <p className="text-ink-500 text-sm">{dict.marketplace.subtitle}</p>
        </div>

        {/* Search + filter button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              size="default"
              className={`gap-2 shrink-0 ${activeFilterCount > 0 ? 'border-ink-900 bg-ink-900 text-white hover:bg-ink-800 hover:text-white' : ''}`}
              onClick={handleToggleFilter}
            >
              <SlidersHorizontal size={14} />
              {dict.marketplace.filters}
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-ink-900 text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Filter panel dropdown */}
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-[340px] bg-white rounded-xl border-2 border-ink-900 shadow-retro p-5 z-50">
                {/* Category */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-ink-700 uppercase tracking-wider mb-2.5 block">
                    {dict.marketplace.category}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryKeys.map((key) => (
                      <button
                        key={key}
                        onClick={() => setPendingCategory(key)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap border-2 transition-all ${
                          pendingCategory === key
                            ? 'bg-ink-900 text-white border-ink-900 shadow-retro-sm'
                            : 'bg-white text-ink-600 border-ink-200 hover:border-ink-900 hover:bg-ink-50'
                        }`}
                      >
                        {getCategoryLabel(key)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-ink-700 uppercase tracking-wider mb-2.5 block">
                    {dict.marketplace.priceRange} ({dict.common.tnd})
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder={dict.marketplace.minPrice}
                      className="h-9 text-sm"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min={0}
                    />
                    <span className="text-ink-400 text-sm font-bold">—</span>
                    <Input
                      type="number"
                      placeholder={dict.marketplace.maxPrice}
                      className="h-9 text-sm"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleResetFilters}
                  >
                    {dict.marketplace.reset}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-ink-900 text-white hover:bg-ink-800"
                    onClick={handleApplyFilters}
                  >
                    {dict.marketplace.apply}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-ink-400 font-medium">{activeFilterCount} {dict.marketplace.activeFilters}:</span>
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-ink-100 text-ink-700 border border-ink-200">
                {getCategoryLabel(activeCategory)}
                <button
                  onClick={() => { setActiveCategory('all'); setPendingCategory('all'); }}
                  className="ml-0.5 hover:text-ink-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {appliedMinPrice != null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-ink-100 text-ink-700 border border-ink-200">
                {dict.marketplace.minPrice}: {appliedMinPrice / 1000} {dict.common.tnd}
                <button
                  onClick={() => { setAppliedMinPrice(undefined); setMinPrice(''); }}
                  className="ml-0.5 hover:text-ink-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {appliedMaxPrice != null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-ink-100 text-ink-700 border border-ink-200">
                {dict.marketplace.maxPrice}: {appliedMaxPrice / 1000} {dict.common.tnd}
                <button
                  onClick={() => { setAppliedMaxPrice(undefined); setMaxPrice(''); }}
                  className="ml-0.5 hover:text-ink-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-ink-400 hover:text-ink-700 underline underline-offset-2"
            >
              {dict.marketplace.reset}
            </button>
          </div>
        )}

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
              onClick={() => fetchExperts(activeCategory, search, 1, false, appliedMinPrice, appliedMaxPrice)}
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
                        <div className={`w-10 h-10 rounded-full border-2 border-ink-900 bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold`}>
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
                        {Number(expert.averageRating).toFixed(1)}
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
