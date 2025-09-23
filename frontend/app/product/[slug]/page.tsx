import { Product } from '@/lib/types';
import { apiService } from '@/lib/api';
import { ProductDetailClient } from './product-detail-client';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await apiService.getProductBySlug(slug);
    if (response.success && response.data) {
      return response.data.product;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
  return null;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}