import { CategoryItem } from "../../category/types/CategoryItem";


export interface Product {
  id: string;
  name: string;
  category: CategoryItem;
  expiry: string;
  isHidden: boolean;
}