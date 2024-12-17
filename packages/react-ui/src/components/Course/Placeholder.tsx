import {Avatar, Box, CardActions, CardContent, CardMedia, Chip, Icon, Skeleton, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import React from 'react';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import {FormattedMessage} from 'react-intl';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import CreateCourseButton from '../CreateCourseButton';

const classes = {
  root: `${PREFIX}-placeholder-root`,
  placeholderImageWrapper: `${PREFIX}-placeholder-image-wrapper`,
  placeholderImage: `${PREFIX}-placeholder-image`,
  placeholderAvatar: `${PREFIX}-placeholder-avatar`,
  placeholderCreator: `${PREFIX}-placeholder-creator`,
  placeholderChip: `${PREFIX}-placeholder-chip`,
  placeholderIcon: `${PREFIX}-placeholder-icon`,
  placeholderName: `${PREFIX}-placeholder-name`,
  placeholderContent: `${PREFIX}-placeholder-content`,
  placeholderInfo: `${PREFIX}-placeholder-info`,
  placeholderActions: `${PREFIX}-placeholder-actions`,
  placeholderCreateButton: `${PREFIX}-placeholder-create-button`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'PlaceholderRoot'
})(() => ({}));

export interface CourseSkeletonProps extends WidgetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Shows create ation
   * @default false
   */
  actionCreate?: boolean;
  /**
   * The placeholder item number
   */
  itemNumber?: number;
}

/**
 * > API documentation for the Community-JS Course Placeholder component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CoursePlaceholder} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCourse-placeholder-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourse-placeholder-root|Styles applied to the root element.|
 |image|.SCCourse-placeholder-image|Styles applied to the image element.|
 |action|.SCCourse-placeholder-action|Styles applied to action section.|
 *
 */
export default function CoursePlaceholder(inProps: CourseSkeletonProps): JSX.Element {
  // PROPS
  const props: CourseSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, actionCreate = false, itemNumber = 1, ...rest} = props;
  // HOOK
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box position="relative" className={classes.placeholderImageWrapper}>
        <CardMedia
          component="img"
          image={`${preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}`}
          alt="placeholder image"
          className={classes.placeholderImage}
        />
        <Icon className={classes.placeholderIcon} fontSize="large">
          courses
        </Icon>
        {!actionCreate && (
          <>
            <Avatar className={classes.placeholderAvatar} alt="placeholder avatar" img="" />
            <Chip
              size="small"
              component="div"
              label={<FormattedMessage id="ui.courseStatus.draft" defaultMessage="ui.courseStatus.draft" />}
              className={classes.placeholderChip}
            />
          </>
        )}
      </Box>
      {!actionCreate && (
        <CardContent className={classes.placeholderContent}>
          <Typography className={classes.placeholderCreator}>
            <FormattedMessage id="ui.course.placeholder.teacher" defaultMessage="ui.course.placeholder.teacher" />
          </Typography>
          <Box>
            <Typography variant="h5" className={classes.placeholderName}>
              <FormattedMessage id="ui.course.placeholder.title" defaultMessage="ui.course.placeholder.title" values={{number: itemNumber}} />
            </Typography>
          </Box>
          <Typography className={classes.placeholderInfo}>
            <FormattedMessage id="ui.course.placeholder.subtitle" defaultMessage="ui.course.placeholder.subtitle" />
          </Typography>
        </CardContent>
      )}
      <CardActions className={classNames(classes.placeholderActions, {[classes.placeholderCreateButton]: actionCreate})}>
        {actionCreate ? (
          <CreateCourseButton />
        ) : (
          <Typography>
            <Icon>people_alt</Icon>
            <FormattedMessage
              defaultMessage="ui.courseParticipantsButton.participants"
              id="ui.courseParticipantsButton.participants"
              values={{total: 0}}
            />
          </Typography>
        )}
      </CardActions>
    </Root>
  );
}
