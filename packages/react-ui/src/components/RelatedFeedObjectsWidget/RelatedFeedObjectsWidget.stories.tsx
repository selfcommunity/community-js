import type { Meta, StoryObj } from '@storybook/react';
import RelatedFeedObjectsWidget from './index';
import {SCContributionType} from '@selfcommunity/types';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import SearchAutocomplete from '../SearchAutocomplete';

export default {
  title: 'Design System/React UI/Related Feed Objects Widget',
  component: RelatedFeedObjectsWidget,
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
  }
} as Meta<typeof RelatedFeedObjectsWidget>;

const template = (args) => (
  <div style={{maxWidth: 500}}>
    <RelatedFeedObjectsWidget {...args} />
  </div>
);

export const Base: StoryObj<SearchAutocomplete> = {
  args: {
    feedObjectId: 23,
    feedObjectType: SCContributionType.DISCUSSION,
    template: SCFeedObjectTemplateType.SNIPPET,
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
