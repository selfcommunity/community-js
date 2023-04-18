export enum SCCustomPageTypeEnum {
  NORMAL = 'normal',
  LEGAL = 'legal'
}

/**
 * SCCustomPageType interface
 */
export interface SCCustomPageType {
  id?: number;
  type?: SCCustomPageTypeEnum;
  slug?: string;
  title: string;
  html_summary?: string | null;
  html_body?: string | null;
  valid_from: Date | string;
  valid_to: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string | null;
  active?: boolean;
  created_by?: number;
  updated_by?: number;
}
