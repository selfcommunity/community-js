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

export function getCurrentSectionAndLessonIndex(course: SCCourseType, sectionId: number, lessonId: number) {
  const currentSectionIndex = course.sections.findIndex((section) => section.id === sectionId);
  if (currentSectionIndex === -1) {
    return {currentSectionIndex: null, currentLessonIndex: null};
  }
  const currentLessonIndex = course.sections[currentSectionIndex].lessons.findIndex((lesson) => lesson.id === lessonId);
  if (currentLessonIndex === -1) {
    return {currentSectionIndex, currentLessonIndex: null};
  }
  return {currentSectionIndex, currentLessonIndex};
}
