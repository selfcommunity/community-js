import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountDataPortability, { AccountDataPortabilityProps } from './AccountDataPortability';

export default {
  title: 'Design System/React UI/Account Data Portability',
  component: AccountDataPortability,
} as Meta<typeof AccountDataPortability>;

const template = (args: AccountDataPortabilityProps) => (
  <div style={{width: 600}}>
    <AccountDataPortability {...args} />
  </div>
);

export const Base: StoryObj<typeof AccountDataPortability> = {
  render: template
};
