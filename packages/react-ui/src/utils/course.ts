import {SCCourseType} from '@selfcommunity/types';

export function isCourseNew(course: SCCourseType | null): boolean {
  if (course && course.user_completion_rate !== 100) {
    const createdAtDate = new Date(course.created_at);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return createdAtDate >= twoWeeksAgo;
  }
  return false;
}

export function isCourseCompleted(course: SCCourseType | null): boolean {
  return course?.user_completion_rate === 100;
}
