export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Product extends ProductFormData {
  product_id: string;
}
