import {
  IconDots,
  IconEdit,
  IconHash,
  IconHeart,
  IconHeartFilled,
  IconShoppingBag,
  IconTags,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Card as MantineCard,
  Center,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  Tooltip,
} from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { Prisma } from '@prisma/client';
import classes from './styles/CardProduct.module.css';
import { mergeclasses } from '~/utils';

interface LoadingOverlayProps {
  visible: boolean;
}

interface HeaderProps {
  children?: React.ReactNode;
  title: string;
  link: string;
}

interface ImageProps {
  image: string;
  title: string;
  link: string;
}

interface DescriptionProps {
  description: string;
}

interface DetailsProps {
  quantity?: number;
  brand?: string;
  categories?: { category: Prisma.CategoryGetPayload<{}> }[];
}

interface ActionsProps {
  link: string;
  onFavoriteClick: () => void;
  isFavorite: boolean;
}

interface ProductCardProps {
  children: React.ReactNode;
}

interface ProductCardComponent extends React.FC<ProductCardProps> {
  LoadingOverlay: React.FC<LoadingOverlayProps>;
  Menu: React.FC<{ onDeleteClick: () => void }>;
  Header: React.FC<HeaderProps>;
  Image: React.FC<ImageProps>;
  Description: React.FC<DescriptionProps>;
  Details: React.FC<DetailsProps>;
  Actions: React.FC<ActionsProps>;
  VariantFull: React.FC<ProductCardProps>;
}

// Main component
function ProductCardBase({ children }: ProductCardProps) {
  return (
    <MantineCard withBorder className={classes.card} pos="relative">
      {children}
    </MantineCard>
  );
}

export const Card = ProductCardBase as ProductCardComponent;

// Variant component
Card.VariantFull = function VariantFull({ children }) {
  return (
    <MantineCard
      withBorder
      className={mergeclasses(classes?.card, classes?.cardVariantFull)}
      pos="relative"
    >
      {children}
    </MantineCard>
  );
};

// Sub-components
Card.LoadingOverlay = function LoadingOverlayDefault({ visible }) {
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={1}
      overlayProps={{ radius: 'sm', blur: 2 }}
      loaderProps={{ type: 'bars' }}
    />
  );
};

Card.Menu = function MenuDefault({ onDeleteClick }) {
  return (
    <Menu position="bottom-end" shadow="sm" withArrow arrowPosition="center">
      <Menu.Target>
        <ActionIcon>
          <IconDots size="1rem" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconEdit size={15} />}>Edit</Menu.Item>
        <Menu.Item leftSection={<IconTrash size={15} />} color="red.5" onClick={onDeleteClick}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

Card.Header = function Header({ title, link, children }) {
  return (
    <MantineCard.Section withBorder inheritPadding py="xs">
      <Group justify="space-between">
        <Text fw="800" component={Link} href={`products/${link}`} truncate>
          {title}
        </Text>
        {children || null}
      </Group>
    </MantineCard.Section>
  );
};

Card.Image = function Image({ image, title, link }) {
  return (
    <MantineCard.Section>
      <Text component={Link} href={`products/${link}`}>
        <img
          src={image}
          width={333}
          height={200}
          alt={`product for ${title}`}
          className={classes.productImage}
        />
      </Text>
    </MantineCard.Section>
  );
};

Card.Description = function Description({ description }) {
  return (
    <Text fz="xs" my={5} lineClamp={4}>
      {description}
    </Text>
  );
};

Card.Details = function Details({ quantity, brand, categories }) {
  return (
    <MantineCard.Section className={classes.section} mt="md">
      <Group mb={-8}>
        {quantity && (
          <Center>
            <Tooltip label="Quantity" withArrow position="top">
              <IconHash size="1.05rem" className={classes.icon} stroke={1.5} />
            </Tooltip>
            <Text size="xs">{quantity}</Text>
          </Center>
        )}
        {brand && (
          <Center>
            <Tooltip label="Brand" withArrow position="top">
              <IconShoppingBag size="1.05rem" className={classes.icon} stroke={1.5} />
            </Tooltip>
            <Text size="xs">{brand}</Text>
          </Center>
        )}
        {categories !== undefined && (
          <Center>
            <Tooltip label="Categories" withArrow position="top">
              <IconTags size="1.05rem" className={classes.icon} stroke={1.5} />
            </Tooltip>
            <Text size="xs">{categories[0]?.category.name}</Text>
          </Center>
        )}
      </Group>
    </MantineCard.Section>
  );
};

Card.Actions = function Actions({ link, onFavoriteClick, isFavorite }) {
  return (
    <Group mt="xs">
      <Button style={{ flex: 1 }} component={Link} href={`products/${link}`}>
        Show details
      </Button>
      <Tooltip label="Favorite" withArrow position="top">
        <ActionIcon variant="heart" size={36} onClick={onFavoriteClick}>
          {isFavorite ? (
            <IconHeartFilled size="1.1rem" stroke={1.5} />
          ) : (
            <IconHeart size="1.1rem" stroke={1.5} />
          )}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
