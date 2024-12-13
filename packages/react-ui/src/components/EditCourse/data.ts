import {LessonRowInterface, SectionRowInterface} from './types';

export const EDIT_COURSE_DATA = {
  title: 'Accessori Moda'
};

export const LESSONS_DATA = {
  statusCourse: 'draft',
  typeOfCourse: 'calendar'
};

function getSectionData(id: number) {
  return {
    id,
    name: `Sezione senza titolo - ${id}`,
    calendar: "Subito dopo l'iscrizione",
    lessons: []
  };
}

function getLessonData(id: number) {
  return {
    id,
    name: `Lezione senza titolo - ${id}`
  };
}

export async function getSection(id: number): Promise<SectionRowInterface> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getSectionData(id)), 300);
  });
}

export async function getLesson(id: number): Promise<LessonRowInterface> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLessonData(id)), 300);
  });
}

export async function setRowName(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 300);
  });
}
