import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import NotificationPopupSkeleton from './Skeleton';

export default {
  title: 'Design System/SC UI/Skeleton/NotificationPopup',
  component: NotificationPopupSkeleton,
} as ComponentMeta<typeof NotificationPopupSkeleton>;

const Template: ComponentStory<typeof NotificationPopupSkeleton> = (args) => (
  <div style={{width: 400, height: '600px'}}>
    <NotificationPopupSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
