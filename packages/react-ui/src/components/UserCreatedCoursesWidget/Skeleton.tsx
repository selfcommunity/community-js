import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import {CardContent, ListItem} from '@mui/material';
import List from '@mui/material/List';
import CourseSkeleton from '../Course/Skeleton';
import {SCCourseTemplateType} from '../../types/course';

const PREFIX = 'SCUserCreatedCoursesWidgetSkeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS User Profile Categories Followed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserCreatedCoursesWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserCategoriesFollowedWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserCreatedCoursesWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function UserCreatedCoursesWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(3)].map((category, index) => (
            <ListItem key={index}>
              <CourseSkeleton template={SCCourseTemplateType.SNIPPET} CourseProps={{userProfileSnippet: true}} elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
