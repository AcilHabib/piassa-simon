import {ScrollArea} from '@/components/ui/scroll-area';
import {Product} from '@/hooks/useCart';
import {FC} from 'react';
import ProductRow from './ProductRow';

interface ProductsListProps {
  products: Product[];
  isOrders?: boolean;
}

const ProductsList: FC<ProductsListProps> = ({products, isOrders}) => {
  return (
    <ScrollArea className="col-span-full max-h-[20vh]">
      {products.map((product, index) => (
        <ProductRow key={index} product={product} isOrders={isOrders} />
      ))}
    </ScrollArea>
  );
};

export default ProductsList;
