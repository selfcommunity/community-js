import React from 'react';
import {TrendingPeopleSkeleton} from '../TrendingPeople';
import {WidgetProps} from '../Widget';

export default function UsersFollowedSkeleton(props: WidgetProps): JSX.Element {
  return <TrendingPeopleSkeleton {...props} />;
}
