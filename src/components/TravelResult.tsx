
import React, { useState, useEffect, useRef } from 'react';
import { TravelRecommendation, TravelFormData } from '@/types/travel';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Users, Wallet, ChevronLeft, Hotel, Mountain, Camera, Utensils, Landmark, Train, Bus, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [tripDuration, setTripDuration] = useState<string>('');
  
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tripContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to active section on mobile
    const currentRef = sectionRefs.current[activeSection];
    if (currentRef && window.innerWidth < 1024) {
      currentRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  // Calculate trip duration
  useEffect(() => {
    setTripDuration(getDuration());
  }, [formData]);

  // Calculate trip duration
  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return '';
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };
  
  // Check if a section is about a specific category
  const getSectionType = (title: string): 'food' | 'places' | 'hotels' | 'nature' | 'transport' | 'normal' => {
    const foodKeywords = ['food', 'dining', 'restaurant', 'cuisine', 'dish'];
    const placesKeywords = ['attraction', 'place', 'visit', 'sight', 'landmark', 'museum', 'photography', 'spot'];
    const hotelKeywords = ['hotel', 'accommodation', 'stay', 'resort', 'lodge', 'hostel'];
    const natureKeywords = ['nature', 'park', 'waterfall', 'beach', 'mountain', 'natural', 'outdoor', 'lake', 'river', 'forest'];
    const transportKeywords = ['transport', 'train', 'bus', 'travel', 'route', 'journey', 'railway', 'transit', 'commute'];
    
    const lowerTitle = title.toLowerCase();
    
    if (foodKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'food';
    }
    
    if (hotelKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'hotels';
    }
    
    if (natureKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'nature';
    }
    
    if (transportKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'transport';
    }
    
    if (placesKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'places';
    }
    
    return 'normal';
  };
  
  // Get icon for section
  const getSectionIcon = (title: string) => {
    const type = getSectionType(title);
    const lowerTitle = title.toLowerCase();
    
    switch (type) {
      case 'food':
        return <Utensils className="w-4 h-4 mr-2 text-amber-500" />;
      case 'places':
        return <Landmark className="w-4 h-4 mr-2 text-blue-500" />;
      case 'hotels':
        return <Hotel className="w-4 h-4 mr-2 text-indigo-500" />;
      case 'nature':
        return <Mountain className="w-4 h-4 mr-2 text-emerald-500" />;
      case 'transport':
        if (lowerTitle.includes('train')) {
          return <Train className="w-4 h-4 mr-2 text-purple-500" />;
        } else if (lowerTitle.includes('bus')) {
          return <Bus className="w-4 h-4 mr-2 text-purple-500" />;
        } else {
          return <Train className="w-4 h-4 mr-2 text-purple-500" />;
        }
      default:
        if (lowerTitle.includes('shopping')) {
          return <Camera className="w-4 h-4 mr-2 text-purple-500" />;
        } else if (lowerTitle.includes('photo') || lowerTitle.includes('camera')) {
          return <Camera className="w-4 h-4 mr-2 text-cyan-500" />;
        } else if (lowerTitle.includes('train') || lowerTitle.includes('railway')) {
          return <Train className="w-4 h-4 mr-2 text-purple-500" />;
        } else if (lowerTitle.includes('bus') || lowerTitle.includes('coach')) {
          return <Bus className="w-4 h-4 mr-2 text-purple-500" />;
        }
        return <span className="w-4 h-4 mr-2"></span>;
    }
  };

  return (
    <div className="w-full max-w-5xl animate-fade-up" ref={tripContainerRef}>
      <GlassCard className="p-8 mb-6 relative overflow-hidden" variant="elevated">
        <div className="absolute top-0 left-0 w-full h-1">
          <div className="bg-gradient-to-r from-travel-400 to-travel-600 h-full w-full"></div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="text-center mb-2">
            <span className="bg-travel-100 text-travel-800 text-xs py-1 px-3 rounded-full font-medium animate-pulse-slow">
              {tripDuration} Journey
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-travel-800 to-travel-600 animate-fade-in">
            {formData.source} to {formData.destination}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
              <span className="flex items-center">
                <IndianRupee className="w-3 h-3 mr-1" />
                {formData.budget.replace(/^₹\s?/, '')}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard className="p-0 overflow-hidden sticky top-6 travel-card-hover">
            <div className="p-4 bg-gradient-to-r from-travel-50 to-travel-100 border-b border-travel-200">
              <h3 className="font-medium text-travel-800 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Journey Details
              </h3>
            </div>
            <nav className="p-2">
              {recommendations.map((rec, index) => {
                const sectionType = getSectionType(rec.title);
                return (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg text-sm mb-1 transition-all flex items-center animate-fade-in",
                      activeSection === index && sectionType === 'food' 
                        ? "bg-amber-100 text-amber-800 font-medium"
                        : activeSection === index && sectionType === 'places'
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : activeSection === index && sectionType === 'hotels'
                            ? "bg-indigo-100 text-indigo-800 font-medium"
                            : activeSection === index && sectionType === 'nature'
                              ? "bg-emerald-100 text-emerald-800 font-medium"
                              : activeSection === index
                                ? "bg-travel-100 text-travel-800 font-medium"
                                : "hover:bg-gray-100"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs",
                      activeSection === index && sectionType === 'food'
                        ? "bg-amber-500 text-white"
                        : activeSection === index && sectionType === 'places'
                          ? "bg-blue-500 text-white"
                          : activeSection === index && sectionType === 'hotels'
                            ? "bg-indigo-500 text-white"
                            : activeSection === index && sectionType === 'nature'
                              ? "bg-emerald-500 text-white"
                              : activeSection === index
                                ? "bg-travel-500 text-white"
                                : "bg-gray-100"
                    )}>
                      {index + 1}
                    </span>
                    <span className="line-clamp-1 flex items-center">
                      {getSectionIcon(rec.title)}
                      {rec.title}
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={onBack}
                className="btn-secondary w-full flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Create Another Journey
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => {
              const sectionType = getSectionType(rec.title);
              return (
                <div
                  key={index}
                  id={`section-${index}`}
                  ref={el => sectionRefs.current[index] = el}
                  className={cn(
                    "transition-all duration-300",
                    index === activeSection ? "opacity-100" : "hidden lg:block lg:opacity-40"
                  )}
                >
                  <GlassCard 
                    className="p-6 travel-card-hover" 
                    highlight={sectionType}
                    variant="elevated"
                  >
                    <h2 className="text-xl font-medium text-gray-900 mb-4 section-title flex items-center">
                      {getSectionIcon(rec.title)}
                      {rec.title}
                    </h2>
                    <div className="prose prose-blue max-w-none mt-6">
                      {rec.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                          {line.replace(/\*\*/g, '')}
                        </p>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              );
            })
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
