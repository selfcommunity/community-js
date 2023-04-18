import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import InlineComposerWidget from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Inline Composer Widget',
  component: InlineComposerWidget
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof InlineComposerWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InlineComposerWidget> = (args) => (
  <div style={{maxWidth: 500}}>
    <InlineComposerWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
