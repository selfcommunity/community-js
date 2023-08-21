import type { Meta, StoryObj } from '@storybook/react';
import Footer from './index';
import LanguageSwitcher from '../../shared/LanguageSwitcher';
import {Box} from '@mui/material';

export default {
  title: 'Design System/React UI/Footer',
  component: Footer,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof Footer>;

const template = (args) => (
  <div style={{width: 1200}}>
    <Footer {...args} />
  </div>
);

export const Base: StoryObj<Footer> = {
  render: template
};

export const BaseWithLanguageSwitcher: StoryObj<Footer> = {
	args: {
		endActions: <Box align={'center'}><br /><LanguageSwitcher LabelComponentProps={{hidden: true}} /></Box>,
	},
	render: template
};
