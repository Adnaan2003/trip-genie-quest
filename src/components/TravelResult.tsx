
import React, { useState } from 'react';
import { TravelRecommendation, TravelFormData } from '@/types/travel';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';

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

  // Calculate trip duration
  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return '';
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <div className="w-full max-w-4xl animate-fade-up">
      <GlassCard className="p-8 mb-6">
        <div className="flex flex-col space-y-4">
          <div className="text-center mb-2">
            <span className="bg-travel-100 text-travel-800 text-xs py-1 px-3 rounded-full font-medium">
              {getDuration()} Trip
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium text-center">
            {formData.source} to {formData.destination}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div>{formData.startDate} — {formData.endDate}</div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div>{formData.travelers} traveler{Number(formData.travelers) !== 1 ? 's' : ''}</div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div>Budget: {formData.budget}</div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard className="p-0 overflow-hidden sticky top-6">
            <div className="p-4 bg-travel-50 border-b border-travel-100">
              <h3 className="font-medium text-travel-800">Trip Details</h3>
            </div>
            <nav className="p-2">
              {recommendations.map((rec, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg text-sm mb-1 transition-all",
                    activeSection === index
                      ? "bg-travel-100 text-travel-800 font-medium"
                      : "hover:bg-gray-100"
                  )}
                >
                  {rec.title}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={onBack}
                className="btn-secondary w-full"
              >
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
                className={cn(
                  "transition-all duration-300",
                  index === activeSection ? "opacity-100" : "hidden lg:block lg:opacity-40"
                )}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">{rec.title}</h2>
                  <div className="prose prose-blue max-w-none">
                    {rec.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-3">{line}</p>
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
