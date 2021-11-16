import React from 'react';

export interface SCComposerMediaActionType {
  /**
   * The media action name, used for triggering the change view
   */
  name: string;

  /**
   * The button used to trigger the action
   */
  button: React.ElementType;

  /**
   * The component used to display and interact with the list of media of this type
   */
  component: React.ElementType;

  /**
   * The function used to filter media objects for rendering purpose
   */
  filter: (media: any) => boolean;
}
