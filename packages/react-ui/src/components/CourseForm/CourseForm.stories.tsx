import type { Meta, StoryObj } from '@storybook/react';
import CourseForm, { CourseFormProps } from './index';
import { SCCourseFormStepType } from './CourseForm';

export default {
  title: 'Design System/React UI/Course Form',
  component: CourseForm,
} as Meta<typeof CourseForm>;

const template = (args) => (
  <div style={{width: 800}}>
    <CourseForm{...args} />
  </div>
);


export const Base: StoryObj<CourseFormProps> = {
  args: {},
  render: template
};

export const EditForm: { args: { step: SCCourseFormStepType; courseId: number }; render: (args) => JSX.Element } = {
  args: {
    step: SCCourseFormStepType.TWO,
    course: {
      id: 129,
      name: "Evento top Lory",
      description: "Evento top dell'anno",
      slug: "evento-top-lory",
      color: "#DBDBDB",
      privacy: "public",
      visible: true,
      active: true,
      show_on_feed: true,
      subscription_status: "going",
      image_bigger: "https://static-cache.quentrix.com/wioggmfc/upfiles/events/bigger/evento-top-lory_7253.jpg",
      image_big: "https://static-cache.quentrix.com/wioggmfc/upfiles/events/big/evento-top-lory_1085.jpg",
      image_medium: "https://static-cache.quentrix.com/wioggmfc/upfiles/events/medium/evento-top-lory_6869.jpg",
      image_small: "https://static-cache.quentrix.com/wioggmfc/upfiles/events/small/evento-top-lory_6149.jpg",
      subscribers_counter: 50,
      goings_counter: 2,
      share_count: 1,
      start_date: "2024-09-14T12:00:00+02:00",
      end_date: "2024-12-12T23:00:00+01:00",
      recurring: "never",
      location: "in person",
      geolocation: "31100 Treviso TV, Italia",
      geolocation_lat: 45.6669338,
      geolocation_lng: 12.2430608,
      link: null,
      created_at: "2024-08-23T18:21:20.752116+02:00",
      created_by: {
        id: 1,
        username: "admin",
        real_name: "Amministratore",
        avatar: "https://static-cache.quentrix.com/wioggmfc/upfiles/avatars/1/resized/209/209/28b02add2c23b3a71801734eba773592.png",
        ext_id: null,
        deleted: false,
        followings_counter: 1,
        followers_counter: 2,
        posts_counter: 600,
        discussions_counter: 547,
        polls_counter: 84,
        categories_counter: 4,
        date_joined: "2024-04-10T13:23:59.754335+02:00",
        bio: "Vidi, feci, raccontai e poi me ne andai",
        location: "Milano",
        location_lat_lng: null,
        position_lat_lng: null,
        date_of_birth: "1973-07-09",
        description: "Avvocato Civilista",
        gender: "Unspecified",
        website: "https://selfcommunity.com/",
        cover: "https://static-cache.quentrix.com/wioggmfc/upfiles/user_media/admin/cover/55655364-f786-4ead-a97f-56b1770ad951.jpg",
        tags: [
          {
            id: 93,
            type: "user",
            name: "PINO",
            description: "",
            color: "#e57373",
            visible: true,
            visibility_boost: false,
            active: true,
            deleted: false,
            created_at: "2024-05-31T16:15:43.986224+02:00"
          }
        ],
        reputation: 2675,
        language: "it",
        community_badge: false,
        reg_approved: true,
        job: "JR Clinic Manager",
        store: "Erbusco",
        brand: "Il Barbiere",
        race: "Umano"
      },
      managed_by: {
        id: 1,
        username: "admin",
        real_name: "Amministratore",
        avatar: "https://static-cache.quentrix.com/wioggmfc/upfiles/avatars/1/resized/209/209/28b02add2c23b3a71801734eba773592.png",
        ext_id: null,
        deleted: false,
        followings_counter: 1,
        followers_counter: 2,
        posts_counter: 600,
        discussions_counter: 547,
        polls_counter: 84,
        categories_counter: 4,
        date_joined: "2024-04-10T13:23:59.754335+02:00",
        bio: "Vidi, feci, raccontai e poi me ne andai",
        location: "Milano",
        location_lat_lng: null,
        position_lat_lng: null,
        date_of_birth: "1973-07-09",
        description: "Avvocato Civilista",
        gender: "Unspecified",
        website: "https://selfcommunity.com/",
        cover: "https://static-cache.quentrix.com/wioggmfc/upfiles/user_media/admin/cover/55655364-f786-4ead-a97f-56b1770ad951.jpg",
        tags: [
          {
            id: 93,
            type: "user",
            name: "PINO",
            description: "",
            color: "#e57373",
            visible: true,
            visibility_boost: false,
            active: true,
            deleted: false,
            created_at: "2024-05-31T16:15:43.986224+02:00"
          }
        ],
        reputation: 2675,
        language: "it",
        community_badge: false,
        reg_approved: true,
        job: "JR Clinic Manager",
        store: "Erbusco",
        brand: "Il Barbiere",
        race: "Umano"
      },
      running: true,
      running_start_date: "2024-09-14T12:00:00+02:00",
      running_end_date: "2024-12-12T23:00:00+01:00",
      next_start_date: null,
      next_end_date: null,
      live_stream: null
    }
  },
  render: template
};