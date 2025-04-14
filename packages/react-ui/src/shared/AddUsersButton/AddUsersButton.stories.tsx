import type { Meta, StoryObj } from '@storybook/react';
import AddUsersButton from './index';

export default {
  title: 'Design System/React UI Shared/AddUsersButton',
  component: AddUsersButton,
  args: {
    label: 'Aggiungi utenti al corso',
    isUpdating: false
  }
} as Meta<typeof AddUsersButton>;


export const Base: StoryObj<typeof AddUsersButton> = {};
