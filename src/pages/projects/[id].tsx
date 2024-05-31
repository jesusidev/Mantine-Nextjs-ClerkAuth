import { useRouter } from 'next/router';
import { ActionIcon, Badge, Grid, Group, Skeleton, TextInput } from '@mantine/core';
import { IconArrowRight, IconPackages } from '@tabler/icons-react';
import { useRef } from 'react';
import LayoutDashboard from '~/layouts/dashboard';
import { CardProduct } from '~/components/card/CardProduct';
import { useProjectService } from '~/services/hooks/useProjectService';
import { useProductService } from '~/services/hooks/useProductService';
import classes from '~/pages/dashboard/styles/Dashboard.module.css';

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  const { project } = useProjectService().project(id as string);
  const { products = [], isLoading, isError } = useProductService().products(id as string);

  const { createProduct } = useProductService().create();
  const { deleteProduct } = useProductService()
    .delete()
    .byProject(id as string);
  const { updateProduct } = useProductService()
    .update()
    .byProject(id as string);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateProduct = (productName: string) => {
    if (inputRef.current) {
      createProduct({
        name: productName,
        brand: 'test',
        sku: Math.ceil(Math.random() * 10000).toString(),
        projectId: id as string,
      });
      inputRef.current.value = '';
    }
  };

  return (
    <LayoutDashboard>
      <Grid gutter="md">
        <Grid.Col>
          <Group>
            <h1>Project {project?.name}</h1>
            <Badge>{project?.status}</Badge>
          </Group>
          <TextInput
            mb={10}
            leftSection={<IconPackages size="1.1rem" stroke={1.5} />}
            size="md"
            ref={inputRef}
            rightSection={
              <ActionIcon
                size={32}
                variant="filled"
                onClick={() => {
                  if (inputRef.current) {
                    handleCreateProduct(inputRef.current.value);
                  }
                }}
              >
                <IconArrowRight size="1.1rem" stroke={1.5} />
              </ActionIcon>
            }
            placeholder="Quick Add Product"
            rightSectionWidth={42}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateProduct(e.currentTarget.value);
              }
            }}
          />
          <section className={classes.product}>
            {isError && <h1>Error Getting Products</h1>}
            {isLoading && <Skeleton height={408} width={272} radius="md" animate />}
            {products?.length < 1 && !isLoading && (
              <h1>No Products Found, Please Create a Product</h1>
            )}
            {products?.length > 0
              ? products.map((product) => (
                  <CardProduct
                    key={product.id}
                    product={product}
                    onDelete={() => deleteProduct({ id: product.id })}
                    onUpdate={() =>
                      updateProduct({ id: product.id, isFavorite: !product.isFavorite })
                    }
                  />
                ))
              : null}
          </section>
        </Grid.Col>
      </Grid>
    </LayoutDashboard>
  );
}
