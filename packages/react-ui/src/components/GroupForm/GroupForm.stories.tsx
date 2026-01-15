import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupForm, { GroupFormProps } from './index';

export default {
  title: 'Design System/React UI/Group Form',
  component: GroupForm,
} as Meta<typeof GroupForm>;

const template = (args: GroupFormProps) => (
  <div style={{width: 800}}>
    <GroupForm{...args} />
  </div>
);


export const Base: StoryObj<GroupFormProps> = {
  args: {},
  render: template
};