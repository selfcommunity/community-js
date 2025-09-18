/**
 * Interface SCContactUsRequestType
 */
export interface SCContactUsRequestType {
  /**
   * Id of the request
   */
  id?: number;

  /**
   * Message of the request
   */
  message?: string;

  /**
   * Created at
   */
  created_at?: Date | string;

  /**
   * Updated at
   */
  updated_at?: Date | string | null;

  /**
   * Any other properties
   */
  [p: string]: any;
}
