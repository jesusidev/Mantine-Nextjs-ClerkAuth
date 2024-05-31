import { Grid } from '@mantine/core';
import React from 'react';
import { LoggedInNavbar } from '~/components/navigation/loggedIn';

type LayoutDashboardProps = {
  children: React.ReactNode;
};
export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <Grid gutter="sm" align="stretch">
      <Grid.Col span={{ base: 12, lg: 3 }}>
        <LoggedInNavbar />
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 9 }} component="main">
        {children}
      </Grid.Col>
    </Grid>
  );
}
