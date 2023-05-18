import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import BroadcastMessages from './index';
import {CacheStrategies} from '@selfcommunity/utils';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Broadcast Messages',
  component: BroadcastMessages,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof BroadcastMessages>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BroadcastMessages> = (args) => (
  <div style={{maxWidth: 700}}>
    <BroadcastMessages {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};

export const BaseCached = Template.bind({});

BaseCached.args = {
  viewAllMessages: true,
  disableLoader: true,
  cacheStrategy: CacheStrategies.CACHE_FIRST
};
