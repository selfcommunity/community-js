import type { Meta, StoryObj } from '@storybook/react';
import PlatformWidget from './index';
import { Button, Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import Icon from '@mui/material/Icon';

export default {
  title: 'Design System/React UI/PlatformWidget ',
  component: PlatformWidget
} as Meta<typeof PlatformWidget>;

const template = (args) => (
  <div style={{width: 450}}>
    <PlatformWidget {...args} />
  </div>
);

export const Base: StoryObj<PlatformWidget> = {
  args: {
    contained: true,
  },
  render: template
};

export const Custom: StoryObj<PlatformWidget> = {
	args: {
		contained: true,
		title: <Typography component="h3" align="center">
			SelfCommunity
		</Typography>,
		startActions: [{render:
			<Button variant="outlined" size="small" onClick={() => console.log('action')}>
				Custom Action
			</Button>, title: 'Custom Action', content: 'Custom description'}]
	},
	render: template
};
