import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamVideoConference from './index';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamVideoConference',
  component: LiveStreamVideoConference,
} as Meta<typeof LiveStreamVideoConference>;

const template = (args) => (
  <div>
    <LiveStreamVideoConference {...args} />
  </div>
);


export const Base: StoryObj<typeof LiveStreamVideoConference> = {
  args: {
		startConferenceEndContent: <>Test</>,

		connectionDetails: {
			"serverUrl": "https://gomos-rw98bdqa.livekit.cloud",
			"roomName": "dev-44D8528E-20922246",
			"participantToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6IiIsIm5hbWUiOiIiLCJ2aWRlbyI6eyJyb29tQ3JlYXRlIjpmYWxzZSwicm9vbUxpc3QiOmZhbHNlLCJyb29tUmVjb3JkIjpmYWxzZSwicm9vbUFkbWluIjpmYWxzZSwicm9vbUpvaW4iOnRydWUsInJvb20iOiJkZXYtNDREODUyOEUtMjA5MjIyNDYiLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5QdWJsaXNoU291cmNlcyI6W10sImNhblVwZGF0ZU93bk1ldGFkYXRhIjpmYWxzZSwiaW5ncmVzc0FkbWluIjpmYWxzZSwiaGlkZGVuIjpmYWxzZSwicmVjb3JkZXIiOmZhbHNlLCJhZ2VudCI6ZmFsc2V9LCJzaXAiOnsiYWRtaW4iOmZhbHNlLCJjYWxsIjpmYWxzZX0sImF0dHJpYnV0ZXMiOnt9LCJtZXRhZGF0YSI6IiIsInNoYTI1NiI6IiIsImtpbmQiOiIiLCJzdWIiOiJhZG1pbiIsImlzcyI6IkFQSU11VDl0WWRLaDdHSyIsIm5iZiI6MTczMDg5MTc2MywiZXhwIjoxNzMwOTEzMzYzfQ.XcNKTERwrNT61ufW_O9Zr4e6bmsIi6_2nT1LpaHc3m8",			// "serverUrl": "https://gomos-rw98bdqa.livekit.cloud",
			// "roomName": "uh7z-hshs",
			// "participantToken": "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3RhZmYiLCJ2aWRlbyI6eyJyb29tIjoidWg3ei1oc2hzIiwicm9vbUpvaW4iOnRydWUsImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWV9LCJpc3MiOiJBUElNdVQ5dFlkS2g3R0siLCJleHAiOjE3MzA4MjI4MzksIm5iZiI6MCwic3ViIjoic3RhZmZfX2Rud2EifQ.Rk6Q2vrP8Zq9Z60q59kdr0OwP0uTnVW-SV5noSpX9xE",
			"participantName": "staff"
		}
	},
  render: template
};
