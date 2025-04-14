import {Button, ButtonProps, Icon} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {SCFeatureName} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {useContext, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import CourseFormDialog, {CourseFormDialogProps} from '../CourseFormDialog';

const PREFIX = 'SCCreateCourseButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface CreateCourseButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  CourseFormDialogComponentProps?: CourseFormDialogProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Group Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateCourseButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateCourseButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateCourseButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateCourseButton(inProps: CreateCourseButtonProps): JSX.Element {
  //PROPS
  const props: CreateCourseButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, CourseFormDialogComponentProps = {}, children, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [open, setOpen] = React.useState(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  const coursesEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_COURSES_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_COURSES_ENABLED].value,
    [preferences, features]
  );
  const onlyStaffEnabled = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_COURSES_ONLY_STAFF_ENABLED]?.value, [preferences]);
  const canCreateCourse = useMemo(() => scUserContext?.user?.permission?.create_course, [scUserContext?.user?.permission]);

  /**
   * Handle click on button
   */
  const handleClick = () => {
    setOpen((o) => !o);
  };

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!coursesEnabled || (!canCreateCourse && onlyStaffEnabled) || !authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClick}
        variant="contained"
        color="primary"
        startIcon={<Icon fontSize="small">add</Icon>}
        {...rest}>
        {children ?? <FormattedMessage id="ui.createCourseButton" defaultMessage="ui.createCourseButton" />}
      </Root>
      {open && <CourseFormDialog {...CourseFormDialogComponentProps} open onClose={handleClick} />}
    </React.Fragment>
  );
}
