import useCart, {Product} from '@/hooks/useCart';
import {formatCurrency} from '@/lib/utils';
import {MinusCircle, PlusCircle} from 'lucide-react';
import {FC} from 'react';

interface ProductRowProps {
  product: Product;

  isOrders?: boolean;
}

const ProductRow: FC<ProductRowProps> = ({product, isOrders}) => {
  // console.log('fuck', product);
  const {addOneQuantity, removeOneQuantity} = useCart();
  console;
  return (
    <div className="grid animate-appear grid-cols-5 transition-all duration-700 ease-in-out">
      <span className="truncate">{product.designation}</span>
      <span className="truncate text-center">{product.quantity}</span>
      <span className="truncate text-center">{product.sellingPrice} DA</span>
      <span className="truncate text-center">{product.sellingPrice * product.quantity} DA</span>
      {!isOrders && (
        <div className="flex justify-end gap-2 truncate">
          <PlusCircle className="h-5 w-5 cursor-pointer text-subtle" onClick={() => addOneQuantity(product.id)} />
          <MinusCircle className="h-5 w-5 cursor-pointer text-subtle" onClick={() => removeOneQuantity(product.id)} />
        </div>
      )}
    </div>
  );
};

export default ProductRow;
