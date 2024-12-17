import React from 'react';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';
import {Box, Grid, GridProps} from '@mui/material';
import classNames from 'classnames';
import {CourseSkeleton} from '../Course';
import CoursePlaceholder from '../Course/Placeholder';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  courses: `${PREFIX}-skeleton-courses`,
  item: `${PREFIX}-skeleton-item`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface CoursesSkeletonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  CourseSkeletonProps?: any;

  /**
   * Props spread to grid container
   * @default {}
   */
  GridContainerComponentProps?: Pick<GridProps, Exclude<keyof GridProps, 'container' | 'component' | 'children' | 'item' | 'classes'>>;
  /**
   * Props spread to single grid item
   * @default {}
   */
  GridItemComponentProps?: Pick<GridProps, Exclude<keyof GridProps, 'container' | 'component' | 'children' | 'item' | 'classes'>>;

  /**
   * @default 20
   */
  coursesNumber?: number;

  /**
   *  If true, shows a different skeleton obj
   * @default false
   */
  teacherView?: boolean;
}

/**https://www.figma.com/design/bm7N6ykMLLmaAA22g34bRY/Corsi?t=HKaD6ErrzGpYDJr1-0
 * > API documentation for the Community-JS Groups Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CoursesSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCourses-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourses-skeleton-root|Styles applied to the root element.|
 |courses|.SCCourses-skeleton-courses|Styles applied to the group elements.|
 *
 */
export default function CoursesSkeleton(inProps: CoursesSkeletonProps): JSX.Element {
  const {
    className,
    CourseSkeletonProps = {},
    coursesNumber = 8,
    GridContainerComponentProps = {},
    GridItemComponentProps = {},
    teacherView = false,
    ...rest
  } = inProps;
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={{xs: 3}} className={classes.courses} {...GridContainerComponentProps}>
        {[...Array(coursesNumber)].map((course, index) => (
          <Grid item xs={12} sm={12} md={6} key={index} {...GridItemComponentProps} className={classes.item}>
            {teacherView ? <CoursePlaceholder itemNumber={index + 1} actionCreate={index === 3} /> : <CourseSkeleton {...CourseSkeletonProps} />}
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
