
import React, { useState, useEffect, useRef } from 'react';
import { TravelRecommendation, TravelFormData } from '@/types/travel';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Users, Wallet, ChevronLeft, Share2, Download, Bookmark, Heart } from 'lucide-react';

interface TravelResultProps {
  recommendations: TravelRecommendation[];
  formData: TravelFormData;
  onBack: () => void;
}

const TravelResult: React.FC<TravelResultProps> = ({
  recommendations,
  formData,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [showActionTooltip, setShowActionTooltip] = useState<string | null>(null);
  
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    // Scroll to active section on mobile
    const currentRef = sectionRefs.current[activeSection];
    if (currentRef && window.innerWidth < 1024) {
      currentRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  // Calculate trip duration
  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return '';
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };
  
  const handleAction = (action: string) => {
    switch (action) {
      case 'like':
        setLiked(!liked);
        setShowActionTooltip(liked ? null : 'liked');
        break;
      case 'bookmark':
        setBookmarked(!bookmarked);
        setShowActionTooltip(bookmarked ? null : 'saved');
        break;
      case 'share':
        setShowActionTooltip('shared');
        // In a real app, this would trigger share functionality
        break;
      case 'download':
        setShowActionTooltip('downloaded');
        // In a real app, this would trigger download functionality
        break;
    }
    
    if (showActionTooltip) {
      setTimeout(() => setShowActionTooltip(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl animate-fade-up">
      <GlassCard className="p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1">
          <div className="bg-gradient-to-r from-travel-400 to-travel-600 h-full w-full"></div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="text-center mb-2">
            <span className="bg-travel-100 text-travel-800 text-xs py-1 px-3 rounded-full font-medium">
              {getDuration()} Trip
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-travel-800 to-travel-600">
            {formData.source} to {formData.destination}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-travel-500" />
              <span>{formData.startDate} — {formData.endDate}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-travel-500" />
              <span>{formData.travelers} traveler{Number(formData.travelers) !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-travel-500" />
              <span>Budget: {formData.budget}</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-3 pt-4">
            <button 
              onClick={() => handleAction('like')}
              className={cn(
                "p-2 rounded-full transition-all", 
                liked ? "bg-pink-100 text-pink-500" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
              aria-label="Like"
            >
              <Heart className={cn("w-5 h-5", liked && "fill-current")} />
            </button>
            <button 
              onClick={() => handleAction('bookmark')}
              className={cn(
                "p-2 rounded-full transition-all", 
                bookmarked ? "bg-travel-100 text-travel-600" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
              aria-label="Save"
            >
              <Bookmark className={cn("w-5 h-5", bookmarked && "fill-current")} />
            </button>
            <button 
              onClick={() => handleAction('share')}
              className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleAction('download')}
              className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all"
              aria-label="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          
          {showActionTooltip && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded animate-fade-up">
              {showActionTooltip === 'liked' && 'Added to favorites!'}
              {showActionTooltip === 'saved' && 'Saved to your trips!'}
              {showActionTooltip === 'shared' && 'Sharing options would appear here'}
              {showActionTooltip === 'downloaded' && 'Downloading your trip details!'}
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard className="p-0 overflow-hidden sticky top-6 travel-card-hover">
            <div className="p-4 bg-gradient-to-r from-travel-50 to-travel-100 border-b border-travel-200">
              <h3 className="font-medium text-travel-800 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Trip Details
              </h3>
            </div>
            <nav className="p-2">
              {recommendations.map((rec, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg text-sm mb-1 transition-all flex items-center",
                    activeSection === index
                      ? "bg-travel-100 text-travel-800 font-medium"
                      : "hover:bg-gray-100"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs",
                    activeSection === index
                      ? "bg-travel-500 text-white"
                      : "bg-gray-100"
                  )}>
                    {index + 1}
                  </span>
                  <span className="line-clamp-1">{rec.title}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={onBack}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Create Another Plan
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div
                key={index}
                id={`section-${index}`}
                ref={el => sectionRefs.current[index] = el}
                className={cn(
                  "transition-all duration-300",
                  index === activeSection ? "opacity-100" : "hidden lg:block lg:opacity-40"
                )}
              >
                <GlassCard className="p-6 travel-card-hover">
                  <h2 className="text-xl font-medium text-gray-900 mb-4 section-title">{rec.title}</h2>
                  <div className="prose prose-blue max-w-none mt-6">
                    {rec.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>{line}</p>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ))
          ) : (
            <GlassCard className="p-6">
              <p className="text-center text-gray-500">No recommendations available</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelResult;
