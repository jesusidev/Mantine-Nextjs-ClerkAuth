import { useUser } from '@clerk/nextjs';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Button, Grid, Skeleton, TextInput } from '@mantine/core';
import { IconArrowRight, IconPackages, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useProductService } from '~/services/hooks/useProductService';
import { api } from '~/utils/api';
import LayoutDashboard from '~/layouts/dashboard';
import ModalNameConfirmation from '~/components/modal/nameConfirmation';
import { ModalCreateProduct } from '~/components/modal/CreateProduct';
import classes from '~/pages/dashboard/styles/Dashboard.module.css';
import { CardProduct } from '~/components/card/CardProduct';
import LayoutPage from '~/layouts/page';

export default function Products() {
  const router = useRouter();
  const showPublic = router.query.show === 'public';

  const { createProduct } = useProductService().create();
  const { deleteProduct } = useProductService().delete();
  const { updateProduct } = useProductService().update();
  const { products = [], isLoading, isError } = useProductService().products();
  const { publicProducts = [], isLoading: allProductsLoading } =
    useProductService().publicProducts();

  const { user, isSignedIn } = useUser();
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
    <>
      {!isSignedIn ? (
        <LayoutPage>
          <Grid gutter="md" m={30}>
            <Grid.Col span={12}>
              <section className={classes.product}>
                {allProductsLoading && <Skeleton height={408} width={272} radius="md" animate />}
                {showPublic && publicProducts?.length > 0
                  ? publicProducts.map((product) => (
                      <CardProduct
                        key={product.id}
                        product={product}
                        onDelete={() => deleteProduct({ id: product.id })}
                        onUpdate={() =>
                          updateProduct({
                            id: product.id,
                            isFavorite: !product.isFavorite,
                          })
                        }
                      />
                    ))
                  : null}
              </section>
            </Grid.Col>
          </Grid>
        </LayoutPage>
      ) : (
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
                {!showPublic && products?.length > 0
                  ? products.map((product) => (
                      <CardProduct
                        key={product.id}
                        product={product}
                        onDelete={() => deleteProduct({ id: product.id })}
                        onUpdate={() =>
                          updateProduct({
                            id: product.id,
                            isFavorite: !product.isFavorite,
                          })
                        }
                      />
                    ))
                  : publicProducts.map((product) => (
                      <CardProduct
                        key={product.id}
                        product={product}
                        onDelete={() => deleteProduct({ id: product.id })}
                        onUpdate={() =>
                          updateProduct({
                            id: product.id,
                            isFavorite: !product.isFavorite,
                          })
                        }
                      />
                    ))}
              </section>
            </Grid.Col>
          </Grid>
        </LayoutDashboard>
      )}
    </>
  );
}
