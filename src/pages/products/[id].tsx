import { useRouter } from 'next/router';
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBuildingStore,
  IconCategory2,
  IconClipboardList,
  IconHeart,
  IconHeartFilled,
  IconListDetails,
  IconPlus,
  IconTags,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import LayoutDashboard from '~/layouts/dashboard';
import LayoutPage from '~/layouts/page';
import { useProductService } from '~/services/hooks/useProductService';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isSignedIn } = useUser();

  const { updateProduct } = useProductService().update();
  const { product, isLoading } = useProductService().get(id as string);

  const [showField, setShowField] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const AddCategory = () => (
    <>
      <Button
        mb={10}
        leftSection={<IconPlus size="0.8rem" stroke={1.5} />}
        onClick={() => setShowField(!showField)}
      >
        Add category
      </Button>
      {showField && (
        <TextInput
          mb={10}
          leftSection={<IconCategory2 size="1.1rem" stroke={1.5} />}
          radius="xl"
          size="md"
          ref={inputRef}
          rightSection={
            <ActionIcon
              size={32}
              radius="xl"
              variant="filled"
              onClick={() => {
                if (inputRef.current) {
                  updateProduct({
                    categoryName: inputRef.current.value,
                    id: id as string,
                  });
                  inputRef.current.value = '';
                }
              }}
            >
              <IconArrowRight size="1.1rem" stroke={1.5} />
            </ActionIcon>
          }
          placeholder="Add category"
          rightSectionWidth={42}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateProduct({
                categoryName: e.currentTarget.value,
                id: id as string,
              });
              e.currentTarget.value = '';
            }
          }}
        />
      )}
    </>
  );

  const ProductInformation = () => (
    <>
      <Container my="md">
        <SimpleGrid cols={1} spacing="md">
          <Group>
            <h1>Product: {product?.name}</h1>
            <ActionIcon
              variant="heart"
              radius="md"
              size={36}
              onClick={() => {
                updateProduct({
                  id: id as string,
                  isFavorite: !product?.isFavorite,
                });
              }}
            >
              {isSignedIn && product?.isFavorite ? (
                <IconHeartFilled size="1.1rem" stroke={1.5} />
              ) : (
                <IconHeart size="1.1rem" stroke={1.5} />
              )}
            </ActionIcon>
          </Group>
          {isLoading ? (
            <Skeleton height="30rem" radius="md" animate />
          ) : (
            <Tabs variant="outline" defaultValue="categories">
              <Tabs.List>
                <Tabs.Tab value="categories" leftSection={<IconTags size="0.8rem" />}>
                  Categories
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
              </Tabs.List>

              <Tabs.Panel value="categories" pt="xs">
                {isSignedIn && <AddCategory />}
                <Group>
                  Categories:
                  {product?.categories?.map(({ category }) => (
                    <Badge key={category.id}>{category.name}</Badge>
                  ))}
                </Group>
              </Tabs.Panel>

              <Tabs.Panel value="remaining" pt="xs">
                <Text>Remaining: {product?.remaining?.quantity}</Text>
              </Tabs.Panel>

              <Tabs.Panel value="store" pt="xs">
                store tab content
              </Tabs.Panel>

              <Tabs.Panel value="project" pt="xs">
                project tab content
              </Tabs.Panel>
            </Tabs>
          )}
        </SimpleGrid>
      </Container>
    </>
  );

  return (
    <>
      {isSignedIn ? (
        <LayoutDashboard>
          <ProductInformation />
        </LayoutDashboard>
      ) : (
        <LayoutPage>
          <ProductInformation />
        </LayoutPage>
      )}
    </>
  );
}
