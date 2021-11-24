import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import FeedObjectSkeleton from './FeedObjectSkeleton';
import {FeedObjectComponentType} from '../FeedObject';

export default {
  title: 'Design System/SC UI/Skeleton/FeedObject',
  component: FeedObjectSkeleton,
  argTypes: {
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      defaultValue: 'elevation',
      table: {defaultValue: {summary: 'elevation'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      defaultValue: 1,
      table: {defaultValue: {summary: 1}}
    },
    type: {
      options: [FeedObjectComponentType.SNIPPET, FeedObjectComponentType.PREVIEW, FeedObjectComponentType.DETAIL],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.',
      defaultValue: FeedObjectComponentType.SNIPPET,
      table: {defaultValue: {summary: FeedObjectComponentType.SNIPPET}}
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
  }
} as ComponentMeta<typeof FeedObjectSkeleton>;

const Template: ComponentStory<typeof FeedObjectSkeleton> = (args) => (
  <div style={{width: 400}}>
    <FeedObjectSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
