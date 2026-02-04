import {useSCGoogleApiLoader} from '@selfcommunity/react-core';
import {SCEventType} from '@selfcommunity/types';
import {Map, AdvancedMarker} from '@vis.gl/react-google-maps';
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

  /**
   * Valid mapId for AdvancedMarker
   * https://visgl.github.io/react-google-maps/docs/guides/ssr-and-frameworks
   * https://developers.google.com/maps/deprecations
   * https://developers.google.com/maps/documentation/javascript/advanced-markers/migration
   */
  return (
    <Map
      className={className}
      mapId="aef14f6caa750c5616b23934"
      defaultCenter={{
        lat: event.geolocation_lat,
        lng: event.geolocation_lng
      }}
      zoom={15}
      gestureHandling="greedy"
      fullscreenControl={false} // Disables the fullscreen control
      mapTypeControl={false} // Disables the map type selector (satellite/map)
      streetViewControl={false} // Disables the Street View pegman control
      zoomControl={false} // Disables the zoom control (+/- buttons)
    >
      <AdvancedMarker
        position={{
          lat: event.geolocation_lat,
          lng: event.geolocation_lng
        }}
      />
    </Map>
  );
}
