import {SCCourseJoinStatusType, SCCourseType} from '@selfcommunity/types';

export function isCourseNew(course: SCCourseType | null): boolean {
  if (course && course.join_status === SCCourseJoinStatusType.JOINED) {
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

enum unitType {
  DAYS = 'days',
  WEEKS = 'weeks'
}

export const getDripDelayAndUnit = (value: number) => {
  if (value > 7 && value % 7 === 0) {
    return {delay: value / 7, _unit: unitType.WEEKS};
  }
  return {delay: value, _unit: unitType.DAYS};
};
