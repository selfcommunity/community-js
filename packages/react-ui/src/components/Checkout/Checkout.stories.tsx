import type {Meta, StoryObj} from '@storybook/react';
import Checkout from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/Payments/Checkout',
  component: Checkout
} as Meta<typeof Checkout>;

const template = (args) => (
  <div style={{maxWidth: 1024}}>
    <Checkout {...args} />
  </div>
);

export const Base: StoryObj<typeof Checkout> = {
  args: {
    contentId: 37,
    contentType: SCContentType.EVENT,
    priceId: 5,
    clientSecret:
      'cs_test_b11dOvHh0YoaOpu1eQfwCFhg7iXrs2yNzdnpymnFxFtAn3TYxnTJGmLFrO_secret_fid2cXdsdWBEZmZqcGtxJz8nZGZmcVo0V0hWQUJVXzxxQmBLM0dkJyknZHVsTmB8Jz8ndW5acWB2cVowNEszUz0zR2dzbExRSjM0SWBCfVN0QGFPYUwxTDJxTmdjY11IPV9KXWNsbXY2V08wPEJCT1c0SHJrRFVQcGdEbmc2SFJoZnNMaXJvQUZqN0Y0UlJ3d3NvbjU1M05BYVA3dFUnKSdwbEhqYWAnPydgaGdgYWFgYScpJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknd2BhbHdgZnFKa0ZqaHVpYHFsamsnPydkaXJkfHYnKSdnZGZuYndqcGthRmppancnPycmMDcwYzJjJ3gl'
  },
  render: template
};

export const Group: StoryObj<typeof Checkout> = {
  args: {
    contentId: 4,
    contentType: SCContentType.GROUP,
    priceId: 4
  },
  render: template
};

export const Category: StoryObj<typeof Checkout> = {
  args: {
    contentId: 2,
    contentType: SCContentType.CATEGORY,
    priceId: 5
  },
  render: template
};

export const Course: StoryObj<typeof Checkout> = {
  args: {
    contentId: 5,
    contentType: SCContentType.COURSE,
    priceId: 33
  },
  render: template
};

export const Community: StoryObj<typeof Checkout> = {
  args: {
    contentId: 1,
    contentType: SCContentType.COMMUNITY,
    priceId: 7
  },
  render: template
};
