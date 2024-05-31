import { useUser } from '@clerk/nextjs';
import { type Product } from '~/types/product';
import { Card } from '~/components/card/Card';

interface CardProductProps {
  product: Product;
  onDelete: () => void;
  onUpdate: (args: { id: string; isFavorite: boolean }) => void;
}

export function CardProduct({ product, onDelete, onUpdate }: CardProductProps) {
  const { isSignedIn } = useUser();
  return (
    <Card.VariantFull>
      <Card.LoadingOverlay visible={product.id.includes('loading')} />
      <Card.Header title={product.name} link={product.id}>
        {isSignedIn && <Card.Menu onDeleteClick={onDelete} />}
      </Card.Header>
      <Card.Image
        image="https://picsum.photos/800/800?random=2"
        title={product.name}
        link={product.id}
      />
      <Card.Description description="Item Description" />
      <Card.Details
        quantity={product.remaining?.quantity}
        brand={product.brand ?? 'No Brand'}
        categories={product.categories}
      />
      <Card.Actions
        link={product.id}
        onFavoriteClick={() => onUpdate({ id: product.id, isFavorite: !product.isFavorite })}
        isFavorite={product.isFavorite ?? false}
      />
    </Card.VariantFull>
  );
}
