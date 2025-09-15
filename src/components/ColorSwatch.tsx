import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, X, Edit3 } from 'lucide-react';
import { ColorFormat, parseColorFlexible, formatColor } from '../utils/colorUtils';

interface ColorSwatchProps {
  id: string;
  value: string;
  name?: string;
  isValid: boolean;
  hasPreview: boolean;
  errorMessage: string;
  format: ColorFormat;
  onValueChange: (id: string, value: string) => void;
  onNameChange: (id: string, name: string) => void;
  onCopy: (value: string, isValid: boolean) => void;
  onRemove?: (id: string) => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  id,
  value,
  name,
  isValid,
  hasPreview,
  errorMessage,
  format,
  onValueChange,
  onNameChange,
  onCopy,
  onRemove
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);

  const getColorPreview = () => {
    if (!hasPreview || !value) return 'transparent';
    
    try {
      const validation = parseColorFlexible(value, format);
      if (validation.hasPreview && validation.color) {
        const hexColor = formatColor(validation.color, 'HEX');
        return hexColor;
      }
      return 'transparent';
    } catch {
      return 'transparent';
    }
  };

  const getPlaceholder = () => {
    switch (format) {
      case 'HEX': return '#FF5733';
      case 'RGB': return 'rgb(255, 87, 51)';
      case 'HSL': return 'hsl(9, 100%, 60%)';
      case 'HSB': return 'hsb(9, 80%, 100%)';
      case 'CMYK': return 'cmyk(0, 66%, 80%, 0%)';
      default: return '';
    }
  };

  return (
    <div className="relative group">
      <div 
        className="aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105 cursor-pointer relative overflow-hidden"
        style={{ backgroundColor: getColorPreview() }}
        onClick={() => onCopy(value, isValid)}
        title={`${name || 'Unnamed'}: ${value}`}
      >
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(value, isValid);
              }}
              className="h-8 w-8 bg-white/90 hover:bg-white text-black"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingValue(true);
              }}
              className="h-8 w-8 bg-white/90 hover:bg-white text-black"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(id);
                }}
                className="h-8 w-8 bg-red-500/90 hover:bg-red-500 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Error indicator */}
        {errorMessage && (
          <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" title={errorMessage} />
        )}
      </div>
      
      {/* Name/Value display */}
      <div className="mt-2 space-y-1">
        {isEditingName ? (
          <Input
            value={name || ''}
            onChange={(e) => onNameChange(id, e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
            placeholder="Color name"
            className="text-xs h-6 px-1 text-center"
            autoFocus
          />
        ) : (
          <div 
            className="text-xs text-center font-medium truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-0.5 rounded"
            onClick={() => setIsEditingName(true)}
            title={name || 'Click to add name'}
          >
            {name || 'Unnamed'}
          </div>
        )}
        
        {isEditingValue ? (
          <Input
            value={value}
            onChange={(e) => onValueChange(id, e.target.value)}
            onBlur={() => setIsEditingValue(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingValue(false)}
            placeholder={getPlaceholder()}
            className="text-xs h-6 px-1 text-center"
            autoFocus
          />
        ) : (
          <div 
            className="text-xs text-center text-gray-600 dark:text-gray-400 truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-0.5 rounded"
            onClick={() => setIsEditingValue(true)}
            title={value || 'Click to add color'}
          >
            {value || 'No color'}
          </div>
        )}
      </div>
    </div>
  );
};