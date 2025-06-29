
import React from 'react';
import { Plus } from 'lucide-react';

interface AddCardProps {
  onClick: () => void;
  colorCount: number;
  maxColors: number;
}

const AddCard = ({ onClick, colorCount, maxColors }: AddCardProps) => {
  return (
    <div
      onClick={onClick}
      className="h-32 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
    >
      <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200 mt-2">
        Add Color
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        ({colorCount}/{maxColors})
      </span>
    </div>
  );
};

export default AddCard;
