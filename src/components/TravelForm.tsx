
import React, { useState } from 'react';
import { TravelFormData } from '@/types/travel';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.source) return setError('Please enter your departure location');
    if (!formData.destination) return setError('Please enter your destination');
    if (!formData.startDate) return setError('Please enter your start date');
    if (!formData.endDate) return setError('Please enter your end date');
    if (!formData.budget) return setError('Please enter your budget');
    
    onSubmit(formData);
  };

  return (
    <GlassCard className="w-full max-w-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-medium text-center text-gray-900">Plan Your Perfect Trip</h1>
          <p className="text-center text-gray-600">
            Our AI-powered travel assistant will create a personalized itinerary just for you
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">
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
        </div>

        <div className="space-y-2">
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
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

        <button
          type="submit"
          className={cn(
            "btn-primary w-full transition-all duration-300",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
          disabled={isLoading}
        >
          {isLoading ? "Creating Your Plan..." : "Generate Travel Plan"}
        </button>
      </form>
    </GlassCard>
  );
};

export default TravelForm;
