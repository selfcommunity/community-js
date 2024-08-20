import {Box, Button, Chip, FormControl, Grid, Icon, InputLabel, MenuItem, Radio, Select, TextField, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Endpoints, EventService, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserContext, SCUserContextType, UserUtils} from '@selfcommunity/react-core';
import {SCEventDateFilterType, SCEventType} from '@selfcommunity/types';
import {Logger, sortByAttr} from '@selfcommunity/utils';
import classNames from 'classnames';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import CreateEventButton from '../CreateEventButton';
import Event, {EventProps, EventSkeleton} from '../Event';
import Skeleton from '../Events/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  filters: `${PREFIX}-filters`,
  events: `${PREFIX}-events`,
  item: `${PREFIX}-item`,
  itemSkeleton: `${PREFIX}-item-skeleton`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const options = [
  {value: SCEventDateFilterType.ANY, label: <FormattedMessage id="ui.events.select.any" defaultMessage="ui.events.select.any" />},
  {value: SCEventDateFilterType.TODAY, label: <FormattedMessage id="ui.events.select.today" defaultMessage="ui.events.select.today" />},
  {value: SCEventDateFilterType.TOMORROW, label: <FormattedMessage id="ui.events.select.tomorrow" defaultMessage="ui.events.select.tomorrow" />},
  {value: SCEventDateFilterType.THIS_WEEK, label: <FormattedMessage id="ui.events.select.thisWeek" defaultMessage="ui.events.select.thisWeek" />},
  {value: SCEventDateFilterType.NEXT_WEEK, label: <FormattedMessage id="ui.events.select.nextWeek" defaultMessage="ui.events.select.nextWeek" />},
  {value: SCEventDateFilterType.THIS_MONTH, label: <FormattedMessage id="ui.events.select.thisMonth" defaultMessage="ui.events.select.thisMonth" />}
];

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const ChipRoot = styled(Chip, {
  name: PREFIX,
  slot: 'ChipRoot'
})(() => ({}));

export interface EventsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Props to spread to single event object
   * @default {}
   */
  EventComponentProps?: EventProps;

  /**
   * Show/Hide filters
   * @default true
   */
  showFilters?: boolean;

  /**
   * Filters component
   * @param props
   */
  filters?: JSX.Element;

  /** If true, it means that the endpoint fetches all events available
   * @default false
   */

  general?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Events component. Learn about the available props and the CSS API.
 *
 *
 * The Events component renders the list of all available events.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Events)

 #### Import
 ```jsx
 import {Events} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCEvents` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvents-root|Styles applied to the root element.|
 |filters|.SCEvents-filters|Styles applied to the title element.|
 |events|.SCEvents-events|Styles applied to the title element.|
 |item|.SCEvents-item|Styles applied to the title element.|
 |noResults|.SCEvents-no-results|Styles applied to no results section.|
 |showMore|.SCEvents-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function Events(inProps: EventsProps): JSX.Element {
  // PROPS
  const props: EventsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    endpointQueryParams = {limit: 8, offset: DEFAULT_PAGINATION_OFFSET},
    className,
    EventComponentProps = {},
    showFilters = false,
    filters,
    general = false,
    ...rest
  } = props;

  // STATE
  const [events, setEvents] = useState<SCEventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [search, setSearch] = useState<string>('');
  const [dateSearch, setDateSearch] = useState(options[0].value);
  const [selected, setSelected] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const onlyStaffEnabled = useMemo(
    () => scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_EVENTS_ONLY_STAFF_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  // MEMO
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // HANDLERS

  const handleChipClick = () => {
    setSelected(!selected);
  };

  const handleDeleteClick = () => {
    setSelected(false);
  };

  /**
   * Fetches events list
   */
  const fetchEvents = () => {
    let eventService;
    if (general) {
      eventService = EventService.searchEvents({
        ...endpointQueryParams,
        ...(search !== '' && {search: search}),
        ...(dateSearch !== SCEventDateFilterType.ANY && {date_filter: dateSearch}),
        ...(selected && {follows: selected})
      });
    } else {
      eventService = EventService.getUserEvents({...endpointQueryParams, ...(search !== '' && {search: search})});
    }
    eventService
      .then((res: SCPaginatedResponse<SCEventType>) => {
        setEvents(res.results);
        setNext(res.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  /**
   * On mount, fetches events list
   */
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else {
      fetchEvents();
    }
  }, [contentAvailability, authUserId, search, dateSearch, selected]);

  const handleNext = useMemo(
    () => () => {
      if (!next) {
        return;
      }
      return http
        .request({
          url: next,
          method: general ? Endpoints.SearchEvents.method : Endpoints.GetUserEvents.method
        })
        .then((res: HttpResponse<any>) => {
          setEvents([...events, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => console.log(error))
        .then(() => setLoading(false));
    },
    [next]
  );

  /**
   * Get events filtered
   */
  const getFilteredEvents = () => {
    if (search) {
      return events.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    }
    return events;
  };

  /**
   * Handle change filter name
   * @param event
   */
  const handleOnChangeFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  /**
   * Handle change time frame
   * @param event
   */
  const handleOnChangeTimeFrame = (event) => {
    setDateSearch(event.target.value);
  };

  /**
   * Renders events list
   */
  const filteredEvents = sortByAttr(getFilteredEvents(), 'order');
  const c = (
    <>
      {showFilters && (
        <Grid container className={classes.filters} gap={2}>
          {filters ? (
            filters
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  size={'small'}
                  fullWidth
                  value={search}
                  label={<FormattedMessage id="ui.events.filterByName" defaultMessage="ui.events.filterByName" />}
                  variant="outlined"
                  onChange={handleOnChangeFilterName}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>
                    <FormattedMessage id="ui.events.filterByDate" defaultMessage="ui.events.filterByDate" />
                  </InputLabel>
                  <Select
                    size={'small'}
                    label={<FormattedMessage id="ui.events.filterByDate" defaultMessage="ui.events.filterByDate" />}
                    value={dateSearch as any}
                    onChange={handleOnChangeTimeFrame}
                    renderValue={(selected) => options.find((option) => option.value === selected).label}>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Radio
                          checked={dateSearch === option.value}
                          value={option.value}
                          name="radio-button-select"
                          inputProps={{'aria-label': option.label as any}}
                        />
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <ChipRoot
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  color={selected ? 'secondary' : 'default'}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  variant={selected ? 'filled' : 'outlined'}
                  label={<FormattedMessage id="ui.events.filterByFollowedInterest" defaultMessage="ui.events.filterByFollowedInterest" />}
                  onClick={handleChipClick}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  selected={selected}
                  deleteIcon={selected ? <Icon>close</Icon> : null}
                  onDelete={selected ? handleDeleteClick : null}
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
      <>
        {!events.length ? (
          <Box className={classes.noResults}>
            {(onlyStaffEnabled && !UserUtils.isStaff(scUserContext.user)) ||
            (onlyStaffEnabled && UserUtils.isStaff(scUserContext.user) && general) ? (
              <>
                <EventSkeleton />
                <Typography variant="body1">
                  <FormattedMessage id="ui.events.noEvents.title" defaultMessage="ui.events.noEvents.title" />
                </Typography>
              </>
            ) : (
              <>
                <EventSkeleton action={<CreateEventButton />} />
                <Typography variant="body1">
                  <FormattedMessage id="ui.events.noEvents.title.onlyStaff" defaultMessage="ui.events.noEvents.title.onlyStaff" />
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <>
            <Grid container spacing={{xs: 2}} className={classes.events}>
              <>
                {filteredEvents.map((event: SCEventType) => (
                  <Grid item xs={12} sm={8} md={6} key={event.id} className={classes.item}>
                    <Event event={event} eventId={event.id} {...EventComponentProps} />
                  </Grid>
                ))}
                {filteredEvents.length <= 3 && (
                  <Grid item xs={12} sm={8} md={6} key={'skeleton-item'} className={classes.itemSkeleton}>
                    <EventSkeleton
                      action={
                        <CreateEventButton variant="outlined" color="primary" size="small">
                          <FormattedMessage id="ui.events.skeleton.action.add" defaultMessage="ui.events.skeleton.action.add" />
                        </CreateEventButton>
                      }
                    />
                  </Grid>
                )}
              </>
            </Grid>
            {Boolean(next) && (
              <Button color="secondary" variant="text" onClick={handleNext} className={classes.showMore}>
                <FormattedMessage id="ui.events.button.seeMore" defaultMessage="ui.events.button.seeMore" />
              </Button>
            )}
          </>
        )}
      </>
    </>
  );

  /**
   * Renders root object (if content availability community option is false and user is anonymous, component is hidden)
   */
  if (!contentAvailability && !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (loading) {
    return <Skeleton />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
