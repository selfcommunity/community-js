export type CourseDashboardPage = 'students' | 'comments';

export type TabContentType = '1' | '2';

export enum TabContentEnum {
  STUDENTS = '1',
  COMMENTS = '2'
}

type LessonsUserType = {
  id: number;
  name: string;
  avatar: string;
  date: string;
  comment: string;
};

type CommentsLessonType = {
  id: number;
  name: string;
  users: LessonsUserType[];
};

export type CommentsType = {
  total: number;
  next: boolean;
  lessons: CommentsLessonType[];
};
