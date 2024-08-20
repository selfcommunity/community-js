import { Icon, Stack, styled, Typography, useThemeProps } from '@mui/material';
import { Link } from '@selfcommunity/react-core';
import { SCEventType } from '@selfcommunity/types';
import { format } from 'date-fns';
import { enUS, it } from 'date-fns/locale';
import { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const LOCALE_MAP = {
  en: enUS,
  it
};

const PREFIX = 'SCEventInfoDetails';

const classes = {
  root: `${PREFIX}-root`,
  iconTextWrapper: `${PREFIX}-icon-text-wrapper`,
  link: `${PREFIX}-link`,
  url: `${PREFIX}-url`,
  creationWrapper: `${PREFIX}-creation-wrapper`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})();

export interface EventInfoDetailsProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;
}

export default function EventInfoDetails(inProps: EventInfoDetailsProps) {
  // PROPS
  const props: EventInfoDetailsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const event = props.event;

  // HOOKS
  const intl = useIntl();

  const privacy = event.privacy === 'public' ? 'ui.eventInfoDetails.privacy.public' : 'ui.eventInfoDetails.privacy.private';
  const location = event.location === 'virtual' ? 'ui.eventInfoDetails.location.virtual' : 'ui.eventInfoDetails.location.inPerson';
  const LocationComponent = event.location === 'virtual' ? Link : Fragment;

  const formatDateEventDate = (date: string) => {
    return format(new Date(date), "EEEE d MMMM' - Ore 'H:mm", {
      locale: LOCALE_MAP[intl.locale]
    }).replace(
      /([a-z/ì]+) (\d{2}) ([a-z]+) - Ore (\d{2}):(\d{2})/,
      (_, weekDay, day, month, hour, minute) =>
        `${weekDay.charAt(0).toUpperCase() + weekDay.slice(1)} ${day} ${month.charAt(0).toUpperCase() + month.slice(1)} - Ore ${hour}:${minute}`
    );
  };

  const formatDateCreateDate = (date: string) => {
    return format(new Date(date), "'Creato il 'd MMMM y", {
      locale: LOCALE_MAP[intl.locale]
    }).replace(
      /Creato il (\d{1})+ ([a-z]+) (\d{4})/,
      (_, day, month, year) => `Creato il ${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
    );
  };

  return (
    <Root className={classes.root}>
      <Stack className={classes.iconTextWrapper}>
        <Icon fontSize="small">CalendarIcon</Icon>
        <Typography variant="body1">{formatDateEventDate(event.start_date)}</Typography>
      </Stack>

      <Stack className={classes.iconTextWrapper}>
        <Icon fontSize="small">{event.privacy === 'public' ? 'public' : 'private'}</Icon>
        <Typography variant="body1">
          <FormattedMessage id={privacy} defaultMessage={privacy} />
        </Typography>
        -
        <Typography variant="body1">
          <FormattedMessage id={location} defaultMessage={location} />
        </Typography>
      </Stack>

      <Stack className={classes.iconTextWrapper}>
        <Icon fontSize="small">{event.location === 'virtual' ? 'play_circle_outline' : 'add_location_alt'}</Icon>
        <LocationComponent to={event.link} target="_blank" className={classes.link}>
          <Typography variant="body1" className={classes.url}>
            {event.location === 'virtual' ? event.link : event.geolocation}
          </Typography>
        </LocationComponent>
      </Stack>

      <Stack className={classes.creationWrapper}>
        <Icon fontSize="small">create</Icon>
        <Typography variant="body1">{formatDateCreateDate(event.created_at)}</Typography>
      </Stack>
    </Root>
  );
}
