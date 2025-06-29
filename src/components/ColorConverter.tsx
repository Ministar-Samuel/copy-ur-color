import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { ColorRow } from './ColorRow';
import AddCard from './AddCard';
import { convertColor, parseColor, formatColor, parseColorFlexible, ColorFormat, ValidationResult } from '../utils/colorUtils';
import { useToast } from '@/hooks/use-toast';

interface ColorEntry {
  id: string;
  value: string;
  isValid: boolean;
  hasPreview: boolean;
  errorMessage: string;
}

interface SessionData {
  format: ColorFormat;
  colors: string[];
  theme: boolean;
}

const ColorConverter = () => {
  const [format, setFormat] = useState<ColorFormat>('HEX');
  const [colors, setColors] = useState<ColorEntry[]>([
    { id: '1', value: '#FF5733', isValid: true, hasPreview: true, errorMessage: '' },
    { id: '2', value: '#33FF57', isValid: true, hasPreview: true, errorMessage: '' },
    { id: '3', value: '#3357FF', isValid: true, hasPreview: true, errorMessage: '' },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const MAX_COLORS = 30;

  // Session persistence
  const saveToSession = useCallback(() => {
    const sessionData: SessionData = {
      format,
      colors: colors.map(color => color.value),
      theme: isDarkMode
    };
    sessionStorage.setItem('colorConverter', JSON.stringify(sessionData));
  }, [format, colors, isDarkMode]);

  const loadFromSession = useCallback(() => {
    try {
      const saved = sessionStorage.getItem('colorConverter');
      if (saved) {
        const sessionData: SessionData = JSON.parse(saved);
        setFormat(sessionData.format);
        setIsDarkMode(sessionData.theme);
        
        const loadedColors = sessionData.colors.map((value, index) => {
          const validation = parseColorFlexible(value, sessionData.format);
          return {
            id: (index + 1).toString(),
            value,
            isValid: validation.isValid,
            hasPreview: validation.hasPreview,
            errorMessage: validation.errorMessage
          };
        });
        
        if (loadedColors.length > 0) {
          setColors(loadedColors);
        }
        
        if (sessionData.theme) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (error) {
      console.log('Failed to load session data:', error);
    }
  }, []);

  // Load session data on mount
  useEffect(() => {
    loadFromSession();
  }, [loadFromSession]);

  // Save to session whenever data changes
  useEffect(() => {
    saveToSession();
  }, [saveToSession]);

  const handleFormatChange = useCallback((newFormat: ColorFormat) => {
    const convertedColors = colors.map(color => {
      if (!color.isValid) return { ...color, hasPreview: false, errorMessage: 'Invalid color code' };
      
      try {
        const parsedColor = parseColor(color.value, format);
        const convertedColor = convertColor(parsedColor, newFormat);
        const formattedColor = formatColor(convertedColor, newFormat);
        
        return {
          ...color,
          value: formattedColor,
          isValid: true,
          hasPreview: true,
          errorMessage: ''
        };
      } catch (error) {
        return { 
          ...color, 
          isValid: false, 
          hasPreview: false, 
          errorMessage: 'Invalid color code' 
        };
      }
    });

    setColors(convertedColors);
    setFormat(newFormat);
  }, [colors, format]);

  const handleColorChange = useCallback((id: string, value: string) => {
    setColors(prev => prev.map(color => {
      if (color.id !== id) return color;
      
      if (value === '') {
        return { 
          ...color, 
          value, 
          isValid: true, 
          hasPreview: false, 
          errorMessage: '' 
        };
      }

      const validation = parseColorFlexible(value, format);
      
      return { 
        ...color, 
        value, 
        isValid: validation.isValid,
        hasPreview: validation.hasPreview,
        errorMessage: validation.errorMessage
      };
    }));
  }, [format]);

  const handleCopyColor = useCallback((value: string, isValid: boolean) => {
    if (!isValid) {
      toast({
        title: "Cannot copy invalid color",
        description: "Please enter a valid color in the selected format.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(value);
    toast({
      title: "Color copied!",
      description: `Copied ${value} to clipboard.`,
    });
  }, [toast]);

  const addColor = useCallback(() => {
    if (colors.length >= MAX_COLORS) return;
    
    const newColor: ColorEntry = {
      id: Date.now().toString(),
      value: '',
      isValid: true,
      hasPreview: false,
      errorMessage: ''
    };
    setColors(prev => [...prev, newColor]);
  }, [colors.length]);

  const removeColor = useCallback((id: string) => {
    setColors(prev => prev.filter(color => color.id !== id));
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-8 py-4 h-screen flex flex-col">
        <Card className="flex-1 flex flex-col bg-white dark:bg-black border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/1f06eca3-3878-4011-b68f-520ba3e52b29.png" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
                <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-white to-gray-100' : 'from-gray-900 to-black'} bg-clip-text text-transparent`}>
                  Copy Color Converter
                </CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <Select value={format} onValueChange={handleFormatChange}>
                  <SelectTrigger className="w-24 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
                    <SelectItem value="HEX">HEX</SelectItem>
                    <SelectItem value="RGB">RGB</SelectItem>
                    <SelectItem value="HSL">HSL</SelectItem>
                    <SelectItem value="HSB">HSB</SelectItem>
                    <SelectItem value="CMYK">CMYK</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110 transition-transform duration-200"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min overflow-auto">
              {colors.map((color) => (
                <ColorRow
                  key={color.id}
                  id={color.id}
                  value={color.value}
                  isValid={color.isValid}
                  hasPreview={color.hasPreview}
                  errorMessage={color.errorMessage}
                  format={format}
                  onValueChange={handleColorChange}
                  onCopy={handleCopyColor}
                  onRemove={colors.length > 1 ? removeColor : undefined}
                />
              ))}
              
              {colors.length < MAX_COLORS && (
                <AddCard
                  onClick={addColor}
                  colorCount={colors.length}
                  maxColors={MAX_COLORS}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorConverter;
