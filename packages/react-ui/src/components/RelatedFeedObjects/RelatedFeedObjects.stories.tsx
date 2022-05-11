import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import RelatedFeedObjects from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types';
import {SCFeedObjectTemplateType} from '../../types/feedObject';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Related Feed Objects',
  component: RelatedFeedObjects,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 67522}}
    },
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
    feedObjectId: 23,
    feedObjectType: SCFeedObjectTypologyType.DISCUSSION,
    template: SCFeedObjectTemplateType.SNIPPET,
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof RelatedFeedObjects>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RelatedFeedObjects> = (args) => (
  <div style={{maxWidth: 500}}>
    <RelatedFeedObjects {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
