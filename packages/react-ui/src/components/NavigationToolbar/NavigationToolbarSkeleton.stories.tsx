import type { Meta } from '@storybook/react-webpack5';
import NavigationToolbarSkeleton from './Skeleton';
import { AppBar } from '@mui/material';

export default {
  title: 'Design System/React UI/Skeleton/Navigation Toolbar',
  component: NavigationToolbarSkeleton,
} as Meta<typeof NavigationToolbarSkeleton>;

const MainTemplate = () => (
  <AppBar position="relative">
    <NavigationToolbarSkeleton />
  </AppBar>
);

export const Main = MainTemplate.bind({});