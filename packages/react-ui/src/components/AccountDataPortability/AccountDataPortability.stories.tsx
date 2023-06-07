import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import AccountDataPortability from './AccountDataPortability';

export default {
  title: 'Design System/React UI/Account Data Portability',
  component: AccountDataPortability,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof AccountDataPortability>;

const Template: ComponentStory<typeof AccountDataPortability> = (args) => (
  <div style={{width: 600}}>
    <AccountDataPortability {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
