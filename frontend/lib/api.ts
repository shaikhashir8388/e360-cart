const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    type: string;
    value: any;
    msg: string;
    path: string;
    location: string;
  }>;
}

export interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
    role: 'admin' | 'user';
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  profileImage?: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  tags: string;
  price: number;
  colour: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  totalStock: number;
  inStock: boolean;
  images: File[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  tags?: string;
  price?: number;
  colour?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  totalStock?: number;
  inStock?: boolean;
  images?: File[];
  removeImages?: string[];
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  selectedColour: string;
  selectedSize: string;
}

export interface CheckoutData {
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  paymentMethod?: string;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getFormDataHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {};

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  // Auth endpoints
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const formData = new FormData();
    
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('confirmPassword', userData.confirmPassword);
    formData.append('phone', userData.phone);
    
    if (userData.profileImage) {
      formData.append('profileImage', userData.profileImage);
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getFormDataHeaders(),
      body: formData,
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async login(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(loginData),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async loginAdmin(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(loginData),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ user: AuthResponse['user'] }>(response);
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<null>(response);
  }

  async updateProfile(userData: { username?: string; phone?: string; profileImage?: File }): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    const formData = new FormData();
    
    if (userData.username) formData.append('username', userData.username);
    if (userData.phone) formData.append('phone', userData.phone);
    if (userData.profileImage) formData.append('profileImage', userData.profileImage);

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getFormDataHeaders(true),
      body: formData,
    });

    return this.handleResponse<{ user: AuthResponse['user'] }>(response);
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(passwordData),
    });

    return this.handleResponse<null>(response);
  }

  async createAdmin(adminData: Omit<RegisterData, 'confirmPassword'>): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(adminData),
    });

    return this.handleResponse<{ user: AuthResponse['user'] }>(response);
  }

  // Product endpoints
  async getProducts(filters: Record<string, any> = {}): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<any>(response);
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<{ product: any }>> {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ product: any }>(response);
  }

  async createProduct(productData: CreateProductData): Promise<ApiResponse<{ product: any }>> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('tags', productData.tags);
    formData.append('price', productData.price.toString());
    formData.append('colour', productData.colour);
    formData.append('size', productData.size);
    formData.append('totalStock', productData.totalStock.toString());
    formData.append('inStock', productData.inStock.toString());
    
    productData.images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getFormDataHeaders(true),
      body: formData,
    });

    return this.handleResponse<{ product: any }>(response);
  }

  async updateProduct(productId: string, productData: UpdateProductData): Promise<ApiResponse<{ product: any }>> {
    const formData = new FormData();
    
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.tags) formData.append('tags', productData.tags);
    if (productData.price) formData.append('price', productData.price.toString());
    if (productData.colour) formData.append('colour', productData.colour);
    if (productData.size) formData.append('size', productData.size);
    if (productData.totalStock) formData.append('totalStock', productData.totalStock.toString());
    if (productData.inStock !== undefined) formData.append('inStock', productData.inStock.toString());
    
    if (productData.images) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    if (productData.removeImages) {
      productData.removeImages.forEach((imageUrl) => {
        formData.append('removeImages', imageUrl);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: this.getFormDataHeaders(true),
      body: formData,
    });

    return this.handleResponse<{ product: any }>(response);
  }

  async deleteProduct(productId: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<null>(response);
  }

  async getProductStats(): Promise<ApiResponse<{ stats: any }>> {
    const response = await fetch(`${API_BASE_URL}/products/stats`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ stats: any }>(response);
  }

  async getProductTags(): Promise<ApiResponse<{ tags: string[] }>> {
    const response = await fetch(`${API_BASE_URL}/products/tags`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ tags: string[] }>(response);
  }

  // Cart endpoints
  async getCart(): Promise<ApiResponse<{ cart: any }>> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ cart: any }>(response);
  }

  async addToCart(cartData: AddToCartData): Promise<ApiResponse<{ cart: any }>> {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(cartData),
    });

    return this.handleResponse<{ cart: any }>(response);
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<{ cart: any }>> {
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ quantity }),
    });

    return this.handleResponse<{ cart: any }>(response);
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<{ cart: any }>> {
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ cart: any }>(response);
  }

  async clearCart(): Promise<ApiResponse<{ cart: any }>> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ cart: any }>(response);
  }

  async getCartCount(): Promise<ApiResponse<{ count: number }>> {
    const response = await fetch(`${API_BASE_URL}/cart/count`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ count: number }>(response);
  }

  // Checkout endpoints
  async getCheckoutSummary(): Promise<ApiResponse<{ items: any[], orderSummary: any, itemCount: number, totalQuantity: number }>> {
    const response = await fetch(`${API_BASE_URL}/checkout/summary`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ items: any[], orderSummary: any, itemCount: number, totalQuantity: number }>(response);
  }

  async processCheckout(checkoutData: CheckoutData): Promise<ApiResponse<{ order: any, paymentInfo: any }>> {
    const response = await fetch(`${API_BASE_URL}/checkout/process`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(checkoutData),
    });

    return this.handleResponse<{ order: any, paymentInfo: any }>(response);
  }

  async getUserOrders(page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<{ orders: any[], pagination: any }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/checkout/orders?${params}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ orders: any[], pagination: any }>(response);
  }

  async getOrder(orderNumber: string): Promise<ApiResponse<{ order: any }>> {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${orderNumber}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ order: any }>(response);
  }
}

export const apiService = new ApiService();
