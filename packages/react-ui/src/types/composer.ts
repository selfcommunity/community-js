import {ReactElement} from 'react';
import {SCFeedPostType} from '@selfcommunity/types/src/types';

export interface ComposerLayerType {
  name: string;
  Component: (props: any) => ReactElement;
  ComponentProps: any;
}

export interface ComposerLayerProps {
  onClose: () => void;
  onSave: (value: any) => void;
  defaultValue: any;
}

export type ComposerContentType = Omit<
  SCFeedPostType,
  | 'id'
  | 'last_activity_at'
  | 'added_at'
  | 'slug'
  | 'summary'
  | 'deleted'
  | 'collapsed'
  | 'comment_count'
  | 'share_count'
  | 'view_count'
  | 'vote_count'
  | 'follower_count'
  | 'reaction'
  | 'reactions_count'
  | 'flag_count'
  | 'type'
> & {title?: string};
