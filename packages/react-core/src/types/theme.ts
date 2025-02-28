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
 * Interface SCThemeGroupVariableType
 */
export interface SCThemeGroupVariableType {
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
 * Interface SCThemeContentProductIconVariableType
 */
export interface SCThemeContentProductIconVariableType {
  /**
   * ContentProduct size small
   */
  sizeSmall: number;
  /**
   * ContentProduct size medium
   */
  sizeMedium: number;
}

/**
 * Interface SCThemeContentProductPriceIconVariableType
 */
export interface SCThemeContentProductPriceIconVariableType {
  /**
   * ContentProductPrice size small
   */
  sizeSmall: number;
  /**
   * ContentProductPrice size medium
   */
  sizeMedium: number;
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
 * Interface SCThemeContentProductVariableType
 */
export interface SCThemeContentProductVariableType {
  /**
   * ContentProduct icon size
   */
  icon: SCThemeContentProductIconVariableType;
}

/**
 * Interface SCThemeContentProductPriceVariableType
 */
export interface SCThemeContentProductPriceVariableType {
  /**
   * ContentProductPrice icon size
   */
  icon: SCThemeContentProductPriceIconVariableType;
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
  /**
   * Group
   */
  group: SCThemeGroupVariableType;
  /**
   * ContentProduct
   */
  contentProduct: SCThemeContentProductVariableType;
  /**
   * ContentProductPrice
   */
  contentProductPrice: SCThemeContentProductPriceVariableType;
}

export interface SCThemeType extends MuiTheme {
  /**
   * SelfCommunity variables
   **/
  selfcommunity: SCThemeVariablesType;
}
