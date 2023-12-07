import type { Meta, StoryObj } from '@storybook/react';
import UserSocialAssociation from './index';

export default {
  title: 'Design System/React UI/User Social Association ',
  component: UserSocialAssociation,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  },
  args: {
    userId: 7
  }
} as Meta<typeof UserSocialAssociation>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserSocialAssociation {...args} />
  </div>
);

export const Base: StoryObj<typeof UserSocialAssociation> = {
  args: {
    userId: 7,
    spacing: 2,
    direction: 'row',
    onCreateAssociation: (name) => () => console.log(name)
  },
  render: template
};
