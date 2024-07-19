import React from 'react';

export interface PlatformWidgetActionType {
  /**
   * Render action to be inserted
   */
  render: React.ReactNode;
  /**
   * Title for tutorial
   */
  title: React.ReactNode | string;
  /**
   * Content for tutorial
   */
  content: React.ReactNode | string;
}
