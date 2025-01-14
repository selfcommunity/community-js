import {SCCoursePrivacyType, SCCourseJoinStatusType, SCCourseType, SCCourseTypologyType, SCUserType} from '@selfcommunity/types';
import {LessonRowInterface, OptionsData, SectionRowInterface, Status} from './types';
import {CommentsType} from '../CourseDashboard/types';

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

const COURSE_DATA: SCCourseType & {lessons_completed?: string; course_completed?: string; avg_completion?: string; sections?: SectionRowInterface[]} =
  {
    id: 1,
    name: 'Accessori Moda',
    description:
      'Il corso online di Accessori di Moda 👜 👠👞 è progettato per chi desidera esplorare il mondo del design e della creazione di accessori unici e alla moda. Attraverso lezioni interattive e materiali didattici approfonditi, gli studenti apprenderanno le tecniche essenziali per realizzare borse, gioielli, cinture, cappelli e altri accessori, combinando creatività, tendenze e artigianalità. Il corso include esercitazioni pratiche, consigli su materiali e strumenti, e spunti per sviluppare un proprio stile distintivo. Ideale sia per principianti che per chi vuole perfezionare le proprie competenze, il programma offre anche strategie per promuovere i propri accessori nel mercato della moda.',
    type: SCCourseTypologyType.SELF,
    created_at: '',
    created_by: getUserData(1, 'user1', 'Utente 1', undefined),
    image_original: '',
    image_small: '',
    image_medium: '',
    image_big: '',
    image_bigger: '',
    slug: 'fashion',
    privacy: SCCoursePrivacyType.OPEN,
    join_status: SCCourseJoinStatusType.JOINED,
    lessons_completed: '3/5',
    course_completed: '75%',
    avg_completion: '75%',
    sections: [
      {
        id: 1,
        name: 'Accessori Principali',
        lessons: [
          {
            id: 1,
            name: 'Cinture',
            completed: true
          },
          {
            id: 2,
            name: 'Sciarpe',
            completed: true
          },
          {
            id: 3,
            name: 'Orologi',
            completed: true
          },
          {
            id: 4,
            name: 'Test Sezione 1 - Accessori principali',
            completed: false
          }
        ]
      },
      {
        id: 2,
        name: 'Pelletteria',
        lessons: [
          {
            id: 1,
            name: 'Borse',
            completed: false
          }
        ]
      }
    ]
  };

const COMMENTS_DATA: CommentsType = {
  total: 34,
  next: true,
  lessons: [
    {
      id: 1,
      name: 'Cinture',
      users: [
        {
          id: 1,
          name: 'Steve',
          avatar: '',
          date: '21:54',
          comment: 'Penso che questo corso debba avere questa illustrazione'
        },
        {
          id: 2,
          name: 'TU',
          avatar: '',
          date: '21:58',
          comment: 'Grazie per il tuo suggerimento al mio corso. Lo prenderò in cosiderazione per il prossimo livello.'
        },
        {
          id: 3,
          name: 'Steve',
          avatar: '',
          date: '22:04',
          comment: 'Aggiungo questo PDF per essere ancora più chiaro. Buon lavoro!'
        },
        {
          id: 4,
          name: 'Carol',
          avatar: '',
          date: '22:14',
          comment: 'Non saepe omnis exercitationem et sed voluptatem similique assumenda earum'
        },
        {
          id: 5,
          name: 'Davide',
          avatar: '',
          date: '22:18',
          comment: 'Aliquam est incidunt dolores perferendis asperiores et est enim consectetur'
        }
      ]
    },
    {
      id: 2,
      name: 'Sciarpe',
      users: [
        {
          id: 1,
          name: 'Steve',
          avatar: '',
          date: '21:54',
          comment: 'Penso che questo corso debba avere questa illustrazione'
        },
        {
          id: 2,
          name: 'Carol',
          avatar: '',
          date: '22:14',
          comment: 'Non saepe omnis exercitationem et sed voluptatem similique assumenda earum'
        }
      ]
    }
  ]
};

const OTHER_DATA: CommentsType = {
  total: 34,
  next: false,
  lessons: [
    {
      id: 3,
      name: 'Borse',
      users: [
        {
          id: 1,
          name: 'Steve',
          avatar: '',
          date: '21:54',
          comment: 'Penso che questo corso debba avere questa illustrazione'
        }
      ]
    }
  ]
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

export async function getCommentsData(_id: number): Promise<CommentsType | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(COMMENTS_DATA), 300);
  });
}

export async function getOtherCommentsData(_id: number): Promise<CommentsType | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(OTHER_DATA), 300);
  });
}
