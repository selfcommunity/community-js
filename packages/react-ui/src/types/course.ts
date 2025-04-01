import {SCUserType} from '@selfcommunity/types';

export enum SCCourseTemplateType {
  SNIPPET = 'snippet',
  PREVIEW = 'preview'
}

export enum SCLessonActionsType {
  COMMENTS = 'comments',
  LESSONS = 'lessons',
  SETTINGS = 'settings'
}

export enum SCLessonModeType {
  VIEW = 'view',
  EDIT = 'edit'
}

export enum SCCourseEditTabType {
  LESSONS = 'lessons',
  CUSTOMIZE = 'customize',
  USERS = 'users',
  REQUESTS = 'requests',
  OPTIONS = 'options'
}

export enum SCCourseUsersTableModeType {
  DASHBOARD = 'dashboard',
  EDIT = 'edit',
  REQUESTS = 'requests'
}

export interface SCCourseEditManageUserProps {
  tab: SCCourseEditTabType;
  user?: SCUserType;
  request?: SCUserType;
}

export interface SCCourseEditManageUserRef {
  handleManageUser: (user: SCUserType) => void;
}
