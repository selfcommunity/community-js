import type { Meta, StoryObj } from '@storybook/react';
import GroupFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Group Feed',
  component: GroupFeedTemplate
} as Meta<typeof GroupFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof GroupFeedTemplate> = {
  args: {
    groupId: 3
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <GroupFeedTemplate {...args} />
    </div>)
};

export const BaseContainerFixed: StoryObj<typeof CategoryTemplate> = {
	args: {
		groupId: 3
	},
	render: (args) => {
		return <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1, maxWidth: '100% !important', height: '92vh', overflow: 'auto'}} id="scrollableDiv">
			<GroupFeedTemplate {...args} FeedProps={{scrollableTargetId: 'scrollableDiv'}} />
		</div>;
	}
};
