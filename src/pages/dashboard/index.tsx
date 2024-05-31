import { ActionIcon, Button, Grid, Skeleton, TextInput } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { IconArrowRight, IconPackages, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { api } from '~/utils/api';
import ModalNameConfirmation from '~/components/modal/nameConfirmation';
import LayoutDashboard from '~/layouts/dashboard';
import { ModalCreateProduct } from '~/components/modal/CreateProduct';
import classes from './styles/Dashboard.module.css';
import { useProductService } from '~/services/hooks/useProductService';
import { CardProduct } from '~/components/card/CardProduct';

export default function Dashboard() {
  const { createProduct } = useProductService().create();
  const { deleteProduct } = useProductService().delete();
  const { updateProduct } = useProductService().update();
  const { products = [], isLoading, isError } = useProductService().products();

  const { user } = useUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [showNameConfirmation, setShowNameConfirmation] = useState(false);

  const { mutate: createUser } = api.user.create.useMutation();
  const { mutate: updateUser } = api.user.update.useMutation();

  const { data: userInfo, isLoading: userInfoLoading } = api.user.get.useQuery(undefined, {
    enabled: user !== undefined,
  });

  useEffect(() => {
    if (userInfoLoading) return;

    const { firstName, lastName, id: userInfoId } = userInfo ?? {};
    const { firstName: userFirstName, lastName: userLastName, primaryEmailAddress } = user ?? {};
    const userEmail = primaryEmailAddress?.emailAddress;
    const userId = user?.id ?? '';

    if (!firstName) {
      setShowNameConfirmation(true);
      return;
    }

    if (!userInfoId?.includes(userId)) {
      if (userFirstName && userLastName && userEmail) {
        createUser({
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
        });
      }
      return;
    }

    if (
      (userFirstName && firstName !== userFirstName) ||
      (userLastName && lastName !== userLastName)
    ) {
      if (userEmail && userFirstName && userLastName) {
        updateUser({
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
        });
      }
    }
  }, [userInfo, user]);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <LayoutDashboard>
      {showNameConfirmation ? <ModalNameConfirmation /> : null}
      {opened && <ModalCreateProduct opened={opened} close={close} />}
      <Grid gutter="md">
        <Grid.Col className={classes.addProduct}>
          <TextInput
            mt={10}
            leftSection={<IconPackages size="1.1rem" stroke={1.5} />}
            size="md"
            ref={inputRef}
            rightSection={
              <ActionIcon
                size={32}
                variant="filled"
                onClick={() => {
                  createProduct({
                    name: inputRef.current ? inputRef.current.value : '',
                  });
                  if (inputRef.current) {
                    inputRef.current.value = '';
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
                createProduct({
                  name: e.currentTarget.value,
                });
                e.currentTarget.value = '';
              }
            }}
          />
          <Button onClick={open} mt={10} rightSection={<IconPlus size="1.1rem" stroke={1.5} />}>
            Create Product
          </Button>
        </Grid.Col>
        <Grid.Col span={12}>
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
