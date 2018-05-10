export interface User {
  name: string;
  password: string;
}

export interface Book {
  isbn: string;
  price: number;
}

export type ToastLocation = 'top' | 'middle' | 'bottom';

export interface BookDetail {
  title: string;
  authors: string;
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  language: string;
}

