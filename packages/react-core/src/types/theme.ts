import {Theme as MuiTheme} from '@mui/material/styles/createTheme';

/**
 * Interface SCThemeAvatarVariableType
 */
export interface SCThemeAvatarVariableType {
  /**
   * Avatar size small
   */
  sizeSmall: number;
  /**
   * Avatar size medium
   */
  sizeMedium: number;
  /**
   * Avatar size large
   */
  sizeLarge: number;
  /**
   * Avatar size extra large
   */
  sizeXLarge: number;
}

/**
 * Interface SCThemeAvatarVariableType
 */
export interface SCThemeUserVariableType {
  /**
   * Avatar variables
   */
  avatar: SCThemeAvatarVariableType;
}

/**
 * Interface SCThemeCategoryVariableType
 */
export interface SCThemeCategoryIconVariableType {
  /**
   * Category size small
   */
  sizeSmall: number;
  /**
   * Category size medium
   */
  sizeMedium: number;
  /**
   * Category size large
   */
  sizeLarge: number;
}

/**
 * Interface SCThemeCategoryVariableType
 */
export interface SCThemeCategoryVariableType {
  /**
   * Category icon size
   */
  icon: SCThemeCategoryIconVariableType;
}

/**
 * Interface SCThemeVariablesType
 */
export interface SCThemeVariablesType {
  /**
   * Avatar
   */
  user: SCThemeUserVariableType;
  /**
   * Category
   */
  category: SCThemeCategoryVariableType;
}

export interface SCThemeType extends MuiTheme {
  /**
   * SelfCommunity variables
   **/
  selfcommunity: SCThemeVariablesType;
}
