export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
  image: string;
  inStock: boolean;
}

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
}

export interface Post {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  author: Author;
  category: string;
  promotionalText: string;
  relatedProducts: Product[];
}

export interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface PostAction {
  postId: string;
  action: 'like' | 'share' | 'add_to_cart' | 'view_product' | 'view_all';
  productId?: string;
}
