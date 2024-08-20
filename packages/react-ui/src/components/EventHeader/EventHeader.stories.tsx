import type { Meta, StoryObj } from '@storybook/react';

import EventHeader from './index';
import { Grid, Stack } from '@mui/material';


export default {
  title: 'Design System/React UI/Event Header',
  component: EventHeader,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'Event Id'
    }
  },
  args: {
    eventId: 113
  }
} as Meta<typeof EventHeader>;

const BaseTemplate = (args) => (
  <div style={{width: '100%'}}>
    <EventHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof EventHeader> = {
  args: {
    eventId: 113
  },
  render: BaseTemplate
};

const NotifyChangeEventTemplate = (args) => (
	<div style={{width: '100%'}}>
		<EventHeader {...args} />
		<br/>
		<Grid container spacing={2}>
			<Grid xs={6} item>
				{/*<EventRequestsWidget {...args} />*/}
			</Grid>
			<Grid xs={6} item>
				{/*<EventMembersWidget {...args} />*/}
			</Grid>
			<Grid xs={6} item>
				{/*<EventInfoWidget {...args} />*/}
			</Grid>
		</Grid>
	</div>
);

export const NotifyChangeEvent: StoryObj<typeof EventHeader> = {
	args: {
		eventId: 113
	},
	render: NotifyChangeEventTemplate
};
