import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import AccountDelete from './AccountDelete';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/Account Delete',
  component: AccountDelete,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof AccountDelete>;

const Template: ComponentStory<typeof AccountDelete> = (args) => (
  <div style={{width: 600}}>
    <AccountDelete {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
