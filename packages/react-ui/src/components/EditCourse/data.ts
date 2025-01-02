import {
  SCCourseLocationType,
  SCCoursePrivacyType,
  SCCourseRecurrenceType,
  SCCourseSubscriptionStatusType,
  SCCourseType,
  SCCourseTypologyType,
  SCUserType
} from '@selfcommunity/types';
import {LessonRowInterface, OptionsData, SectionRowInterface, Status} from './types';

function getUserData(id: number, username: string, name: string, completion: number): SCUserType & {completion?: number} {
  return {
    id,
    username,
    real_name: name,
    bio: '',
    date_joined: new Date(),
    description: '',
    avatar: '',
    gender: '',
    location: '',
    reputation: 1,
    tags: [],
    website: '',
    can_send_pm_to: false,
    categories_counter: 1,
    community_badge: false,
    connection_requests_received_counter: 0,
    connection_requests_sent_counter: 0,
    connection_status: '',
    connections_counter: 0,
    role: 'Admin',
    completion
  };
}

const USERS_DATA: SCUserType[] = [
  getUserData(1, 'user1', 'Utente 1', 20),
  getUserData(2, 'user2', 'Utente 2', 55),
  getUserData(3, 'user3', 'Utente 3', 12),
  getUserData(4, 'user4', 'Utente 4', 7),
  getUserData(5, 'user5', 'Utente 5', 84),
  getUserData(6, 'user6', 'Utente 6', 100),
  getUserData(7, 'user7', 'Utente 7', 69)
];

const COURSE_DATA: SCCourseType = {
  id: 1,
  name: 'Accessori Moda',
  description: '',
  type: SCCourseTypologyType.SELF,
  active: true,
  color: '',
  created_at: '',
  created_by: getUserData(1, 'user1', 'Utente 1', undefined),
  managed_by: getUserData(1, 'user1', 'Utente 1', undefined),
  start_date: '',
  end_date: '',
  next_start_date: '',
  next_end_date: '',
  geolocation: '',
  geolocation_lat: 0,
  geolocation_lng: 0,
  goings_counter: 0,
  image_small: '',
  image_medium: '',
  image_big: '',
  image_bigger: '',
  link: '',
  slug: '',
  location: SCCourseLocationType.ONLINE,
  privacy: SCCoursePrivacyType.PUBLIC,
  recurring: SCCourseRecurrenceType.DAILY,
  running: true,
  running_start_date: '',
  running_end_date: '',
  show_on_feed: true,
  subscribers_counter: 0,
  subscription_status: SCCourseSubscriptionStatusType.GOING,
  visible: true
};

export const LESSONS_DATA = {
  statusCourse: 'draft',
  typeOfCourse: 'calendar',
  privacy: 'public'
};

function getSectionData(id: number) {
  return {
    id,
    name: `Sezione senza titolo - ${id}`,
    lessons: []
  };
}

function getLessonData(id: number) {
  return {
    id,
    name: `Lezione senza titolo - ${id}`
  };
}

export async function getCourseData(_id: number): Promise<SCCourseType | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(COURSE_DATA), 300);
  });
}

export async function getSection(id: number): Promise<SectionRowInterface | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getSectionData(id)), 300);
  });
}

export async function getLesson(id: number): Promise<LessonRowInterface | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLessonData(id)), 300);
  });
}

export async function setRowName(name: string): Promise<string | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(name), 300);
  });
}

export async function setStatus(status: Status): Promise<Status | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(status), 300);
  });
}

export async function getSections(): Promise<SectionRowInterface[] | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 300);
  });
}

export async function getOptionsData(): Promise<OptionsData | null> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          options: true,
          notifications: false,
          permissions: false
        }),
      300
    );
  });
}

export async function setOptionsData(options: OptionsData): Promise<OptionsData | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(options), 300);
  });
}

export async function getUsersToAdd(_id: number): Promise<SCUserType[] | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(USERS_DATA), 300);
  });
}

export async function getUsersData(_id: number): Promise<SCUserType[] | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(USERS_DATA), 300);
  });
}

export async function setUsersData(_id: number, users: SCUserType[]): Promise<SCUserType[] | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 300);
  });
}
