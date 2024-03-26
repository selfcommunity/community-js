import type { Meta, StoryObj } from '@storybook/react';
import Groups from './index';
import { Endpoints } from '@selfcommunity/api-services';

export default {
  title: 'Design System/React UI/Groups',
  component: Groups,
  argTypes: {
    endpoint: {
      ...Endpoints.GetAllGroups,
      url: () => Endpoints.GetAllGroups.url()
    }
  }
} as Meta<typeof Groups>;


const template = (args) => (
  <div style={{maxWidth: 1280}}>
    <Groups {...args} />
  </div>
);

export const Base: StoryObj<Groups> = {
  args: {
    endpoint: {
      ...Endpoints.GetAllGroups,
      url: () => Endpoints.GetAllGroups.url()
    }
  },
  render: template
};

