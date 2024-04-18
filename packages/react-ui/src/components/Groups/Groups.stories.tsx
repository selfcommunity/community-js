import type { Meta, StoryObj } from '@storybook/react';
import Groups from './index';
import { Endpoints } from '@selfcommunity/api-services';

export default {
  title: 'Design System/React UI/Groups',
  component: Groups,
  args: {
    endpoint: {
      ...Endpoints.SearchGroups,
      url: () => Endpoints.SearchGroups.url()
    },
    showFilters: 1,
  }
} as Meta<typeof Groups>;


const template = (args) => (
  <div style={{maxWidth: 1280}}>
    <Groups {...args} />
  </div>
);

export const Base: StoryObj<Groups> = {
  args: {
    general: true,
    endpoint: {
      ...Endpoints.SearchGroups,
      url: () => Endpoints.SearchGroups.url()
    }
  },
  render: template
};

export const UserGroups: StoryObj<Groups> = {
  args: {
    endpoint: {
      ...Endpoints.GetUserGroups,
      url: () => Endpoints.GetUserGroups.url()
    }
  },
  render: template
};


