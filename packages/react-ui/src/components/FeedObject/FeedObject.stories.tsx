import type { Meta, StoryObj } from '@storybook/react';
import FeedObject from './index';
import { SCFeedObjectTemplateType } from '../../types/feedObject';
import { SCContributionType } from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/FeedObject',
  component: FeedObject,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 9}}
    },
    feedObjectType: {
      options: [SCContributionType.POST, SCContributionType.DISCUSSION, SCContributionType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    },
    template: {
      options: [SCFeedObjectTemplateType.SEARCH, SCFeedObjectTemplateType.SNIPPET, SCFeedObjectTemplateType.PREVIEW, SCFeedObjectTemplateType.DETAIL, SCFeedObjectTemplateType.SHARE],
      control: {type: 'select'},
      description: 'Object template. Used only with args id.',
      table: {defaultValue: {summary: SCFeedObjectTemplateType.SNIPPET}}
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
    template: SCFeedObjectTemplateType.DETAIL,
    elevation: 0,
    variant: 'outlined'
  }

} as Meta<typeof FeedObject>;

const template = (args) => {
  return (<div style={{width: '100%', maxWidth: 800}}>
    <FeedObject {...args} />
  </div>);
};


export const Base: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 1453,
    feedObjectType: SCContributionType.POST
  },
  render: template
};

export const CacheBase: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 1372,
    feedObjectType: SCContributionType.DISCUSSION
  },
  render: template
};

export const BaseWithImage: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 404,
    feedObjectType: SCContributionType.DISCUSSION
  },
  render: template
};


export const BaseWithImage2: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 328,
    feedObjectType: SCContributionType.POST
  },
  render: template
};

export const BaseWithImage3: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 380,
    feedObjectType: SCContributionType.POST
  },
  render: template
};

export const BaseWithImage3More: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 1377,
    feedObjectType: SCContributionType.POST
  },
  render: template
};

export const BaseWithVideo: StoryObj<FeedObject> = {
  args: {
    feedObjectId: 55,
    feedObjectType: SCContributionType.DISCUSSION
  },
  render: template
};

