import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TagChip from './index';

export default {
  title: 'Design System/SC UI/TagChip',
  component: TagChip
} as ComponentMeta<typeof TagChip>;

const Template: ComponentStory<typeof TagChip> = (args) => (
  <div style={{width: 500}}>
    <TagChip scTagId={1} {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
