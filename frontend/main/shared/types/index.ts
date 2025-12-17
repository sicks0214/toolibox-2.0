// Common types shared across all applications

export interface Category {
  id: string;
  slug: string;
  icon: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  gradient: string;
  order: number;
}

export interface Tool {
  id: string;
  slug: string;
  categoryId: string;
  icon: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  comingSoon?: boolean;
  isPopular?: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}
