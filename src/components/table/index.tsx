import { ActionIcon, Anchor, Badge, Group, Table, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { type Product } from '~/types/product';

interface UsersTableProps {
  data: Product[];
}

export function TableSelection({ data }: UsersTableProps) {
  const rows = data?.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td width="20%">
        <Group>
          <Anchor fz="sm" fw={500} component={Link} href={`/products/${item.id}`}>
            {item.name}
          </Anchor>
        </Group>
      </Table.Td>

      <Table.Td width="20%">
        {item.categories.map(({ category }) => (
          <Badge mr={4} key={category.id} color="teal">
            {category.name}
          </Badge>
        ))}
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {item.sku}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" c="dimmed">
          {item.isFavorite && item.isFavorite.toString()}
        </Text>
      </Table.Td>
      <Table.Td width="8%">
        <Group>
          <ActionIcon>
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
      <Table mt={15} striped highlightOnHover withColumnBorders>
        <Table.Thead>
        <Table.Tr>
          <Table.Th>Product</Table.Th>
          <Table.Th>Categories</Table.Th>
          <Table.Th>SKU</Table.Th>
          <Table.Th>Favorite</Table.Th>
          <Table.Th />
        </Table.Tr>
        </Table.Thead>
        <tbody>{rows}</tbody>
      </Table>
  );
}
