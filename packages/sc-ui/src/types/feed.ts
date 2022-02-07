import React from 'react';

export interface SCFeedWidgetType {
  /**
   * Type of the widget
   */
  type: 'widget';

  /**
   * The component used to display the widget
   */
  component: React.ElementType;

  /**
   * Props to spread into the component
   */
  componentProps: any;

  /**
   * Column where insert the widget
   */
  column: 'left' | 'right';

  /**
   * Position where insert the widget into the column
   */
  position: number;

  /**
   * Publish/Subscribe to events
   * If true, the component has the ability to post event to a channel/topic
   * The component accept publicationChannel and subscriptionChannel
   */
  publishEvents?: boolean;
}
