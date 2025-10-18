import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventLocationWidget from './index';

export default {
  title: 'Design System/React UI/Event Location Widget ',
  component: EventLocationWidget
} as Meta<typeof EventLocationWidget>;

const template = (args) => (
    <EventLocationWidget {...args} />
);

export const Base: StoryObj<EventLocationWidget> = {
  args: {
    eventId: 129
    // event: {
    //   geolocation_lng: 9.11638659245195,
    //   geolocation_lat: 39.216251400000004,
    //   geolocation: 'Bastione di Saint Remy', Viale Regina Elena, 09125 Cagliari Casteddu/Cagliari, Italy'
    // }
  },
  render: template
};
