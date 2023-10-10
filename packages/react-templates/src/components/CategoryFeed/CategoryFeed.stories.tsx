import type { Meta, StoryObj } from '@storybook/react';
import CategoryFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Category Feed',
  component: CategoryFeedTemplate
} as Meta<typeof CategoryFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof CategoryFeedTemplate> = {
  args: {
    categoryId: 1
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <CategoryFeedTemplate {...args} />
    </div>)
};

export const BaseContainerFixed: StoryObj<typeof CategoryTemplate> = {
	args: {
		categoryId: 1
	},
	render: (args) => {
		return <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1000, maxWidth: '100% !important', height: '100vh', overflow: 'auto'}} id="scrollableDiv">
			<CategoryFeedTemplate {...args} FeedProps={{InfiniteScrollComponentProps: {scrollableTarget: 'scrollableDiv'}}} />
		</div>;
	}
};
