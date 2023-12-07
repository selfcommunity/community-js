import type { Meta, StoryObj } from '@storybook/react';
import BroadcastMessages from './index';
import {CacheStrategies} from '@selfcommunity/utils';

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
} as Meta<typeof BroadcastMessages>;


const template = (args) => (
  <div style={{maxWidth: 700}}>
    <BroadcastMessages {...args} />
  </div>
);

export const Base: StoryObj<BroadcastMessages> = {
  render: template
};

export const BaseCached: StoryObj<BroadcastMessages> = {
  args: {
    viewAllMessages: true,
    disableLoader: true,
    cacheStrategy: CacheStrategies.CACHE_FIRST
  },
  render: template
};