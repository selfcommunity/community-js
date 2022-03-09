import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UserProfileTemplate from './index';
import {SCUserContextType, useSCUser} from '@selfcommunity/core';
import {UserProfileEdit} from '@selfcommunity/ui';
import DialogContent from '@mui/material/DialogContent';
import {Dialog, DialogTitle} from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/User Profile',
  component: UserProfileTemplate
} as ComponentMeta<typeof UserProfileTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileTemplate> = (args) => {
  const {userId, ...rest} = args;
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [edit, setEdit] = useState<boolean>(false);

  let _userId = userId;
  let isMe = false;
  if (userId === -1) {
    _userId = scUserContext.user ? scUserContext.user.id : 1;
    isMe = true;
  }

  return (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <UserProfileTemplate userId={_userId} {...rest} onEditClick={isMe ? () => setEdit(true) : null} />
      {isMe && (
        <Dialog fullWidth open={edit} onClose={() => setEdit(false)} scroll="body">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <UserProfileEdit AccordionProps={{elevation: 0}} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export const Main = Template.bind({});

Main.args = {
  userId: 115
};

export const Me = Template.bind({});

Me.args = {
  userId: -1
};
