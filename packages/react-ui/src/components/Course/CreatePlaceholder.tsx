import {Box, CardActions, CardMedia, Icon} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React from 'react';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import CreateCourseButton from '../CreateCourseButton';

const classes = {
  root: `${PREFIX}-create-placeholder-root`,
  imageWrapper: `${PREFIX}-create-placeholder-image-wrapper`,
  image: `${PREFIX}-create-placeholder-image`,
  icon: `${PREFIX}-create-placeholder-icon`,
  actions: `${PREFIX}-create-placeholder-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'CreatePlaceholderRoot'
})(() => ({}));

export interface CourseSkeletonProps extends WidgetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}

/**
 * > API documentation for the Community-JS Course Placeholder component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CourseCreatePlaceholder} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCourse-placeholder-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourse-create-placeholder-root|Styles applied to the root element.|
 |imageWrapper|.SCCourse-create-placeholder-image|Styles applied to the image wrapper section.|
 |image|.SCCourse-create-placeholder-image|Styles applied to the image element.|
 |icon|.SCCourse-create-placeholder-icon|Styles applied to the course icon element.|
 |actions|.SCCourse-create-placeholder-actions|Styles applied to action section.|
 *
 */
export default function CourseCreatePlaceholder(inProps: CourseSkeletonProps): JSX.Element {
  // PROPS
  const props: CourseSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;
  // HOOK
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box position="relative" className={classes.imageWrapper}>
        <CardMedia
          component="img"
          image={`${preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}`}
          alt="placeholder image"
          className={classes.image}
        />
        <Icon className={classes.icon} fontSize="large">
          courses
        </Icon>
      </Box>
      <CardActions className={classes.actions}>
        <CreateCourseButton />
      </CardActions>
    </Root>
  );
}
