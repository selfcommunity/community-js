export type CoursePage = 'lessons' | 'customize' | 'users' | 'options';

export type TabContentType = '1' | '2' | '3' | '4';

export type Status = 'draft' | 'published';

export enum TabContentEnum {
  LESSONS = '1',
  CUSTOMIZE = '2',
  USERS = '3',
  OPTIONS = '4'
}

export interface LessonRowInterface {
  id: number;
  name: string;
  completed?: boolean;
}

export interface SectionRowInterface extends Omit<LessonRowInterface, 'completed'> {
  lessons: LessonRowInterface[];
}

export type ActionLessonType = 'add' | 'delete';

export enum ActionLessonEnum {
  ADD = 'add',
  DELETE = 'delete'
}

export interface OptionsData {
  enforce_lessons_order: boolean;
  new_comment_notification_enabled: boolean;
  hide_member_count: boolean;
}
