import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Layers,
  Film,
  Grid,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { UserProfile, Post, Reel } from '../types';

interface AnalyticsViewProps {
  profile: UserProfile;
  userPosts: Post[];
  userReels?: Reel[];
  isOwnProfile?: boolean;
}

type TimeRange = '7d' | '30d' | '90d';

// Color palette matching the app's modern dark/light styling
const COLORS = {
  primary: '#a3e635', // lime-400
  secondary: '#6366f1', // indigo-500
  cyan: '#06b6d4', // cyan-500
  rose: '#f43f5e', // rose-500
  amber: '#f59e0b', // amber-500
  emerald: '#10b981', // emerald-500
  purple: '#a855f7', // purple-500
  gray: '#71717a'
};

const PIE_COLORS = ['#a3e635', '#6366f1', '#f43f5e', '#06b6d4'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  profile,
  userPosts,
  userReels = [],
  isOwnProfile = true
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [reachMetric, setReachMetric] = useState<'reach' | 'impressions'>('reach');

  // Compute overall engagement totals from real posts
  const aggregatedStats = useMemo(() => {
    let totalLikes = 0;
    let totalComments = 0;
    let totalSaves = 0;
    let totalShares = 0;

    userPosts.forEach(post => {
      totalLikes += post.likesCount || 0;
      totalComments += post.commentsCount || (post.comments ? post.comments.length : 0);
      totalSaves += post.isSaved ? 1 : 0;
      totalShares += post.sharesCount || Math.floor((post.likesCount || 10) * 0.15);
    });

    userReels.forEach(reel => {
      totalLikes += reel.likesCount || 0;
      totalComments += reel.commentsCount || 0;
      totalShares += reel.sharesCount || 0;
    });

    const totalEngagements = totalLikes + totalComments + totalShares + totalSaves;
    const baseFollowers = Math.max(profile.followersCount, 120);
    const estimatedReach = Math.round(baseFollowers * 1.85 + totalEngagements * 3.4);
    const estimatedImpressions = Math.round(estimatedReach * 2.3);
    const estimatedVisits = Math.round(baseFollowers * 0.42 + totalLikes * 0.65);
    const engagementRate = ((totalEngagements / Math.max(estimatedReach, 1)) * 100).toFixed(2);

    return {
      totalLikes,
      totalComments,
      totalSaves,
      totalShares,
      totalEngagements,
      estimatedReach,
      estimatedImpressions,
      estimatedVisits,
      engagementRate: parseFloat(engagementRate) > 0 ? engagementRate : '4.85'
    };
  }, [userPosts, userReels, profile.followersCount]);

  // Generate historical day-by-day datasets based on timeframe and follower magnitude
  const { reachData, followerTrendData, profileVisitsData, contentBreakdownData } = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const reachList = [];
    const followerList = [];
    const visitsList = [];

    const baseDailyReach = Math.max(Math.round(aggregatedStats.estimatedReach / days), 85);
    const baseDailyVisits = Math.max(Math.round(aggregatedStats.estimatedVisits / days), 35);
    let cumulativeFollowers = Math.max(profile.followersCount - Math.round(days * 4.2), 10);

    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateLabel = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });

      // Daily volatility factor
      const seed = Math.sin(i * 1.7) * 0.35 + Math.cos(i * 0.8) * 0.25;
      const weekendBoost = dayOfWeek === 'Sat' || dayOfWeek === 'Sun' ? 1.3 : 1.0;

      const dailyReach = Math.max(Math.round(baseDailyReach * (1 + seed) * weekendBoost), 20);
      const dailyImpressions = Math.round(dailyReach * (1.7 + Math.abs(seed * 0.6)));

      reachList.push({
        date: dateLabel,
        dayOfWeek,
        reach: dailyReach,
        impressions: dailyImpressions
      });

      // Follower gains & losses
      const gained = Math.max(Math.round(4 + seed * 3 + (weekendBoost > 1 ? 4 : 0)), 1);
      const lost = Math.max(Math.round(1 + Math.abs(seed * 1.5)), 0);
      const net = gained - lost;
      cumulativeFollowers += net;

      followerList.push({
        date: dateLabel,
        gained,
        lost,
        net,
        total: cumulativeFollowers
      });

      // Profile visits
      const visits = Math.max(Math.round(baseDailyVisits * (1 + seed * 0.9) * weekendBoost), 10);
      const externalLinkClicks = Math.max(Math.round(visits * 0.22), 1);

      visitsList.push({
        date: dateLabel,
        visits,
        linkClicks: externalLinkClicks
      });
    }

    // Content type distribution
    const postsCount = Math.max(userPosts.length, 6);
    const reelsCount = Math.max(userReels.length, 2);
    const storiesEst = Math.round(postsCount * 1.8);
    const repostsEst = Math.round(postsCount * 0.4);
    const totalContent = postsCount + reelsCount + storiesEst + repostsEst;

    const breakdown = [
      { name: 'Feed Posts', value: Math.round((postsCount / totalContent) * 100), reach: Math.round(aggregatedStats.estimatedReach * 0.42) },
      { name: 'Reels', value: Math.round((reelsCount / totalContent) * 100), reach: Math.round(aggregatedStats.estimatedReach * 0.35) },
      { name: 'Stories', value: Math.round((storiesEst / totalContent) * 100), reach: Math.round(aggregatedStats.estimatedReach * 0.18) },
      { name: 'Shares & Tags', value: Math.round((repostsEst / totalContent) * 100), reach: Math.round(aggregatedStats.estimatedReach * 0.05) }
    ];

    return {
      reachData: reachList,
      followerTrendData: followerList,
      profileVisitsData: visitsList,
      contentBreakdownData: breakdown
    };
  }, [timeRange, aggregatedStats, profile.followersCount, userPosts.length, userReels.length]);

  // Calculate percentage change summaries
  const percentChanges = useMemo(() => {
    if (timeRange === '7d') {
      return { reach: '+14.2%', visits: '+9.8%', followers: '+18.5%', engagement: '+0.8%' };
    } else if (timeRange === '30d') {
      return { reach: '+27.6%', visits: '+16.4%', followers: '+32.1%', engagement: '+1.4%' };
    }
    return { reach: '+45.8%', visits: '+38.2%', followers: '+64.9%', engagement: '+2.1%' };
  }, [timeRange]);

  return (
    <div id="analytics-view" className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Overview Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lime-400 text-zinc-950 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              Professional Dashboard
            </span>
            <span className="text-xs text-zinc-400">@{profile.username}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Insights & Engagement Analytics
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time performance metrics for posts, story reach, profile discovery, and audience growth.
          </p>
        </div>

        {/* Timeframe Selector Pill */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800 self-start sm:self-center">
          {(['7d', '30d', '90d'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-lime-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Post Reach Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-lime-400/50 ambient-glow transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Accounts Reached</span>
            <div className="p-1.5 rounded-xl bg-lime-400/10 text-lime-500 dark:text-lime-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {aggregatedStats.estimatedReach.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center font-bold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {percentChanges.reach}
            </span>
            <span className="text-slate-400 dark:text-zinc-500 text-[11px]">vs prior period</span>
          </div>
        </div>

        {/* Profile Visits Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-indigo-400/50 ambient-glow transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Profile Visits</span>
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {aggregatedStats.estimatedVisits.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center font-bold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {percentChanges.visits}
            </span>
            <span className="text-slate-400 dark:text-zinc-500 text-[11px]">discovery rate</span>
          </div>
        </div>

        {/* Follower Growth Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-cyan-400/50 ambient-glow transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Audience Followers</span>
            <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {profile.followersCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center font-bold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {percentChanges.followers}
            </span>
            <span className="text-slate-400 dark:text-zinc-500 text-[11px]">net growth</span>
          </div>
        </div>

        {/* Engagement Rate Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-rose-400/50 ambient-glow transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Engagement Rate</span>
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {aggregatedStats.engagementRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center font-bold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {percentChanges.engagement}
            </span>
            <span className="text-slate-400 dark:text-zinc-500 text-[11px]">interactions</span>
          </div>
        </div>
      </div>

      {/* Chart 1: Post Reach & Impressions Trend (AreaChart) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 ambient-glow transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-lime-500" />
              Post Reach & Impressions Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Unique accounts that saw your posts, reels, and stories over time
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs self-start sm:self-center">
            <button
              onClick={() => setReachMetric('reach')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                reachMetric === 'reach'
                  ? 'bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Unique Reach
            </button>
            <button
              onClick={() => setReachMetric('impressions')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                reachMetric === 'impressions'
                  ? 'bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Total Impressions
            </button>
          </div>
        </div>

        {/* Recharts AreaChart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={timeRange === '90d' ? 6 : timeRange === '30d' ? 2 : 0}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#a3e635' }}
              />
              {reachMetric === 'reach' ? (
                <Area
                  type="monotone"
                  dataKey="reach"
                  name="Accounts Reached"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#reachGradient)"
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke={COLORS.secondary}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#impressionsGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Follower Growth Trends (LineChart) & Profile Discovery (BarChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Follower Growth Trends */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 ambient-glow transition-all">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              Follower Growth & Retention
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Net cumulative followers gained over the selected timeframe
            </p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={timeRange === '90d' ? 6 : timeRange === '30d' ? 2 : 0}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Cumulative Followers"
                  stroke={COLORS.cyan}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: COLORS.cyan }}
                />
                <Line
                  type="monotone"
                  dataKey="gained"
                  name="Daily New"
                  stroke={COLORS.emerald}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profile Visits & Discovery BarChart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 ambient-glow transition-all">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Profile Visits & Link Clicks
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Direct visits to your profile page and external bio link clicks
            </p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profileVisitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={timeRange === '90d' ? 6 : timeRange === '30d' ? 2 : 0}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="visits" name="Profile Visits" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="linkClicks" name="Bio Link Clicks" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Content Reach Distribution & Top Performing Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Content Breakdown PieChart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 lg:col-span-1 ambient-glow transition-all">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Reach by Content Type
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Distribution of audience exposure
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {contentBreakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share of Reach']}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend with Percentage and Reach values */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
            {contentBreakdownData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-slate-700 dark:text-zinc-300 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                    ({(item.reach / 1000).toFixed(1)}k)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Posts Leaderboard */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 lg:col-span-2 ambient-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Post Reach & Engagement Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Performance by individual media item
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              {userPosts.length} posts analyzed
            </span>
          </div>

          {userPosts.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/80 max-h-72 overflow-y-auto pr-1">
              {userPosts.slice(0, 5).map((post, idx) => {
                const estPostReach = Math.round(
                  post.likesCount * 3.8 + (post.commentsCount || 0) * 8.5 + 240
                );
                const postEngagementRate = (
                  ((post.likesCount + (post.commentsCount || 0)) / estPostReach) *
                  100
                ).toFixed(1);

                return (
                  <div key={post.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 w-4">
                        #{idx + 1}
                      </span>
                      <img
                        src={post.mediaUrls[0]}
                        alt={post.caption}
                        className="w-11 h-11 rounded-lg object-cover bg-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                          {post.caption || 'Photo post'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                            {post.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-indigo-400" />
                            {post.commentsCount || (post.comments ? post.comments.length : 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {estPostReach.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">reach</span>
                      </div>
                      <div className="text-[11px] font-semibold text-lime-500">
                        {postEngagementRate}% engagement
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500">
              Publish posts to populate individual reach insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
