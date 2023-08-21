import type { Meta, StoryObj } from '@storybook/react';
import UserProfileEdit from './index';
import { DEFAULT_FIELDS, DEFAULT_SETTINGS } from '../../constants/UserProfile';

export default {
  title: 'Design System/React UI/User Profile Edit',
  component: UserProfileEdit,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    id: 796
  }
} as Meta<typeof UserProfileEdit>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserProfileEdit {...args} />
  </div>
);

export const Base: StoryObj<UserProfileEdit> = {
  args: {
    id: 796,
    fields: [...DEFAULT_FIELDS],
    settings: [...DEFAULT_SETTINGS]
  },
  render: template
};

export const BaseWithLanguage: StoryObj<UserProfileEdit> = {
	args: {
		id: 796,
		fields: [...DEFAULT_FIELDS],
		settings: [...DEFAULT_SETTINGS],
		UserProfileEditSectionAccountProps: {showCredentialsSection: true, showLanguageSwitcher: true}
	},
	render: template
};


export const BaseWithCustomLanguageSwitcher: StoryObj<UserProfileEdit> = {
	args: {
		id: 796,
		fields: [...DEFAULT_FIELDS],
		settings: [...DEFAULT_SETTINGS],
		UserProfileEditSectionAccountProps: {
			showCredentialsSection: true,
			showLanguageSwitcher: true,
			LanguageSwitcherProps: {
				variant: 'standard',
				minimized: true,
				LabelComponentProps: {
					hidden: true
				}
			}
		}
	},
	render: template
};
