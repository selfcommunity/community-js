import {Box, Button, CardActions, CardContent, Icon} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React from 'react';
import {SCCourseTemplateType} from '../../types/course';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import BaseItemButton from '../../shared/BaseItemButton';
import {CourseProps} from './Course';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  skeletonPreviewRoot: `${PREFIX}-skeleton-preview-root`,
  skeletonSnippetRoot: `${PREFIX}-skeleton-snippet-root`,
  skeletonPreviewAvatar: `${PREFIX}-skeleton-preview-avatar`,
  skeletonPreviewContent: `${PREFIX}-skeleton-preview-content`,
  skeletonPreviewActions: `${PREFIX}-skeleton-preview-actions`,
  skeletonSnippetImage: `${PREFIX}-skeleton-snippet-image`,
  skeletonSnippetAction: `${PREFIX}-skeleton-snippet-action`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

const SkeletonPreviewRoot = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonPreviewRoot'
})(() => ({}));

const SkeletonSnippetRoot = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'SkeletonSnippetRoot'
})(() => ({}));

export interface CourseSkeletonProps extends WidgetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Course template type
   * @default 'preview'
   */
  template?: SCCourseTemplateType;
  /**
   * Disable skeleton animation
   */
  skeletonsAnimation?: false | 'wave' | 'pulse';
  /**
   * Prop to pass an action to be rendered next to the skeleton
   */
  actions?: React.ReactNode;
  /**
   * CourseProps
   */
  CourseProps?: CourseProps;
}

/**
 * > API documentation for the Community-JS Course Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CourseSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCourse-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourse-skeleton-root|Styles applied to the root element.|
 |image|.SCCourse-skeleton-image|Styles applied to the image element.|
 |action|.SCCourse-skeleton-action|Styles applied to action section.|
 *
 */
export default function CourseSkeleton(inProps: CourseSkeletonProps): JSX.Element {
  // PROPS
  const props: CourseSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, template, skeletonsAnimation = 'wave', actions, CourseProps, ...rest} = props;

  /**
   * Renders course object
   */
  let contentObj: React.ReactElement;
  if (template === SCCourseTemplateType.PREVIEW) {
    contentObj = (
      <SkeletonPreviewRoot className={classes.skeletonPreviewRoot}>
        <Box position="relative">
          <Skeleton variant="rectangular" animation={skeletonsAnimation} width="100%" height="110px" />
          <Skeleton className={classes.skeletonPreviewAvatar} variant="rounded" animation={skeletonsAnimation} />
        </Box>
        <CardContent className={classes.skeletonPreviewContent}>
          <Skeleton animation={skeletonsAnimation} width="20%" height={14} sx={{marginTop: 1}} variant="rectangular" />
          <Skeleton animation={skeletonsAnimation} width="40%" height={14} sx={{marginTop: 1.5}} variant="rectangular" />
          <Skeleton animation={skeletonsAnimation} width="60%" height={14} sx={{marginTop: 4.5}} variant="rectangular" />
        </CardContent>
        <CardActions className={classes.skeletonPreviewActions}>
          {actions !== undefined ? actions : <Skeleton variant="rounded" width={100} height={30} />}
        </CardActions>
      </SkeletonPreviewRoot>
    );
  } else {
    contentObj = (
      <SkeletonSnippetRoot
        elevation={0}
        square={true}
        disableTypography
        className={classes.skeletonSnippetRoot}
        image={
          <Box className={classes.skeletonSnippetImage}>
            <Skeleton animation={skeletonsAnimation} variant="rectangular" width={CourseProps?.userProfileSnippet ? 60 : 100} height={60} />
            <Icon fontSize="large">courses</Icon>
          </Box>
        }
        primary={
          CourseProps?.userProfileSnippet ? (
            <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width={120} style={{marginBottom: 10}} />
          ) : (
            <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width={40} style={{marginBottom: 12}} />
          )
        }
        secondary={
          CourseProps?.userProfileSnippet ? (
            <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width={60} />
          ) : (
            <>
              <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width={120} style={{marginBottom: 10}} />
              <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width={60} />
            </>
          )
        }
        actions={
          <>
            {actions !== undefined ? (
              actions
            ) : (
              <Button size="small" variant="outlined" disabled>
                <Skeleton animation={skeletonsAnimation} height={15} width={60} />
              </Button>
            )}
          </>
        }
      />
    );
  }
  return (
    <Root className={classNames(classes.root, className, `${PREFIX}-skeleton-${template}`)} {...rest}>
      {contentObj}
    </Root>
  );
}
