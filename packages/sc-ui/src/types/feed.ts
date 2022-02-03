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
}
