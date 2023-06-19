import type { Meta, StoryObj } from '@storybook/react';
import RelatedFeedObjectsWidget from './index';
import {SCContributionType} from '@selfcommunity/types';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import SearchAutocomplete from '../SearchAutocomplete';

export default {
  title: 'Design System/React UI/Related Feed Objects Widget',
  component: RelatedFeedObjectsWidget,
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
