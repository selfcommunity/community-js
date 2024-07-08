import type { Meta, StoryObj } from '@storybook/react';

import GroupHeader from './index';
import GroupInfoWidget from '../GroupInfoWidget';
import { Grid, Stack } from '@mui/material';
import GroupRequestsWidget from '../GroupRequestsWidget';
import GroupMembersWidget from '../GroupMembersWidget';

export default {
  title: 'Design System/React UI/Group Header',
  component: GroupHeader,
  argTypes: {
    groupId: {
      control: {type: 'number'},
      description: 'Group Id'
    }
  },
  args: {
    groupId: 5
  }
} as Meta<typeof GroupHeader>;

const BaseTemplate = (args) => (
  <div style={{width: '100%'}}>
    <GroupHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupHeader> = {
  args: {
    groupId: 5
  },
  render: BaseTemplate
};

const NotifyChangeGroupTemplate = (args) => (
	<div style={{width: '100%'}}>
		<GroupHeader {...args} />
		<br/>
		<Grid container spacing={2}>
			<Grid xs={6} item>
				<GroupRequestsWidget {...args} />
			</Grid>
			<Grid xs={6} item>
				<GroupMembersWidget {...args} />
			</Grid>
			<Grid xs={6} item>
				<GroupInfoWidget {...args} />
			</Grid>
		</Grid>
	</div>
);

export const NotifyChangeGroup: StoryObj<typeof GroupHeader> = {
	args: {
		groupId: 5
	},
	render: NotifyChangeGroupTemplate
};
