import {ChipProps, Icon, useThemeProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from './constants';
import {EventsChipRoot} from './Events';

export interface OngoingEventsFilterProps extends ChipProps {
  autoHide?: boolean;
  showOngoingEvents: boolean;
  handleClick: () => void;
  handleDeleteClick?: () => void;
}

export default function OngoingEventsFilter(inProps: OngoingEventsFilterProps): JSX.Element {
  // PROPS
  const props: OngoingEventsFilterProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide = false, showOngoingEvents, handleClick, handleDeleteClick, ...rest} = props;

  if (autoHide) {
    return null;
  }

  return (
    <EventsChipRoot
      color={showOngoingEvents ? 'secondary' : 'default'}
      variant={showOngoingEvents ? 'filled' : 'outlined'}
      label={<FormattedMessage id="ui.events.filterByOngoingEvents" defaultMessage="ui.events.filterByOngoingEvents" />}
      onClick={handleClick}
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      showOngoingEvents={showOngoingEvents}
      deleteIcon={showOngoingEvents ? <Icon>close</Icon> : null}
      onDelete={showOngoingEvents ? handleDeleteClick : undefined}
      {...rest}
    />
  );
}
