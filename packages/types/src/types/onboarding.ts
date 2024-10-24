/**
 * SCOnBoardingStepType enum
 */
import {SCFeedObjectType} from './feed';
import {SCCategoryType} from './category';

export enum SCOnBoardingStepType {
  CONTENTS = 'contents',
  CATEGORIES = 'categories',
  APPEARANCE = 'appearance',
  PROFILE = 'profile',
  INVITE = 'invite',
  APP = 'app'
}

export enum SCOnBoardingStepIdType {
  CONTENTS = 1,
  CATEGORIES = 2,
  APPEARANCE = 3,
  PROFILE = 4,
  INVITE = 5,
  APP = 6
}

/**
 * SCOnBoardingStepStatusType enum
 */
export enum SCOnBoardingStepStatusType {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  NOT_STARTED = 'not_started',
  FAILED = 'failed'
}

/**
 * Interface SCStepType.
 * Step Schema.
 */
export interface SCStepType {
  /**
   * The ID of the step.
   */
  id: number;

  /**
   * The onboarding step
   */
  step: SCOnBoardingStepType;

  /**
   * The step status
   */
  status: SCOnBoardingStepStatusType;

  /**
   * The step completion percentage
   */
  completion_percentage: number;

  /**
   * The ids of the generated content
   */
  results?: SCFeedObjectType[] | SCCategoryType[];
}
