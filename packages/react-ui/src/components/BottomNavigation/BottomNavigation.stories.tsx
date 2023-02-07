import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import BottomNavigation from './index';
import { Mobile } from '../AppBar/AppBar.stories';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Bottom Navigation ',
  component: BottomNavigation,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof BottomNavigation>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BottomNavigation> = (args) => (
    <BottomNavigation {...args} />
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  routes: {
    home: '?path=/story/design-system-react-templates-main-feed--main',
    followings: `?path=/story/design-system-react-templates-user-profile--me`,
    //connections: '/connections'
    notifications: '?path=/story/design-system-react-templates-notification-feed--notification',
    followers: `?path=/story/design-system-react-templates-user-profile--me`,
    loyalty: `?path=/story/design-system-react-ui-loyalty-program-detail--base`,
    followedPosts: '?path=/story/design-system-react-templates-user-profile--me',
    followedDiscussions: '?path=/story/design-system-react-templates-user-profile--me',
    peopleSuggestion: '?path=/story/design-system-react-templates-user-profile--me',
    messages: '?path=/story/design-system-react-templates-privatemessages--base',
    settings: `?path=/story/design-system-react-ui-user-profile-edit--base`,
    explore: '?path=/story/design-system-react-templates-explore-feed--main',
    logout: '/'
  },
  value: '?path=/story/design-system-react-templates-explore-feed--main'
};

Base.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
}
