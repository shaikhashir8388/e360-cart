'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import { Button } from '@/components/ui/button';
import { Product, FilterOption, SortOption, ProductsResponse } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('trending');
  const [selectedSort, setSelectedSort] = useState<SortOption>('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [pagination, setPagination] = useState<any>(null);
  const [availableTagsList, setAvailableTagsList] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    return availableTagsList;
  }, [availableTagsList]);

  const maxPrice = useMemo(() => {
    return products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
  }, [products]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (searchTerm) filters.search = searchTerm;
      if (selectedTags.length > 0) filters.tags = selectedTags;
      if (priceRange[0] > 0) filters.minPrice = priceRange[0];
      if (priceRange[1] < maxPrice) filters.maxPrice = priceRange[1];

      // Map sort options
      let sortParam = '-createdAt';
      switch (selectedSort) {
        case 'price-low':
          sortParam = 'price';
          break;
        case 'price-high':
          sortParam = '-price';
          break;
        case 'popularity':
          sortParam = '-soldCount';
          break;
        case 'trending':
          sortParam = '-createdAt';
          break;
      }
      filters.sort = sortParam;

      const response = await apiService.getProducts(filters);
      
      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || null);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available tags
  const fetchTags = async () => {
    try {
      const response = await apiService.getProductTags();
      if (response.success && response.data) {
        setAvailableTagsList(response.data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedSort, selectedTags, priceRange]);

  useEffect(() => {
    fetchTags();
  }, []);

  // Products are already filtered and paginated from the backend
  const paginatedProducts = products;

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Our Collection</h1>
            <p className="text-gray-600">
              Discover amazing products with great quality and unbeatable prices
            </p>
          </div>
          {user && user.role === 'admin' && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <ProductFilters
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableTags={availableTags}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            maxPrice={maxPrice}
          />
        </aside>

        <main className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {pagination ? `${pagination.total} products found` : 'Loading...'}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-1 1m-6 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let page: number;
                      if (pagination.pages <= 5) {
                        page = i + 1;
                      } else {
                        const start = Math.max(1, currentPage - 2);
                        page = start + i;
                      }
                      
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}