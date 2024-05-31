import {
  ActionIcon,
  Badge,
  Burger,
  Code,
  Divider,
  Grid,
  Group,
  NavLink,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconMoonStars,
  IconPackages,
  IconPlus,
  IconSun,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { UserButton } from '~/components/userButton';
import ModalCreateProject from '~/components/modal/CreateProject';
import { api } from '~/utils/api';
import classes from './styles/LoggedIn.module.css';

const links = [
  { icon: IconLayoutDashboard, label: 'Dashboard', link: '/dashboard' },
  {
    icon: IconPackages,
    label: 'Products',
    childrenLinks: [
      { label: 'All Products', link: '/products' },
      { label: 'Public Products', link: '/products?show=public' },
    ],
  },
];

type linkType = {
  label: string;
  link: string;
  icon?: React.FC;
  childrenLinks?: linkType[];
};

export function LoggedInNavbar() {
  const [openMobile, setOpenMobile] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const onCreateProjectClick = () => {
    open();
  };

  const { data: projects } = api.project.getAll.useQuery();

  const renderNavLink = (link: linkType) => (
    <NavLink
      className={classes.mainLink}
      key={link.label}
      component={Link}
      href={link.link}
      label={link.label}
    />
  );

  const mainLinks = links.map((link) => {
    if (link.childrenLinks) {
      return (
        <NavLink key={link.label} label={link.label}>
          {link.childrenLinks.map((childLink) => renderNavLink(childLink))}
        </NavLink>
      );
    }
    return renderNavLink(link);
  });

  const projectLinks = projects?.map((project) => (
    <UnstyledButton
      key={project.id}
      className={classes.mainLink}
      component={Link}
      href={`/projects/${project.id}`}
    >
      <div className={classes.mainLinkInner}>
        <IconPackages size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <strong>{project.name}</strong>
      </div>
      <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
        {project.totalProjectProducts}
      </Badge>
    </UnstyledButton>
  ));

  return (
    <>
      {opened && <ModalCreateProject opened={opened} close={close} />}
      <header className={classes.header}>
        <Burger
          color="teal"
          opened={openMobile}
          onClick={() => setOpenMobile(!openMobile)}
          className={classes.burger}
        />
        <nav className={classes.navbar} style={{ display: openMobile ? 'block' : 'none' }}>
          <Grid align="center">
            <Grid.Col span="auto">
              <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
              </ActionIcon>
            </Grid.Col>
            <Grid.Col span={10}>
              <UserButton />
            </Grid.Col>
          </Grid>

          <Divider mb={10} />

          <TextInput
            placeholder="Search"
            size="xs"
            // icon={<IconSearch size='0.8rem' stroke={1.5} />}
            rightSectionWidth={70}
            rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
            mb="sm"
          />

          <section className={classes.section}>
            <div className={classes.mainLinks}>{mainLinks}</div>
          </section>

          <section className={classes.section}>
            <Group className={classes.collectionsHeader}>
              <Text size="xs">Projects</Text>
              <Tooltip label="Create Project" withArrow position="right">
                <ActionIcon variant="default" size={18} onClick={onCreateProjectClick}>
                  <IconPlus size="0.8rem" stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <div className={classes.collections}>{projectLinks}</div>
          </section>
        </nav>
      </header>
    </>
  );
}
