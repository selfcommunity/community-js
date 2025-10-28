import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupActionsMenu, { GroupActionsMenuProps } from './index';

export default {
  title: 'Design System/React UI/GroupActionsMenu',
  component: GroupActionsMenu,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'event Id',
      table: {defaultValue: {summary: '184'}}
    }
  },
  args: {
    groupId: 184,
  }
} as Meta<typeof GroupActionsMenu>;

const template = (args: GroupActionsMenuProps) => <GroupActionsMenu {...args} />;

export const Base: StoryObj<typeof GroupActionsMenu> = {
  render: template
};
