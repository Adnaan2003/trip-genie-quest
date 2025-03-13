
import React, { useState } from 'react';
import TravelForm from '@/components/TravelForm';
import TravelResult from '@/components/TravelResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TravelFormData } from '@/types/travel';
import { generateTravelPlan, GeminiResponse } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Plane, Globe, MapPin, Calendar, Clock, Users } from 'lucide-react';

const Index = () => {
  const [formData, setFormData] = useState<TravelFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: TravelFormData) => {
    setLoading(true);
    setFormData(data);
    
    try {
      const response = await generateTravelPlan(data);
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        setResult(null);
      } else {
        setResult(response);
        toast({
          title: "Success!",
          description: "Your travel plan has been created",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error(error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50 via-white to-blue-50"></div>
        <div className="travel-decoration" style={{ top: '10%', right: '5%', '--color-start': '#e0f2fe', '--color-end': '#bae6fd' } as React.CSSProperties}></div>
        <div className="travel-decoration" style={{ bottom: '10%', left: '5%', '--color-start': '#dbeafe', '--color-end': '#93c5fd' } as React.CSSProperties}></div>
        <div className="travel-decoration" style={{ top: '40%', left: '20%', '--color-start': '#f0fdfa', '--color-end': '#99f6e4' } as React.CSSProperties}></div>
        
        {/* Decorative icons */}
        <div className="absolute top-[15%] left-[10%] travel-icon">
          <Plane className="text-travel-300 w-6 h-6" />
        </div>
        <div className="absolute top-[70%] right-[15%] travel-icon">
          <Globe className="text-travel-300 w-8 h-8" />
        </div>
        <div className="absolute bottom-[20%] left-[25%] travel-icon">
          <MapPin className="text-travel-300 w-5 h-5" />
        </div>
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto mb-10 mt-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-travel-200 to-travel-400 blur-md opacity-70"></div>
              <Globe className="relative text-travel-600 w-12 h-12 animate-pulse-slow" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight animate-fade-up bg-clip-text text-transparent bg-gradient-to-r from-travel-800 to-travel-600">
            Trip<span className="font-extrabold">Genie</span>
          </h1>
          <p className="mt-3 text-gray-600 animate-fade-up max-w-xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Your AI-powered travel companion that crafts personalized adventures tailored just for you
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-travel-100 blur-md animate-pulse"></div>
              <LoadingSpinner size="lg" />
            </div>
            <p className="text-gray-600 animate-fade-up" style={{ animationDelay: '0.2s' }}>Creating your customized travel experience...</p>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />Finding locations</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />Planning schedule</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center"><Users className="w-3 h-3 mr-1" />Personalizing</span>
            </div>
          </div>
        ) : result && formData ? (
          <TravelResult 
            recommendations={result.recommendations} 
            formData={formData}
            onBack={handleReset}
          />
        ) : (
          <TravelForm 
            onSubmit={handleSubmit} 
            isLoading={loading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto py-6 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-1">
          <Clock className="w-3 h-3" />
          <p>Plans generated in seconds with Gemini 1.5 Flash • Created with Lovable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
