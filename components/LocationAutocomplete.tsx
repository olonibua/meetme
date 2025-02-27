"use client";
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from '../lib/theme';
import { MeetupLocation } from '../types/meetup';

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: MeetupLocation) => void;
  className?: string;
}

export default function LocationAutocomplete({ value, onChange, className }: LocationAutocompleteProps) {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value || '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,place,poi`
      );
      const data = await response.json();
      setSuggestions(data.features);
    } catch  {
      // console.error('Error fetching location suggestions:',);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);

    // Debounce API calls
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const location: MeetupLocation = {
      address: suggestion.place_name,
      lat: suggestion.center[1],
      lng: suggestion.center[0]
    };
    setInputValue(suggestion.place_name);
    onChange(location);
    setShowSuggestions(false);
  };

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter location"
        className={cn(
          theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : '',
          className
        )}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className={cn(
            "absolute z-50 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          )}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-opacity-10",
                theme === 'dark' ? 
                  'text-white hover:bg-white' : 
                  'text-gray-900 hover:bg-black',
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 