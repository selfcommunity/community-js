/**
 * SCCustomMenuItemType interface
 */
export interface SCCustomMenuItemType {
  id: number;
  custom_menu: number;
  label: string;
  url: string;
  attrs: string;
  order: string;
}

/**
 * SCCustomMenuType interface
 */
export interface SCCustomMenuType {
  id: number;
  name: string;
  items: SCCustomMenuItemType[];
  created_at?: Date | string;
  updated_at?: Date | string;
}
