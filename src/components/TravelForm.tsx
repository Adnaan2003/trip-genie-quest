
import React, { useState } from 'react';
import { TravelFormData } from '@/types/travel';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Wallet, Users, Compass, PlaneTakeoff } from 'lucide-react';

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  isLoading: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    interests: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    setError(null);
    
    // Validate current step
    if (formStep === 0) {
      if (!formData.source) return setError('Please enter your departure location');
      if (!formData.destination) return setError('Please enter your destination');
    } else if (formStep === 1) {
      if (!formData.startDate) return setError('Please enter your start date');
      if (!formData.endDate) return setError('Please enter your end date');
      
      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) return setError('End date must be after start date');
    }
    
    setFormStep(prev => prev + 1);
  };

  const prevStep = () => {
    setFormStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Final validation
    if (!formData.budget) return setError('Please enter your budget');
    
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (formStep) {
      case 0:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-center text-gray-900">Where are you traveling?</h2>
              <p className="text-center text-gray-600">Let's start with your locations</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="source" className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-travel-500" />
                  Departure From
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  placeholder="City, Country"
                  value={formData.source}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="destination" className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-travel-500" />
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="City, Country"
                  value={formData.destination}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary w-full"
                disabled={isLoading}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-center text-gray-900">When are you traveling?</h2>
              <p className="text-center text-gray-600">Select your travel dates</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-travel-500" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-travel-500" />
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary w-1/2"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary w-1/2"
                disabled={isLoading}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-center text-gray-900">Trip Details</h2>
              <p className="text-center text-gray-600">Just a few more details to personalize your trip</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="budget" className="flex items-center text-sm font-medium text-gray-700">
                  <Wallet className="w-4 h-4 mr-2 text-travel-500" />
                  Budget
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  placeholder="e.g. $3000"
                  value={formData.budget}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="travelers" className="flex items-center text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-travel-500" />
                  Number of Travelers
                </label>
                <select
                  id="travelers"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                  <option value="10+">10+</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="interests" className="flex items-center text-sm font-medium text-gray-700">
                  <Compass className="w-4 h-4 mr-2 text-travel-500" />
                  Interests
                </label>
                <textarea
                  id="interests"
                  name="interests"
                  rows={3}
                  placeholder="e.g. Food, history, hiking, beaches, local culture..."
                  value={formData.interests}
                  onChange={handleChange}
                  className="form-input resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary w-1/2"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn-primary w-1/2 group"
                disabled={isLoading}
              >
                <span className="group-hover:mr-2 transition-all">Generate Travel Plan</span>
                <PlaneTakeoff className="w-4 h-4 inline-block opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-8 group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <React.Fragment key={index}>
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                index <= formStep 
                  ? "bg-travel-500 text-white" 
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div 
                className={cn(
                  "flex-1 h-1 mx-2 transition-all", 
                  index < formStep ? "bg-travel-500" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <GlassCard className="w-full max-w-xl p-8">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {renderProgressBar()}
        
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-center">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
            {error}
          </div>
        )}
        
        {renderStep()}
      </form>
    </GlassCard>
  );
};

export default TravelForm;
