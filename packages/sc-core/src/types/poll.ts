/**
 * Interface SCPoll.
 * Poll Schema.
 */
export interface SCPollType {
  /**
   * Id of the poll
   */
  id?: number;

  /**
   * Title of the poll
   */
  title?: string;

  /**
   * Poll is multiple choices or not
   */
  multiple_choices: boolean;

  /**
   * Added at
   */
  added_at?: Date;

  /**
   * Modified at
   */
  modified_at?: Date;

  /**
   * Poll is closed or not
   */
  closed?: boolean;

  /**
   * Expiration at
   */
  expiration_at: string | Date;

  /**
   * Expiration at
   */
  hidden?: boolean;

  /**
   * Choice
   */
  choices: SCPollChoiceType[];
}

/**
 * Interface SCPollChoice.
 * Poll Choice Schema.
 */
export interface SCPollChoiceType {
  /**
   * Id of the poll choice
   */
  id?: number;

  /**
   * Title of the poll
   */
  choice: string;

  /**
   * Order in the list of choices
   */
  order?: number;

  /**
   * Added at
   */
  added_at?: Date;

  /**
   * True if the poll is deleted
   */
  deleted?: boolean;

  /**
   * Number of votes
   */
  vote_count?: number;

  /**
   * True if the logged user has already voted the choice
   */
  voted?: boolean;
}
