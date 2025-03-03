export enum ActionLessonType {
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
