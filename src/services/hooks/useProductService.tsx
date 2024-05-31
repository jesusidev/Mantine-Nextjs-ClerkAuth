import { notifications } from '@mantine/notifications';
import { v4 as uuidv4 } from 'uuid';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { api } from '~/utils/api';
import { Product } from '~/types/product';

export function useProductService() {
  const trpc = api.useUtils();

  let previousProducts: Product[] = [];

  function getPreviousProducts(id?: Product['projectId']) {
    const data = id
      ? trpc.product.getAll.getData({ projectId: id })
      : trpc.product.getAll.getData();
    previousProducts = data ?? [];
  }

  function publicProducts(projectId?: Product['projectId']) {
    const { data, isLoading, isError } = projectId
      ? api.product.getAllPublic.useQuery({ projectId })
      : api.product.getAllPublic.useQuery();
    return { publicProducts: data, isLoading, isError };
  }

  function products(projectId?: Product['projectId']) {
    const { data, isLoading, isError } = projectId
      ? api.product.getAll.useQuery({ projectId })
      : api.product.getAll.useQuery();
    return { products: data, isLoading, isError };
  }

  function get(productId: Product['id']) {
    const { data, isLoading, isError } = api.product.get.useQuery({ id: productId });

    return { product: data, isLoading, isError };
  }

  function create() {
    const { mutate, isLoading, isSuccess } = api.product.create.useMutation({
      onMutate: async ({ name, brand, sku, isFavorite, quantity, projectId }) => {
        await trpc.product.getAll.cancel();
        const uuid = uuidv4();
        getPreviousProducts(projectId);
        const newProducts: Product[] = [
          {
            id: `${uuid}-loading`,
            name: name ?? 'New Product',
            brand: brand ?? 'No Brand',
            isFavorite: isFavorite ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
            sku: sku ?? '',
            userId: 'placeholder_userId',
            storeId: 'placeholder_storeId',
            projectId: projectId ?? 'placeholder_projectId',
            remaining: {
              id: 'new',
              quantity: quantity ?? 0,
              productId: 'new',
            },
            categories: [],
            favoriteProducts: [],
          },
          ...previousProducts,
        ];
        trpc.product.getAll.setData(
          projectId ? { projectId: projectId as string } : undefined,
          newProducts
        );
        return { uuid, newProducts };
      },
      onSuccess: (data, variables, context) => {
        const newProducts = context?.newProducts.map((product) =>
          product.id === `${context?.uuid}-loading` ? { ...product, ...data } : product
        );
        trpc.product.getAll.setData(
          data.projectId ? { projectId: data.projectId } : undefined,
          newProducts
        );
        notifications.show({
          id: variables.name,
          title: 'Item Created',
          message: `Item ${variables.name} has been created successfully`,
          color: 'green.5',
          icon: <IconCircleCheck />,
        });
      },
      onError: (error, variables, context) => {
        const removeNewProduct = context?.newProducts.filter(
          (product) => product.name !== variables.name
        );
        trpc.product.getAll.setData(undefined, removeNewProduct);
        notifications.show({
          id: variables.name,
          title: 'Unable to update',
          message: `${error.message}`,
          color: 'red.5',
          icon: <IconCircleX />,
        });
      },
    });

    return { createProduct: mutate, isLoading, isSuccess };
  }

  function deleteProduct() {
    function byProject(projectId: Product['projectId']) {
      getPreviousProducts(projectId);
      const { mutate, isLoading } = api.product.delete.useMutation({
        onMutate: async ({ id }) => {
          await trpc.product.getAll.cancel();
          getPreviousProducts(projectId);
          trpc.product.getAll.setData(
            { projectId: projectId as string },
            previousProducts.filter((product) => product.id !== id)
          );
        },
        onSuccess: (product) => {
          notifications.show({
            id: product.id,
            title: 'Product Deleted',
            message: `Product ${product.name} has been deleted successfully`,
            color: 'green.5',
          });
        },
        onError: (error, product) => {
          notifications.show({
            id: product.id,
            title: 'Unable to delete',
            message: `${error.message}`,
            color: 'red.5',
          });
        },
      });
      return { deleteProduct: mutate, isLoading };
    }

    const { mutate, isLoading } = api.product.delete.useMutation({
      onMutate: async ({ id }) => {
        await trpc.product.getAll.cancel();
        getPreviousProducts();
        trpc.product.getAll.setData(
          undefined,
          previousProducts.filter((product) => product.id !== id)
        );
      },
      onSuccess: (product) => {
        notifications.show({
          id: product.id,
          title: 'Product Deleted',
          message: `Product ${product.name} has been deleted successfully`,
          color: 'green.5',
        });
      },
      onError: (error, product) => {
        notifications.show({
          id: product.id,
          title: 'Unable to delete',
          message: `${error.message}`,
          color: 'red.5',
        });
      },
    });

    return { deleteProduct: mutate, isLoading, byProject };
  }

  function updateProduct() {
    function byProject(projectId: Product['projectId']) {
      getPreviousProducts(projectId);
      const { mutate, isLoading } = api.product.update.useMutation({
        onMutate: async ({ id, isFavorite }) => {
          await trpc.product.getAll.cancel();
          getPreviousProducts(projectId);
          trpc.product.getAll.setData(
            { projectId: projectId as string },
            previousProducts.map((product) =>
              product.id === id
                ? {
                    ...product,
                    name: product.name,
                    isFavorite: isFavorite ?? product.isFavorite,
                    brand: product.brand,
                    sku: product.sku,
                  }
                : product
            )
          );
        },
        onSuccess: (product) => {
          notifications.show({
            id: product.id,
            title: 'Product Updated',
            message: `Product ${product.name} has been updated successfully`,
            color: 'green.5',
          });
        },
        onError: (error, product) => {
          notifications.show({
            id: product.id,
            title: 'Unable to update product',
            message: `Product ${product.name}:: ${error.message}`,
            color: 'red.5',
          });
        },
      });
      return { updateProduct: mutate, isLoading };
    }

    const { mutate, isLoading } = api.product.update.useMutation({
      onMutate: async ({ id, isFavorite, categoryName }) => {
        await trpc.product.getAll.cancel();
        getPreviousProducts();

        await trpc.product.get.cancel({ id });

        trpc.product.get.setData({ id }, (old) => {
          if (!old) return old;

          return {
            ...old,
            name: old.name,
            isFavorite: isFavorite ?? old.isFavorite,
            brand: old.brand,
            sku: old.sku,
            categories: categoryName
              ? ([
                  ...old.categories,
                  { category: { name: categoryName } },
                ] as (typeof old.categories)[number][])
              : old.categories,
          };
        });

        trpc.product.getAll.setData(
          undefined,
          previousProducts.map((product) =>
            product.id === id
              ? {
                  ...product,
                  name: product.name,
                  isFavorite: isFavorite ?? product.isFavorite,
                  brand: product.brand,
                  sku: product.sku,
                  categories: categoryName
                    ? ([
                        ...product.categories,
                        {
                          category: { name: categoryName },
                        },
                      ] as (typeof product.categories)[number][])
                    : product.categories,
                }
              : product
          )
        );
      },
      onSuccess: (product) => {
        notifications.show({
          id: product.id,
          title: 'Product Updated',
          message: `Product ${product.name} has been updated successfully`,
          color: 'green.5',
        });
      },
      onError: (error, product) => {
        notifications.show({
          id: product.id,
          title: 'Unable to update product',
          message: `Product ${product.name}:: ${error.message}`,
          color: 'red.5',
        });
      },
    });

    return { updateProduct: mutate, isLoading, byProject };
  }

  return { get, publicProducts, products, create, delete: deleteProduct, update: updateProduct };
}
