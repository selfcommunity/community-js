import type { Meta, StoryObj } from '@storybook/react';
import CategoryTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Category',
  component: CategoryTemplate
} as Meta<typeof CategoryTemplate>;

export const Base: StoryObj<typeof CategoryTemplate> = {
  args: {
    categoryId: 1,

  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <CategoryTemplate {...args} />
    </div>)
};

export const BaseContainerFixed: StoryObj<typeof CategoryTemplate> = {
	args: {
		categoryId: 1
	},
	render: (args) => {
		return <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1000, maxWidth: '100% !important', height: '100vh', overflow: 'auto'}} id="scrollableDiv">
			<CategoryTemplate {...args} CategoryFeedProps={{FeedProps: {InfiniteScrollComponentProps: {scrollableTarget: 'scrollableDiv'}, VirtualizedScrollerProps: {getScrollableContainer: () => document.getElementById('scrollableDiv')}}}} />
		</div>;
	}
};
