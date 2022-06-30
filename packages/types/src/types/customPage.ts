/**
 * SCCustomPageType interface
 */
export interface SCCustomPageType {
  id?: number;
  slug?: string;
  label: string;
  title: string;
  alternative_url?: string;
  html_body?: string;
  visible_in_menu?: boolean;
  order?: number;
  created_at?: Date | string;
  lastmod_datetime?: Date | string;
  active?: boolean;
  created_by?: number;
}
