import type { Meta, StoryObj } from '@storybook/react';
import UserSuggestionWidget from './index';

export default {
  title: 'Design System/React UI/User Suggestion Widget',
  component: UserSuggestionWidget,
} as Meta<typeof UserSuggestionWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserSuggestionWidget {...args} />
  </div>
);

export const Base: StoryObj<UserSuggestionWidget> = {
  render: template
}
