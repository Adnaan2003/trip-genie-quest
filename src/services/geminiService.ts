import { TravelFormData, TravelRecommendation } from '@/types/travel';

const API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your actual Gemini API key

export interface GeminiResponse {
  recommendations: TravelRecommendation[];
  error?: string;
}

export const generateTravelPlan = async (
  formData: TravelFormData
): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Act as a travel planning assistant.
      Please create a detailed travel plan for a trip with the following details:
      - Departing from: ${formData.source}
      - Destination: ${formData.destination}
      - Travel dates: ${formData.startDate} to ${formData.endDate}
      - Budget: ${formData.budget}
      - Number of travelers: ${formData.travelers}
      - Interests: ${formData.interests}
      
      Provide specific recommendations for:
      1. Transportation options and estimated costs
      2. Accommodation suggestions within budget
      3. Must-see attractions based on interests
      4. Daily itinerary outline
      5. Food and dining recommendations
      6. Local cultural experiences
      7. Shopping recommendations
      8. Safety tips for the destination
      
      Format each section with a clear title and detailed content that is helpful for travelers.
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return {
        recommendations: [],
        error: `API error: ${errorData.error?.message || 'Unknown error'}`
      };
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      return {
        recommendations: [],
        error: "No response generated, please try again"
      };
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the response text into sections
    const sections = parseRecommendations(generatedText);
    
    return {
      recommendations: sections
    };
  } catch (error) {
    console.error('Error generating travel plan:', error);
    return {
      recommendations: [],
      error: `Error: ${(error as Error).message || 'Unknown error occurred'}`
    };
  }
};

function parseRecommendations(text: string): TravelRecommendation[] {
  // Split by numbered sections or headers
  const sectionRegex = /(?:\d+\.\s+|\#{1,6}\s+)([^\n]+)(?:\n|$)/g;
  let match;
  const sections: TravelRecommendation[] = [];
  let lastIndex = 0;
  let lastTitle = '';

  // Try to match section headers
  while ((match = sectionRegex.exec(text)) !== null) {
    if (lastTitle) {
      // Get content between last title and current title
      const content = text.slice(lastIndex, match.index).trim();
      if (content) {
        sections.push({ title: lastTitle, content });
      }
    }
    
    lastTitle = match[1].trim();
    lastIndex = match.index + match[0].length;
  }

  // Add the last section
  if (lastTitle) {
    const content = text.slice(lastIndex).trim();
    if (content) {
      sections.push({ title: lastTitle, content });
    }
  }

  // If we couldn't parse sections properly, create a fallback with the full text
  if (sections.length === 0) {
    // Try to split by newlines for simple sections
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this line could be a title
      if (line.length < 100 && !line.endsWith('.') && line.length > 0) {
        let content = '';
        let j = i + 1;
        
        // Collect content until the next potential title
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine.length < 100 && !nextLine.endsWith('.') && nextLine.length > 0 && 
              (nextLine.startsWith('•') || nextLine.match(/^\d+\./))) {
            // This looks like the next title
            break;
          }
          content += nextLine + '\n';
          j++;
        }
        
        if (content.trim()) {
          sections.push({ title: line, content: content.trim() });
        }
        
        i = j - 1; // Move to the next section
      }
    }
    
    // If still nothing, just return the whole text
    if (sections.length === 0) {
      sections.push({ 
        title: 'Travel Recommendations', 
        content: text 
      });
    }
  }

  return sections;
}
