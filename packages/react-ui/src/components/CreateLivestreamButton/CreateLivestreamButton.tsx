import {Button, Icon} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import React, {useContext, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import EventForm, {EventFormProps} from '../EventForm';
import {SCFeatureName} from '@selfcommunity/types';
import CreateLivestreamDialog from '../CreateLiveStreamDialog';

const PREFIX = 'SCCreateLivestreamButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface CreateLivestreamButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  EventFormProps?: EventFormProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Livestream Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateLivestreamButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateLivestreamButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateLivestreamButton(inProps: CreateLivestreamButtonProps): JSX.Element {
  //PROPS
  const props: CreateLivestreamButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, EventFormProps = {}, children, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [open, setOpen] = React.useState(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // TODO
  const livestreamEnabled = useMemo(
    () => true,
    /* preferences &&
      features &&
      features.includes(SCFeatureName.LIVESTREAM) &&
      SCPreferences.CONFIGURATIONS_LIVESTREAM_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_LIVESTREAM_ENABLED].value */ [preferences, features]
  );
  const onlyStaffEnabled = useMemo(() => true /* preferences[SCPreferences.CONFIGURATIONS_LIVESTREAM_ONLY_STAFF_ENABLED].value */, [preferences]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const canCreateEvent = useMemo(() => true /* scUserContext?.user?.permission?.create_livestream */, [scUserContext?.user?.permission]);

  /**
   * Handle click on button
   */
  const handleClick = () => {
    setOpen((o) => !o);
  };

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!livestreamEnabled || (!canCreateEvent && onlyStaffEnabled) || !authUserId) {
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
        color="secondary"
        startIcon={<Icon fontSize="small">info</Icon>}
        {...rest}>
        {children ?? <FormattedMessage id="ui.createEventButton.goLive" defaultMessage="ui.createEventButton.goLive" />}
      </Root>
      {open && <CreateLivestreamDialog open onClose={handleClick} />}
    </React.Fragment>
  );
}
