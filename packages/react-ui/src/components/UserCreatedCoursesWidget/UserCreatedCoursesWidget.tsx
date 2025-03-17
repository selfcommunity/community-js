import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import {CourseService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {SCCache, SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {SCCourseJoinStatusType, SCCourseType, SCFeatureName} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {PREFIX} from './constants';
import Course, {CourseProps, CourseSkeleton} from '../Course';
import {SCCourseTemplateType} from '../../types/course';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot'
})(() => ({}));

export interface UserCreatedCoursesWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Limit the number of courses to show
   * @default false
   */
  limit?: number;
  /**
   * Props to spread to single course object
   * @default empty object
   */
  CourseProps?: CourseProps;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to subscribed courses dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Profile Courses Created Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the courses that the given user follows.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UserCreatedCourses)

 #### Import
 ```jsx
 import {UserCreatedCoursesWidget} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCUserCreatedCoursesWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserCreatedCoursesWidget-root|Styles applied to the root element.|
 |title|.SCUserCreatedCoursesWidget-title|Styles applied to the title element.|
 |noResults|.SCUserCreatedCoursesWidget-no-results|Styles applied to no results section.|
 |showMore|.SCUserCreatedCoursesWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCUserCreatedCoursesWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCUserCreatedCoursesWidget-end-message|Styles applied to the end message element.|
 * @param inProps
 */
export default function UserCreatedCoursesWidget(inProps: UserCreatedCoursesWidgetProps): JSX.Element {
  // PROPS
  const props: UserCreatedCoursesWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userId,
    autoHide,
    limit = 3,
    className,
    CourseProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  const coursesEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.COURSE) &&
      SCPreferences.CONFIGURATIONS_COURSES_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_COURSES_ENABLED].value,
    [preferences, features]
  );
  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_CREATED_COURSES_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized, and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        CourseService.getUserJoinedCourses(userId, {statuses: SCCourseJoinStatusType.CREATOR})
          .then((courses: SCPaginatedResponse<SCCourseType>) => {
            dispatch({
              type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
              payload: {
                count: courses.count,
                results: courses.results,
                initialized: true
              }
            });
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, userId, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (coursesEnabled && isInteger(userId) && scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, coursesEnabled, userId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  useEffect(() => {
    if (!coursesEnabled && !scUserContext.user && !isInteger(userId)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [coursesEnabled, cacheStrategy, scUserContext.user, userId]);

  // HANDLERS

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if (!coursesEnabled || (autoHide && !state.count && state.initialized) || !userId) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage
          id="ui.userCreatedCoursesWidget.title"
          defaultMessage="ui.userCreatedCoursesWidget.title"
          values={{
            total: state.count
          }}
        />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.userCreatedCoursesWidget.subtitle.noResults" defaultMessage="ui.userCreatedCoursesWidget.subtitle.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((course: SCCourseType) => (
              <ListItem key={course.id}>
                <Course elevation={0} template={SCCourseTemplateType.SNIPPET} course={course} userProfileSnippet {...CourseProps} />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.userCreatedCoursesWidget.button.showAll" defaultMessage="ui.userCreatedCoursesWidget.button.showAll" />
            </Button>
          )}
          {openDialog && (
            <DialogRoot
              className={classes.dialogRoot}
              title={
                <FormattedMessage
                  id="ui.userCreatedCoursesWidget.title"
                  defaultMessage="ui.userCreatedCoursesWidget.title"
                  values={{total: state.count}}
                />
              }
              onClose={handleToggleDialogOpen}
              open={openDialog}
              scroll="paper"
              {...DialogProps}>
              <List>
                {state.results.map((c) => (
                  <ListItem key={c.id}>
                    <Course elevation={0} template={SCCourseTemplateType.SNIPPET} course={c} userProfileSnippet {...CourseProps} />
                  </ListItem>
                ))}
                {state.isLoadingNext && (
                  <ListItem>
                    <CourseSkeleton template={SCCourseTemplateType.SNIPPET} elevation={0} CourseProps={{userProfileSnippet: true}} />
                  </ListItem>
                )}
              </List>
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.userCreatedCoursesWidget.noMoreResults" defaultMessage="ui.userCreatedCoursesWidget.noMoreResults" />
              </Typography>
            </DialogRoot>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
