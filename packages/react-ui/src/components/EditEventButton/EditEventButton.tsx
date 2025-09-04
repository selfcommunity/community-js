import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserContextType, useSCFetchEvent, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import CreateEventButton, {CreateEventButtonProps} from '../CreateEventButton';
import {SCEventType} from '@selfcommunity/types';

const PREFIX = 'SCEditEventButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(CreateEventButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EditEventButtonProps extends CreateEventButtonProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of the event
   * @default null
   */
  eventId?: number | string;
  /**
   * On edit success callback function
   * @default null
   */
  onEditSuccess?: (data: SCEventType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Event Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateEventButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCEditEventButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEditEventButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function EditEventButton(inProps: EditEventButtonProps): JSX.Element {
  //PROPS
  const props: EditEventButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, eventId, event, onEditSuccess, ...rest} = props;
  const {scEvent, setSCEvent} = useSCFetchEvent({id: eventId, event});
  const scUserContext: SCUserContextType = useSCUser();

  const handleSuccess = (data: SCEventType) => {
    console.log(data);
    setSCEvent(data);
    onEditSuccess && onEditSuccess(data);
  };

  if (!scUserContext.user) {
    return null;
  }
  /**
   * Renders root object
   */
  return (
    <Root
      variant="outlined"
      className={classNames(classes.root, className)}
      EventFormDialogComponentProps={{EventFormComponentProps: {event: scEvent, onSuccess: handleSuccess}}}
      {...rest}>
      <FormattedMessage id="ui.editEventButton" defaultMessage="ui.editEventButton" />
    </Root>
  );
}
