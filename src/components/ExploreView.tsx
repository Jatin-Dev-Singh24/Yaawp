import React, { useState, useMemo } from 'react';
import { Search, Heart, MessageCircle, Film, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXPLORE_PRESETS } from '../data/mockData';
import { Post } from '../types';

export const ExploreView: React.FC = () => {
  const { posts, setSelectedPostForModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For you');

  const categories = ['For you', 'Photography', 'Travel', 'Architecture', 'Food', 'Style', 'Nature'];

  // Combined explore items (user posts + curated presets converted to posts format)
  const allExploreItems = useMemo(() => {
    // Generate synthetic posts for explore presets so clicking them opens full interactive modal
    const presetsAsPosts: Post[] = EXPLORE_PRESETS.map((exp, idx) => ({
      id: `exp_post_${exp.id}`,
      user: {
        id: `exp_user_${idx}`,
        username: `${exp.category.toLowerCase()}_master`,
        name: `${exp.category} Curated`,
        avatar: exp.mediaUrl,
        isVerified: true
      },
      mediaUrls: [exp.mediaUrl],
      caption: `Stunning ${exp.category.toLowerCase()} capture from our community creators. #explore #${exp.category.toLowerCase()} #visualart`,
      location: exp.category,
      timestamp: `${idx + 1}d ago`,
      likesCount: exp.likesCount,
      isLiked: false,
      isSaved: false,
      comments: [
        {
          id: `c_exp_${idx}`,
          postId: `exp_post_${exp.id}`,
          user: {
            id: 'user_fan',
            username: 'travel_lover',
            name: 'Sam',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80'
          },
          text: 'Incredible mood and lighting!',
          timestamp: '2h',
          likesCount: 3
        }
      ]
    }));

    return [...posts, ...presetsAsPosts];
  }, [posts]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return allExploreItems.filter(item => {
      const matchesSearch =
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      if (searchQuery.trim()) return matchesSearch;

      if (selectedCategory === 'For you') return true;
      return (
        item.caption.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    });
  }, [allExploreItems, searchQuery, selectedCategory]);

  return (
    <div id="explore-view" className="w-full max-w-4xl mx-auto py-4 px-2 md:px-4">
      {/* Search Bar */}
      <div className="relative mb-5 max-w-md mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search accounts, tags, or places..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat && !searchQuery
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-3">
        {filteredItems.map((item, idx) => {
          // Every 6th item can be large span-2 on desktop for that signature Yaawp explore bento aesthetic
          const isFeatured = idx % 6 === 1;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedPostForModal(item)}
              className={`group relative overflow-hidden bg-slate-900 rounded-sm md:rounded-lg cursor-pointer aspect-square ${
                isFeatured ? 'col-span-1 row-span-1 md:col-span-2 md:row-span-2 md:aspect-auto' : ''
              }`}
            >
              <img
                src={item.mediaUrls[0]}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Reel indicator icon if featured or reel */}
              {isFeatured && (
                <div className="absolute top-2 right-2 text-white drop-shadow-md z-10">
                  <Film className="w-5 h-5 fill-white/80" />
                </div>
              )}

              {/* Hover Overlay with stats */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white text-white" />
                  <span>{item.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>{item.comments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-16 text-center text-neutral-400 dark:text-neutral-500">
          <p className="text-sm font-semibold">No results found for "{searchQuery}"</p>
          <p className="text-xs mt-1">Try searching for other keywords like tokyo, coffee, travel</p>
        </div>
      )}
    </div>
  );
};
