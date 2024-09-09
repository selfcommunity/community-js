/**
 * SCOnBoardingStepType enum
 */
export enum SCOnBoardingStepType {
  CONTENTS = 'contents',
  CATEGORIES = 'categories',
  APPEARANCE = 'appearance',
  PROFILE = 'profile',
  INVITE = 'invite',
  APP = 'app'
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
  ids?: number[];
}
