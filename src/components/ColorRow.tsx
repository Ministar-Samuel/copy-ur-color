
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { ColorFormat, parseColorFlexible, formatColor } from '../utils/colorUtils';

interface ColorRowProps {
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

export const ColorRow: React.FC<ColorRowProps> = ({
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

  const getInputClassName = () => {
    let className = 'flex-1 bg-transparent border-transparent focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200';
    
    if (errorMessage && value) {
      className += ' border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20';
    } else if (hasPreview && !isValid && value) {
      className += ' border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    }
    
    return className;
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCopy(value, isValid)}
          className="h-8 w-8 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onValueChange(id, e.target.value)}
            placeholder={getPlaceholder()}
            className={getInputClassName()}
          />
          {errorMessage && value && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400">
              {errorMessage}
            </div>
          )}
        </div>
        
        <div 
          className="w-12 h-12 rounded-md border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 transition-all duration-200 hover:scale-110 cursor-pointer"
          style={{ backgroundColor: getColorPreview() }}
          title={hasPreview ? (isValid ? value : 'Partial color preview') : 'Invalid color'}
          onClick={() => onCopy(value, isValid)}
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
      
      <div className="flex items-center gap-2">
        <Input
          value={name || ''}
          onChange={(e) => onNameChange(id, e.target.value)}
          placeholder="Color name (optional)"
          className="text-sm bg-transparent border-transparent focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200"
        />
      </div>
    </div>
  );
};
