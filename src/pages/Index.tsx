import React, { useState } from 'react';
import TravelForm from '@/components/TravelForm';
import TravelResult from '@/components/TravelResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TravelFormData } from '@/types/travel';
import { generateTravelPlan, GeminiResponse } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';

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
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-travel-50 via-white to-gray-100"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-travel-100 rounded-full filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto mb-10 mt-4">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight animate-fade-up">
            Trip<span className="text-travel-600">Genie</span>
          </h1>
          <p className="mt-3 text-gray-600 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Your AI-powered travel planning assistant
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Creating your personalized travel plan...</p>
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
        <p>Powered by Gemini 1.5 Flash • Created with Lovable</p>
      </footer>
    </div>
  );
};

export default Index;
