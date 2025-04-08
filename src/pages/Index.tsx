
import React, { useState, useEffect } from 'react';
import TravelForm from '@/components/TravelForm';
import TravelResult from '@/components/TravelResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TravelFormData } from '@/types/travel';
import { generateTravelPlan, GeminiResponse } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Plane, Globe, MapPin, Calendar, Clock, Users, Mountain, Utensils, Hotel, Camera } from 'lucide-react';

const Index = () => {
  const [formData, setFormData] = useState<TravelFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  // Track mouse position for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
          description: "Your journey plan has been created",
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
      {/* Interactive Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-travel-100/80 via-white to-travel-50/90 transition-all duration-300"
          style={{ 
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundSize: '200% 200%'
          }}
        ></div>
        
        {/* Interactive decorative elements that follow mouse subtly */}
        <div 
          className="travel-decoration animate-float-delayed" 
          style={{ 
            top: `${10 + mousePosition.y * 0.03}%`, 
            right: `${5 + mousePosition.x * 0.02}%`, 
            '--color-start': '#e0f2fe', 
            '--color-end': '#bae6fd',
            transform: `scale(${1 + (mousePosition.y * 0.001)})` 
          } as React.CSSProperties}
        ></div>
        
        <div 
          className="travel-decoration" 
          style={{ 
            bottom: `${10 - mousePosition.y * 0.02}%`, 
            left: `${5 + mousePosition.x * 0.01}%`, 
            '--color-start': '#dbeafe', 
            '--color-end': '#93c5fd',
            filter: `blur(${2 + mousePosition.x * 0.01}px)` 
          } as React.CSSProperties}
        ></div>
        
        <div 
          className="travel-decoration animate-pulse-slow" 
          style={{ 
            top: `${40 - mousePosition.x * 0.03}%`, 
            left: `${20 + mousePosition.y * 0.02}%`, 
            '--color-start': '#f0fdfa', 
            '--color-end': '#99f6e4',
            opacity: 0.1 + (mousePosition.y * 0.001)
          } as React.CSSProperties}
        ></div>
        
        {/* Additional interactive bubbles */}
        <div 
          className="absolute w-40 h-40 rounded-full bg-travel-300/10 backdrop-blur-md"
          style={{ 
            top: `${70 - mousePosition.y * 0.05}%`, 
            right: `${30 - mousePosition.x * 0.04}%`,
            transform: `scale(${0.8 + (mousePosition.x * 0.003)}) translateY(${mousePosition.y * 0.1}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        ></div>
        
        <div 
          className="absolute w-24 h-24 rounded-full bg-travel-400/5 backdrop-blur-sm"
          style={{ 
            bottom: `${40 + mousePosition.y * 0.03}%`, 
            right: `${50 - mousePosition.x * 0.02}%`,
            transform: `translateX(${mousePosition.x * 0.2}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        ></div>
        
        {/* Decorative icons */}
        <div className="absolute top-[15%] left-[10%] travel-icon">
          <Plane 
            className="text-travel-300 w-6 h-6" 
            style={{ 
              transform: `rotate(${15 + mousePosition.x * 0.1}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
        <div className="absolute top-[70%] right-[15%] travel-icon">
          <Globe 
            className="text-travel-300 w-8 h-8" 
            style={{ 
              transform: `rotate(${mousePosition.x * 0.05}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
        <div className="absolute bottom-[30%] left-[25%] travel-icon">
          <Hotel
            className="text-travel-300 w-6 h-6" 
            style={{ 
              transform: `translateY(${(mousePosition.y - 50) * 0.05}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
        <div className="absolute top-[30%] right-[25%] travel-icon">
          <Mountain
            className="text-travel-300 w-7 h-7" 
            style={{ 
              transform: `translateY(${(mousePosition.y - 40) * 0.04}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
        <div className="absolute top-[20%] right-[45%] travel-icon">
          <Utensils
            className="text-travel-300 w-5 h-5" 
            style={{ 
              transform: `rotate(${mousePosition.x * 0.03}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
        <div className="absolute bottom-[15%] right-[35%] travel-icon">
          <Camera
            className="text-travel-300 w-5 h-5" 
            style={{ 
              transform: `scale(${1 + mousePosition.y * 0.001})`,
              transition: 'transform 0.3s ease-out'
            }}
          />
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
            Journey<span className="font-extrabold">Trip</span>
          </h1>
          <p className="mt-3 text-gray-600 animate-fade-up max-w-xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Your AI-powered adventure creator that designs personalized journeys with stunning destinations
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
            <p className="text-gray-600 animate-fade-up" style={{ animationDelay: '0.2s' }}>Creating your dream journey experience...</p>
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-500 mt-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <span className="flex items-center"><Hotel className="w-3 h-3 mr-1" />Finding accommodations</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center"><Utensils className="w-3 h-3 mr-1" />Selecting restaurants</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center"><Mountain className="w-3 h-3 mr-1" />Discovering attractions</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center"><Camera className="w-3 h-3 mr-1" />Mapping photo spots</span>
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
          <p>Personalized journeys crafted with Gemini 1.5 Flash • Created with Lovable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
