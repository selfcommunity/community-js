/**
 * Interface SCContactUsRequestType
 */
export interface SCContactUsRequestType {
  /**
   * Id of the request
   */
  id: number;

  /**
   * Body of the request
   */
  body: string;

  /**
   * Created at
   */
  created_at?: Date | string;

  /**
   * Updated at
   */
  updated_at?: Date | string | null;
}
