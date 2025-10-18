import type { Meta, StoryObj } from '@storybook/react-webpack5';

import GroupHeader from './index';
import GroupInfoWidget from '../GroupInfoWidget';
import { Grid } from '@mui/material';
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
    groupId: 3
  }
} as Meta<typeof GroupHeader>;

const BaseTemplate = (args: any) => (
  <div style={{width: '100%'}}>
    <GroupHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupHeader> = {
  args: {
    groupId: 3
  },
  render: BaseTemplate
};

const NotifyChangeGroupTemplate = (args: any) => (
	<div style={{width: '100%'}}>
		<GroupHeader {...args} />
		<br/>
		<Grid container width="100%" spacing={2}>
			<Grid size={6}>
				<GroupRequestsWidget {...args} />
			</Grid>
			<Grid size={6}>
				<GroupMembersWidget {...args} />
			</Grid>
			<Grid size={6}>
				<GroupInfoWidget {...args} />
			</Grid>
		</Grid>
	</div>
);

export const NotifyChangeGroup: StoryObj<typeof GroupHeader> = {
	args: {
		groupId: 3
	},
	render: NotifyChangeGroupTemplate
};
