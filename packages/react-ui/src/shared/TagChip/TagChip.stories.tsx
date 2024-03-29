import type { Meta, StoryObj } from '@storybook/react';
import TagChip from './index';
import {SCTagType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI Shared/TagChip',
  component: TagChip,
  argTypes: {
    name: {
      control: {type: 'text'},
      description: 'Tag Name',
      table: {
        defaultValue: {
          summary: 'Gold partner'
        }
      }
    },
    color: {
      control: {type: 'color'},
      description: 'Tag color',
      table: {
        defaultValue: {
          summary: '#bb1717'
        }
      }
    },
    visible: {
      control: {type: 'boolean'},
      description: 'Tag visible',
      table: {
        defaultValue: {
          summary: true
        }
      }
    },
    active: {
      control: {type: 'boolean'},
      description: 'Tag active',
      table: {
        defaultValue: {
          summary: true
        }
      }
    }
  },
  args: {
    name: 'Gold partner',
    color: '#bb1717',
    visible: true,
    active: true
  }
} as Meta<typeof TagChip>;

const template = (args: {name?: string; color?: string; visible?: boolean; active?: boolean; [p: string]: any}) => {
  /**
   * Example of a tag
   */
  const tag: SCTagType = {
    id: 0,
    name: args.name ? args.name : 'Gold partner',
    description: 'Partner',
    color: args.color ? args.color : '#bb1717',
    visible: args.visible ? args.visible : true,
    visibility_boost: true,
    created_at: '2019-08-24T14:15:22Z',
    active: args.active ? args.active : true,
    deleted: false
  };

  return (
    <div style={{width: 500}}>
      <TagChip tag={tag} />
    </div>
  );
};

export const Base: StoryObj<typeof TagChip> = {
  render: template
};
