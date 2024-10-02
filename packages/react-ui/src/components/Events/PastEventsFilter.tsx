import React from 'react';
import {ChipProps, Icon} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {EventsChipRoot} from './Events';

export interface PastEventsFilterProps extends ChipProps {
  autoHide?: boolean;
  showPastEvents: boolean;
  handleClick: () => void;
  handleDeleteClick?: () => void;
}

export default function PastEventsFilter(inProps: PastEventsFilterProps): JSX.Element {
  // PROPS
  const props: PastEventsFilterProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide = false, showPastEvents, handleClick, handleDeleteClick, ...rest} = props;

  if (autoHide) {
    return null;
  }

  return (
    <EventsChipRoot
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      color={showPastEvents ? 'secondary' : 'default'}
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      variant={showPastEvents ? 'filled' : 'outlined'}
      label={<FormattedMessage id="ui.events.filterByPastEvents" defaultMessage="ui.events.filterByPastEvents" />}
      onClick={handleClick}
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      showPastEvents={showPastEvents}
      deleteIcon={showPastEvents ? <Icon>close</Icon> : null}
      onDelete={showPastEvents ? handleDeleteClick : undefined}
      {...rest}
    />
  );
}
