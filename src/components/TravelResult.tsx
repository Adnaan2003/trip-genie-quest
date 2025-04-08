
import React, { useState, useEffect, useRef } from 'react';
import { TravelRecommendation, TravelFormData } from '@/types/travel';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Users, Wallet, ChevronLeft, Share2, Download, Bookmark, Heart, Utensils, Landmark, Hotel, Mountain, Camera, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const getSectionType = (title: string): 'food' | 'places' | 'hotels' | 'nature' | 'normal' => {
    const foodKeywords = ['food', 'dining', 'restaurant', 'cuisine', 'dish'];
    const placesKeywords = ['attraction', 'place', 'visit', 'sight', 'landmark', 'museum', 'photography', 'spot'];
    const hotelKeywords = ['hotel', 'accommodation', 'stay', 'resort', 'lodge', 'hostel'];
    const natureKeywords = ['nature', 'park', 'waterfall', 'beach', 'mountain', 'natural', 'outdoor', 'lake', 'river', 'forest'];
    
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
    
    if (placesKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'places';
    }
    
    return 'normal';
  };
  
  // Get icon for section
  const getSectionIcon = (title: string) => {
    const type = getSectionType(title);
    
    switch (type) {
      case 'food':
        return <Utensils className="w-4 h-4 mr-2 text-amber-500" />;
      case 'places':
        return <Landmark className="w-4 h-4 mr-2 text-blue-500" />;
      case 'hotels':
        return <Hotel className="w-4 h-4 mr-2 text-indigo-500" />;
      case 'nature':
        return <Mountain className="w-4 h-4 mr-2 text-emerald-500" />;
      default:
        if (title.toLowerCase().includes('shopping')) {
          return <ShoppingCart className="w-4 h-4 mr-2 text-purple-500" />;
        } else if (title.toLowerCase().includes('photo') || title.toLowerCase().includes('camera')) {
          return <Camera className="w-4 h-4 mr-2 text-cyan-500" />;
        }
        return <span className="w-4 h-4 mr-2"></span>;
    }
  };
  
  const handleAction = async (action: string) => {
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
        try {
          setShowActionTooltip('sharing');
          
          // Create the text to share
          const title = `My ${tripDuration} Journey: ${formData.source} to ${formData.destination}`;
          const text = `Check out my amazing travel plan from ${formData.source} to ${formData.destination} for ${tripDuration}! Created with JourneyTrip.`;
          const url = window.location.href;
          
          // Check if the Web Share API is available
          if (navigator.share) {
            await navigator.share({
              title,
              text,
              url
            });
            setShowActionTooltip('shared');
            toast({
              title: "Shared Successfully",
              description: "Your journey details have been shared!",
            });
          } else {
            // Fallback - copy to clipboard
            await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${url}`);
            setShowActionTooltip('copied');
            toast({
              title: "Copied to Clipboard",
              description: "Your journey details have been copied to clipboard. You can now share it manually.",
            });
          }
        } catch (error) {
          console.error('Error sharing:', error);
          toast({
            title: "Sharing Failed",
            description: "Unable to share your journey. Please try again.",
            variant: "destructive",
          });
          setShowActionTooltip(null);
        }
        break;
      case 'download':
        try {
          setShowActionTooltip('downloading');
          
          if (!tripContainerRef.current) {
            toast({
              title: "Download Failed",
              description: "Could not generate PDF. Please try again.",
              variant: "destructive",
            });
            setShowActionTooltip(null);
            return;
          }
          
          // Display a toast to inform the user about the download process
          toast({
            title: "Preparing Download",
            description: "We're generating your PDF. This may take a moment...",
          });
          
          // Generate PDF
          setTimeout(async () => {
            try {
              const tripElement = tripContainerRef.current as HTMLElement;
              const canvas = await html2canvas(tripElement, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
              });
              
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
              });
              
              // Calculate the width and height to maintain aspect ratio
              const imgWidth = 210; // A4 width in mm
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
              
              // Add trip details as text
              pdf.setFontSize(12);
              const y = imgHeight + 10;
              pdf.text(`Journey: ${formData.source} to ${formData.destination}`, 10, y);
              pdf.text(`Duration: ${tripDuration}`, 10, y + 7);
              pdf.text(`Dates: ${formData.startDate} to ${formData.endDate}`, 10, y + 14);
              pdf.text(`Travelers: ${formData.travelers}`, 10, y + 21);
              pdf.text(`Budget: ${formData.budget}`, 10, y + 28);
              
              // Add recommendations as text
              pdf.setFontSize(14);
              pdf.text('Travel Recommendations', 10, y + 40);
              pdf.setFontSize(10);
              
              let textY = y + 47;
              recommendations.forEach((rec, i) => {
                // Add a new page if we're getting close to the bottom
                if (textY > 280) {
                  pdf.addPage();
                  textY = 20;
                }
                
                pdf.setFontSize(12);
                pdf.text(`${i + 1}. ${rec.title}`, 10, textY);
                textY += 7;
                
                pdf.setFontSize(10);
                const contentLines = pdf.splitTextToSize(rec.content, 190);
                pdf.text(contentLines, 10, textY);
                textY += contentLines.length * 5 + 10;
              });
              
              // Save the PDF
              pdf.save(`Journey_${formData.source}_to_${formData.destination}.pdf`);
              
              setShowActionTooltip('downloaded');
              toast({
                title: "Download Complete",
                description: "Your journey plan has been downloaded as a PDF.",
              });
            } catch (err) {
              console.error('PDF generation error:', err);
              toast({
                title: "Download Failed",
                description: "Unable to generate PDF. Please try again.",
                variant: "destructive",
              });
              setShowActionTooltip(null);
            }
          }, 500);
        } catch (error) {
          console.error('Error downloading:', error);
          toast({
            title: "Download Failed",
            description: "Unable to create PDF. Please try again.",
            variant: "destructive",
          });
          setShowActionTooltip(null);
        }
        break;
    }
    
    if (showActionTooltip) {
      setTimeout(() => setShowActionTooltip(null), 2000);
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
            <span className="bg-travel-100 text-travel-800 text-xs py-1 px-3 rounded-full font-medium">
              {tripDuration} Journey
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
              {showActionTooltip === 'saved' && 'Saved to your journeys!'}
              {showActionTooltip === 'sharing' && 'Opening share options...'}
              {showActionTooltip === 'shared' && 'Successfully shared!'}
              {showActionTooltip === 'copied' && 'Copied to clipboard!'}
              {showActionTooltip === 'downloading' && 'Preparing your PDF...'}
              {showActionTooltip === 'downloaded' && 'PDF downloaded!'}
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
                      "w-full text-left p-3 rounded-lg text-sm mb-1 transition-all flex items-center",
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
                className="btn-secondary w-full flex items-center justify-center"
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
                        <p key={i} className="mb-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>{line}</p>
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
