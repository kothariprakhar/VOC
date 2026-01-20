import React from 'react';
import { Review, Source, Category, Sentiment } from '../types';
import { MessageSquare, Twitter, Rocket, AlertCircle, CheckCircle, MinusCircle, Bug, Lightbulb, ThumbsUp } from 'lucide-react';

interface Props {
  reviews: Review[];
}

const ReviewFeed: React.FC<Props> = ({ reviews }) => {

  const getSourceIcon = (source: Source) => {
    switch (source) {
      case Source.TWITTER: return <Twitter className="w-4 h-4 text-sky-400" />;
      case Source.REDDIT: return <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">R</div>;
      case Source.PRODUCT_HUNT: return <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">P</div>;
      default: return <MessageSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.POSITIVE: return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case Sentiment.NEGATIVE: return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <MinusCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryBadge = (cat: Category) => {
    switch (cat) {
      case Category.BUG: return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20"><Bug className="w-3 h-3" /> Bug</span>;
      case Category.FEATURE: return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20"><Lightbulb className="w-3 h-3" /> Feature</span>;
      case Category.PRAISE: return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20"><ThumbsUp className="w-3 h-3" /> Praise</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs">General</span>;
    }
  };

  return (
    <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
      {reviews.map((review) => (
        <div key={review.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getSourceIcon(review.source)}
              <span className="text-sm font-medium text-slate-300">@{review.author}</span>
              <span className="text-xs text-slate-500">• {review.date}</span>
            </div>
            <div className="flex items-center gap-3">
              {getCategoryBadge(review.category)}
              {getSentimentIcon(review.sentiment)}
            </div>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed mb-3">
            "{review.content}"
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
               <ThumbsUp className="w-3 h-3" /> {review.likes} likes
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewFeed;
