import type { Meta, StoryObj } from '@storybook/react';
import CourseForm, { CourseFormProps } from './index';
import { SCCourseFormStepType } from './CourseForm';
import {
  SCCourseJoinStatusType,
  SCCoursePrivacyType,
  SCCourseTypologyType,
  SCLanguageType,
} from '@selfcommunity/types';

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

export const EditForm: StoryObj<typeof CourseForm> = {
  args: {
    step: SCCourseFormStepType.TWO,
    course: {
      id: 1,
      name: "Distributed multi-state capability",
      slug: "distributed-multi-state-capability",
      description: "Networked leading edge capacity",
      type: SCCourseTypologyType.STRUCTURED,
      privacy: SCCoursePrivacyType.OPEN,
      enforce_lessons_order: false,
      new_comment_notification_enabled: false,
      sections_order: [1],
      image_bigger: "https://static-cache.quentrix.com/wioggmfc/upfiles/structureds/bigger/distributed-multi-state-capability_3372.jpg",
      image_big: "https://static-cache.quentrix.com/wioggmfc/upfiles/structureds/big/distributed-multi-state-capability_0486.jpg",
      image_medium: "https://static-cache.quentrix.com/wioggmfc/upfiles/structureds/medium/distributed-multi-state-capability_5903.jpg",
      image_small: "https://static-cache.quentrix.com/wioggmfc/upfiles/structureds/small/distributed-multi-state-capability_6812.jpg",
      join_status: SCCourseJoinStatusType.MANAGER,
      created_at: "2025-01-16T14:52:24.400913+01:00",
      created_by: {
        id: 9,
        username: "team",
        real_name: "",
        avatar: "https://static-cache.quentrix.com/wioggmfc/upfiles/svg/T9.svg",
        ext_id: null,
        deleted: false,
        followings_counter: 0,
        followers_counter: 5,
        posts_counter: 12,
        discussions_counter: 4,
        polls_counter: 4,
        categories_counter: 2,
        date_joined: "2024-04-10T14:37:48.153981+02:00",
        bio: "",
        location: "",
        location_lat_lng: null,
        position_lat_lng: null,
        date_of_birth: null,
        description: "",
        gender: "Unspecified",
        website: "",
        cover: null,
        tags: [],
        reputation: 160,
        language: SCLanguageType.IT,
        community_badge: true,
        reg_approved: true,
        job: "Barbiere",
        store: "Brescia",
        brand: "Prima Classe",
        race: null,
      },
      categories: [
        {
          id: 1,
          tags: [],
          followed: true,
          order: 14,
          name: "Band preferite",
          name_synonyms: "",
          slug: "band-preferite",
          slogan: "Note che si trasformano in emozioni: condividi la tua passione musicale, esplorando insieme le band preferite che ti fanno vibrare l'anima.",
          html_info: null,
          seo_title: "",
          seo_description: "",
          auto_follow: "none",
          active: true,
          image_original: "https://static-cache.quentrix.com/wioggmfc/upfiles/categories/original/band-preferite_4420.png",
          image_bigger: "https://static-cache.quentrix.com/wioggmfc/upfiles/categories/bigger/band-preferite_8770.png",
          image_big: "https://static-cache.quentrix.com/wioggmfc/upfiles/categories/big/band-preferite_7524.png",
          image_medium: "https://static-cache.quentrix.com/wioggmfc/upfiles/categories/medium/band-preferite_8937.png",
          image_small: "https://static-cache.quentrix.com/wioggmfc/upfiles/categories/small/band-preferite_3325.png",
          emotional_image_original: "https://static-cache.quentrix.com/wioggmfc/upfiles/categories/e_original/band-preferite_4837.png",
          emotional_image_position: 50,
          stream_order_by: "recent",
          followers_counter: 315,
        },
      ],
      sections: [
        {
          id: 1,
          name: "Distributed Systems Basics",
          dripped_at: null,
          drip_delay: 0,
          lessons_order: [1, 3],
          available_date: "2025-01-16T13:52:24.417225Z",
          locked: false,
          num_lessons: 1,
          num_lessons_completed: 0,
          lessons: [
            {
              id: 3,
              name: "The lesson name patched",
              type: "lesson",
              status: "published",
              comments_enabled: true,
              locked: false,
            },
          ],
        },
      ],
      num_lessons: 1,
      num_sections: 1,
      num_lessons_completed: 0,
      user_completion_rate: 0,
    }
  },
    render: template
};