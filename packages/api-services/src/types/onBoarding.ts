/**
 * StartStepParams interface
 */

export interface StartStepParams {
  /**
   * The number of the post to generate.
   * @default 10
   */
  num_posts?: number;
  /**
   * The number of the post images to generate
   * @default 1
   */
  num_images?: number;
  /**
   * only for stage
   */
  force?: number;
}

/**
 * OnBoardingStepType enum
 */
export enum OnBoardingStep {
  CONTENTS = 1,
  CATEGORIES = 2,
  APPEARANCE = 3,
  PROFILE = 4,
  INVITE = 5,
  APP = 6
}
