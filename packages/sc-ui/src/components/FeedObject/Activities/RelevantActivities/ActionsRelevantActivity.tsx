import {BaseItemProps} from '../../../../shared/BaseItem';
import {SCFeedUnitActivityType} from '@selfcommunity/core';

export interface ActionsRelevantActivityProps extends BaseItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Activity obj
   * @default null
   */
  activityObject: SCFeedUnitActivityType;
  /**
   * Any other properties
   */
  [p: string]: any;
}
