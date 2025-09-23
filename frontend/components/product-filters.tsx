'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FilterOption, SortOption } from '@/lib/types';

interface ProductFiltersProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
}

export function ProductFilters({
  selectedFilter,
  onFilterChange,
  selectedSort,
  onSortChange,
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
}: ProductFiltersProps) {
  const filters: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'trending', label: 'Trending' },
    { value: 'popular', label: 'Popular' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={selectedSort} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}