import type { Meta, StoryObj } from '@storybook/react-webpack5';
import RelatedFeedObjectsWidget, { RelatedFeedObjectWidgetProps } from './index';
import {SCContributionType} from '@selfcommunity/types';
import {SCFeedObjectTemplateType} from '../../types/feedObject';

export default {
  title: 'Design System/React UI/Related Feed Objects Widget',
  component: RelatedFeedObjectsWidget,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: '67522'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: '1'}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
} as Meta<typeof RelatedFeedObjectsWidget>;

const template = (args: RelatedFeedObjectWidgetProps) => (
  <div style={{maxWidth: 500}}>
    <RelatedFeedObjectsWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof RelatedFeedObjectsWidget> = {
  args: {
    feedObjectId: 1673,
    feedObjectType: SCContributionType.POST,
    template: SCFeedObjectTemplateType.SNIPPET,
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
