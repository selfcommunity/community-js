import type { Meta, StoryObj } from '@storybook/react';
import FeedObjectSkeleton, { FeedObjectSkeletonProps } from './Skeleton';
import {SCFeedObjectTemplateType} from '../../types/feedObject';

export default {
  title: 'Design System/React UI/Skeleton/FeedObject',
  component: FeedObjectSkeleton,
  argTypes: {
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    template: {
      options: [SCFeedObjectTemplateType.SNIPPET, SCFeedObjectTemplateType.PREVIEW, SCFeedObjectTemplateType.DETAIL],
      control: {type: 'select'},
      description: 'Object template. Used only with args id.',
      table: {defaultValue: {summary: SCFeedObjectTemplateType.SNIPPET}}
    },
    className: {
      table: {
        disable: true
      }
    },
    rest: {
      table: {
        disable: true
      }
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation',
    template: SCFeedObjectTemplateType.DETAIL
  }
} as Meta<typeof FeedObjectSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <FeedObjectSkeleton {...args} />
  </div>
);

export const Base: StoryObj<FeedObjectSkeletonProps> = {
  args: {
    elevation: 1,
    variant: 'elevation',
    template: SCFeedObjectTemplateType.DETAIL
  },
  render: template
};
