import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Tags, {TagsComponentType} from './index';
import {SCTagType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI Shared/Tags',
  component: Tags,
  argTypes: {
    type: {
      options: [TagsComponentType.LIST, TagsComponentType.POPPER],
      control: {type: 'select'},
      description: 'Component type.',
      table: {defaultValue: {summary: TagsComponentType.POPPER}}
    },
    direction: {
      options: ['row', 'column'],
      control: {type: 'select'},
      description: 'The direction of the list.',
      table: {defaultValue: {summary: 'column'}}
    },
    title: {
      control: {type: 'text'},
      description: 'The title of the list or the popper.',
      table: {defaultValue: {summary: ''}}
    }
  },
  args: {
    type: TagsComponentType.POPPER,
    direction: 'column',
    title: ''
  }
} as ComponentMeta<typeof Tags>;

/**
 * Example of a tag
 */
const tags: SCTagType[] = [
  {
    id: 0,
    name: 'Gold partner',
    description: 'Gold Partner',
    color: '#f5e107',
    visible: true,
    visibility_boost: true,
    created_at: '2019-08-24T14:15:22Z',
    active: true,
    deleted: false
  },
  {
    id: 1,
    name: 'Silver partner',
    description: 'Silver Partner',
    color: '#918d8d',
    visible: true,
    visibility_boost: true,
    created_at: '2019-08-24T14:15:22Z',
    active: true,
    deleted: false
  },
  {
    id: 2,
    name: 'Bronze partner',
    description: 'Bronze Partner',
    color: '#d76f16',
    visible: true,
    visibility_boost: true,
    created_at: '2019-08-24T14:15:22Z',
    active: true,
    deleted: false
  }
];

const Template: ComponentStory<typeof Tags> = (args) => <Tags tags={tags} {...args} />;

export const Base = Template.bind({});

Base.args = {
  type: TagsComponentType.POPPER
};
