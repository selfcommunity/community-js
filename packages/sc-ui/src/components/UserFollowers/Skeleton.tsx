import React from 'react';
import {TrendingPeopleSkeleton} from '../TrendingPeople';
import {WidgetProps} from '../Widget';

export default function UserFollowersSkeleton(props: WidgetProps): JSX.Element {
  return <TrendingPeopleSkeleton {...props} />;
}
