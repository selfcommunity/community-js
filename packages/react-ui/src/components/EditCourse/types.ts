export type CoursePage = 'lessons' | 'customize' | 'users' | 'options';

export type TabContentType = '1' | '2' | '3' | '4';

export type Status = 'draft' | 'published';

export enum TabContentEnum {
  LESSONS = '1',
  CUSTOMIZE = '2',
  USERS = '3',
  OPTIONS = '4'
}

export type ActionLessonType = 'add' | 'rename' | 'delete' | 'add_update' | 'rename_update' | 'delete_update';

export enum ActionLessonEnum {
  ADD = 'add',
  RENAME = 'rename',
  DELETE = 'delete',
  UPDATE = 'update',
  ADD_UPDATE = 'add_update',
  RENAME_UPDATE = 'rename_update',
  DELETE_UPDATE = 'delete_update'
}

export interface OptionsData {
  enforce_lessons_order: boolean;
  new_comment_notification_enabled: boolean;
  hide_member_count: boolean;
}
