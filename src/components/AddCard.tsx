
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
      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
    >
      <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 flex-shrink-0" />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
          Add Color
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ({colorCount}/{maxColors})
        </span>
      </div>
    </div>
  );
};

export default AddCard;
