import {useSCGoogleApiLoader} from '@selfcommunity/react-core';
import {SCEventType} from '@selfcommunity/types';
import {Map, Marker} from '@vis.gl/react-google-maps';
import {HTMLAttributes} from 'react';

interface EventMapProps {
  event: SCEventType;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function EventMap(props: EventMapProps) {
  // PROPS
  const {event, className} = props;

  // HOOKS
  const {isLoaded} = useSCGoogleApiLoader();

  if (!isLoaded) {
    return null;
  }

  return (
    <Map
      className={className}
      center={{
        lat: event.geolocation_lat,
        lng: event.geolocation_lng
      }}
      zoom={15}
      fullscreenControl={false} // Disables the fullscreen control
      mapTypeControl={false} // Disables the map type selector (satellite/map)
      streetViewControl={false} // Disables the Street View pegman control
      zoomControl={false} // Disables the zoom control (+/- buttons)
    >
      <Marker
        position={{
          lat: event.geolocation_lat,
          lng: event.geolocation_lng
        }}
      />
    </Map>
  );
}
