import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import {
  IconBoxSeam,
  IconBuildingStore,
  IconClipboardList,
  IconHeart,
  IconHeartFilled,
  IconListDetails,
  IconTags,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { InputText } from '~/components/input/InputText';
import { InputNumber } from '~/components/input/InputNumber';
import { useProductService } from '~/services/hooks/useProductService';

export function ModalCreateProduct({ opened, close }: { opened: boolean; close: () => void }) {
  const form = useForm({
    initialValues: {
      product: {
        name: '',
        brand: '',
        sku: '',
        isFavorite: false,
      },
      remaining: {
        quantity: 0,
      },
    },
    validate: {
      product: {
        name: (value) => (value.length < 1 ? 'Product name must have a name' : null),
      },
      remaining: {
        quantity: (value) => (value < 0 ? 'Quantity must be greater than 0' : null),
      },
    },
  });

  const { createProduct, isSuccess, isLoading } = useProductService().create();

  function onSubmitForm(values: any) {
    const product = {
      name: values.name,
      brand: values.brand,
      sku: values.sku,
      isFavorite: values.isFavorite,
      quantity: values.quantity,
    };
    createProduct(product);
  }

  if (isSuccess) close();

  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={close}
      title="Create New Product"
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Tabs defaultValue="product" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="product" leftSection={<IconBoxSeam size="0.8rem" />}>
            Product
          </Tabs.Tab>
          <Tabs.Tab value="remaining" leftSection={<IconListDetails size="0.8rem" />}>
            Remaining
          </Tabs.Tab>
          <Tabs.Tab value="store" leftSection={<IconBuildingStore size="0.8rem" />}>
            Store
          </Tabs.Tab>
          <Tabs.Tab value="project" leftSection={<IconClipboardList size="0.8rem" />}>
            Project
          </Tabs.Tab>
          <Tabs.Tab value="categories" leftSection={<IconTags size="0.8rem" />}>
            Categories
          </Tabs.Tab>
        </Tabs.List>
        <form
          onSubmit={form.onSubmit((values) =>
            onSubmitForm({
              name: values.product.name,
              brand: values.product.brand,
              sku: values.product.sku,
              isFavorite: values.product.isFavorite,
              quantity: values.remaining.quantity,
            })
          )}
        >
          <Tabs.Panel value="product" pt="xs">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
              <InputText
                withAsterisk
                label="Product Name:"
                {...form.getInputProps('product.name')}
              />
              <InputText label="Brand Name:" {...form.getInputProps('product.brand')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
              <InputText label="SKU:" {...form.getInputProps('product.sku')} />
              <Stack>
                <Text>Favorite?</Text>
                <ActionIcon
                  variant="heart"
                  radius="md"
                  size={36}
                  onClick={() =>
                    form.setValues({
                      ...form.values,
                      product: {
                        ...form.values.product,
                        isFavorite: !form.values.product.isFavorite,
                      },
                    })
                  }
                >
                  {form.values.product.isFavorite ? (
                    <IconHeartFilled size="1.1rem" stroke={1.5} />
                  ) : (
                    <IconHeart size="1.1rem" stroke={1.5} />
                  )}
                </ActionIcon>
              </Stack>
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="remaining" pt="xs">
            <InputNumber label="Quantity:" {...form.getInputProps('remaining.quantity')} />
          </Tabs.Panel>

          <Tabs.Panel value="store" pt="xs">
            store tab content
          </Tabs.Panel>

          <Tabs.Panel value="project" pt="xs">
            project tab content
          </Tabs.Panel>

          <Tabs.Panel value="categories" pt="xs">
            categories tab content
          </Tabs.Panel>
          <Divider my="sm" />
          <Group>
            <Button loading={isLoading} type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Tabs>
    </Modal>
  );
}
