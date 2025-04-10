import {SCCourseLessonType, SCCourseSectionType} from '@selfcommunity/types';

export enum ActionLessonType {
  ADD = 'add',
  RENAME = 'rename',
  DELETE = 'delete',
  UPDATE = 'update',
  ADD_UPDATE = 'add_update',
  RENAME_UPDATE = 'rename_update',
  DELETE_UPDATE = 'delete_update',
  UPDATE_UPDATE = 'update_update'
}

export interface OptionsData {
  enforce_lessons_order: boolean;
  new_comment_notification_enabled: boolean;
  hide_member_count: boolean;
}

export enum RowType {
  SECTION = 'section',
  LESSON = 'lesson'
}

export interface DeleteRowProps {
  row: RowType;
  section: SCCourseSectionType;
  lesson?: SCCourseLessonType;
}

export interface DeleteRowRef {
  handleDeleteSection?: (section: SCCourseSectionType) => void;
  handleDeleteLesson: (section: SCCourseSectionType, lesson: SCCourseLessonType) => void;
}
