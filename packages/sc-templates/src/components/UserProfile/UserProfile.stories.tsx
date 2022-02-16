import React, {useContext} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UserProfileTemplate from './index';
import {SCUserContext, SCUserContextType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/User Profile',
  component: UserProfileTemplate
} as ComponentMeta<typeof UserProfileTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileTemplate> = (args) => {
  const {userId, ...rest} = args;
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  let _userId = userId;
  if (userId === -1) {
    _userId = scUserContext.user.id;
  }

  return (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <UserProfileTemplate userId={_userId} {...rest} />
    </div>
  );
};

export const Main = Template.bind({});

Main.args = {
  userId: 1
};

export const Me = Template.bind({});

Me.args = {
  userId: -1
};
