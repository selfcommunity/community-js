import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import NotificationPopupSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/NotificationPopup',
  component: NotificationPopupSkeleton,
} as ComponentMeta<typeof NotificationPopupSkeleton>;

const Template: ComponentStory<typeof NotificationPopupSkeleton> = (args) => (
  <div style={{width: 280}}>
    <NotificationPopupSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
