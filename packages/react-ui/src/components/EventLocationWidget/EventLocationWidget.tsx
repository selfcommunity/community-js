import {Box, CardContent, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {GoogleMap, MarkerF} from '@react-google-maps/api';
import {useSCGoogleApiLoader, useSCFetchEvent} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {formatEventLocationGeolocation} from '../../utils/string';
import Widget from '../Widget';
import {PREFIX} from './constants';
import EventLocationWidgetSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  map: `${PREFIX}-map`,
  locationTitle: `${PREFIX}-location-title`,
  address: `${PREFIX}-address`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EventLocationWidgetProps extends VirtualScrollerItemProps {
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
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Group Info Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget containing the event info.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/EventLocationWidget)

 #### Import

 ```jsx
 import {EventLocationWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEventLocationWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventLocationWidget-root|Styles applied to the root element.|
 |title|.SCEventLocationWidget-title|Styles applied to the title element.|
 |map|.SCEventLocationWidget-map|Styles applied to the map element.|
 |locationTitle|.SCEventLocationWidget-location-title|Styles applied to the location title element.|
 |address|.SCEventLocationWidget-address|Styles applied to the address element.|

 *
 * @param inProps
 */
export default function EventLocationWidget(inProps: EventLocationWidgetProps): JSX.Element {
  // PROPS
  const props: EventLocationWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, event, eventId, ...rest} = props;
  // STATE
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  // HOOKS
  const {isLoaded, geocodingApiKey} = useSCGoogleApiLoader();

  const mapOptions = {
    fullscreenControl: false, // Disables the fullscreen control
    mapTypeControl: false, // Disables the map type selector (satellite/map)
    streetViewControl: false, // Disables the Street View pegman control
    zoomControl: false // Disables the zoom control (+/- buttons)
  };

  if (!geocodingApiKey || scEvent?.location === SCEventLocationType.ONLINE) {
    return <HiddenPlaceholder />;
  }

  /**
   * Loading event
   */
  if (!isLoaded || !scEvent) {
    return <EventLocationWidgetSkeleton />;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography variant="h4" className={classes.title} gutterBottom>
          <FormattedMessage id="ui.eventLocationWidget.title" defaultMessage="ui.eventLocationWidget.title" />
        </Typography>
        <Box className={classes.map}>
          <GoogleMap
            mapContainerClassName={classes.map}
            center={{
              lat: scEvent.geolocation_lat,
              lng: scEvent.geolocation_lng
            }}
            options={mapOptions}
            zoom={15}>
            <MarkerF
              position={{
                lat: scEvent.geolocation_lat,
                lng: scEvent.geolocation_lng
              }}
            />
          </GoogleMap>
        </Box>
        <Typography variant="h4" className={classes.locationTitle}>
          {formatEventLocationGeolocation(scEvent.geolocation, true)}
        </Typography>
        <Typography variant="body1" className={classes.address}>
          {formatEventLocationGeolocation(scEvent.geolocation)}
        </Typography>
      </CardContent>
    </Root>
  );
}
