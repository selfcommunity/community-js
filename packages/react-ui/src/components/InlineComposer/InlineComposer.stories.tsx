import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import InlineComposer from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Inline Composer',
  component: InlineComposer
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof InlineComposer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InlineComposer> = (args) => (
  <div style={{maxWidth: 500}}>
    <InlineComposer {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
