import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Footer from './index';
import LanguageSwitcher from '../../shared/LanguageSwitcher';
import {Stack} from '@mui/material';

export default {
  title: 'Design System/React UI/Footer',
  component: Footer,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: '1'}}
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

const template = (args: any) => (
  <div style={{width: 1200}}>
    <Footer {...args} />
  </div>
);

export const Base: StoryObj<typeof Footer> = {
  render: template
};

export const BaseWithLanguageSwitcher: StoryObj<typeof Footer> = {
	args: {
		endActions: <Stack direction="column" alignItems="center"><br /><LanguageSwitcher LabelComponentProps={{hidden: true}} /></Stack>,
	},
	render: template
};
