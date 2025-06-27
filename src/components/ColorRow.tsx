
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { ColorFormat, parseColor, convertColor, formatColor } from '../utils/colorUtils';

interface ColorRowProps {
  id: string;
  value: string;
  isValid: boolean;
  format: ColorFormat;
  onValueChange: (id: string, value: string) => void;
  onCopy: (value: string, isValid: boolean) => void;
  onRemove?: (id: string) => void;
}

export const ColorRow: React.FC<ColorRowProps> = ({
  id,
  value,
  isValid,
  format,
  onValueChange,
  onCopy,
  onRemove
}) => {
  const getColorPreview = () => {
    if (!isValid || !value) return 'transparent';
    
    try {
      // Parse the color in the current format
      const parsedColor = parseColor(value, format);
      
      // Convert to HEX for display (all formats can be converted to RGB then to HEX)
      const hexColor = formatColor(parsedColor, 'HEX');
      return hexColor;
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
    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(value, isValid)}
        className="h-8 w-8 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <Input
        value={value}
        onChange={(e) => onValueChange(id, e.target.value)}
        placeholder={getPlaceholder()}
        className={`flex-1 bg-transparent border-transparent focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 ${
          !isValid && value ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : ''
        }`}
      />
      
      <div 
        className="w-6 h-6 rounded-md border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: getColorPreview() }}
        title={isValid ? value : 'Invalid color'}
      />
      
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
