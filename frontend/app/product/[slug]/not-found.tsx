import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Product Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Sorry, the product you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild>
            <Link href="/">
              Back to Products
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
