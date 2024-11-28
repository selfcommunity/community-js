import {useState, useEffect, useRef, useCallback} from 'react';
import {LiveStreamApiClient} from '@selfcommunity/api-services';
import {useDisconnectButton, useParticipants} from '@livekit/components-react';
import {useLiveStream} from './LiveStreamProvider';
import {useSnackbar} from 'notistack';
import {useIntl} from 'react-intl';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {LIVE_CHECKING_INTERVAL, WARNING_THRESHOLD_EXPIRING_SOON} from '../constants';

/**
 * Custom hook for monitoring livestream.
 * @param {number} warningThreshold
 * @param showWarnings
 * @param performDisconnect
 */
export function useLivestreamCheck(warningThreshold = WARNING_THRESHOLD_EXPIRING_SOON, showWarnings = true, performDisconnect = true) {
  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();
  const participants = useParticipants();
  const {liveStream} = useLiveStream();
  const {buttonProps} = useDisconnectButton({});
  const {enqueueSnackbar} = useSnackbar();
  const __DEBUG = useRef(true);

  // STATE
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);

  // INTL
  const intl = useIntl();

  const fetchLivestreamStatus = () => {
    LiveStreamApiClient.getMonthlyDuration()
      .then((r) => {
        setTimeRemaining(r.remaining_minutes);
        if (r.remaining_minutes > 0 && r.remaining_minutes <= warningThreshold) {
          setIsExpiringSoon(true);
          if (!isExpiringSoon && !isExpired && liveStream.host.id === scUserContext.user.id && showWarnings) {
            __DEBUG && console.log('Warning: ');
            enqueueSnackbar(
              intl.formatMessage({id: 'ui.liveStreamRoom.check.fewMinutesRemaining', defaultMessage: 'ui.liveStreamRoom.check.fewMinutesRemaining'}),
              {
                variant: 'warning',
                autoHideDuration: 30000
              }
            );
          }
        } else if (r.remaining_minutes <= 0) {
          __DEBUG && console.log('Livestream  ');
          setIsExpired(true);
          clearInterval(intervalRef.current);
        }
      })
      .catch((error) => {
        console.error('Error fetching live status:', error);
      });
  };

  const check = useCallback(() => {
    if (__DEBUG) {
      console.log('Checking live status');
      console.log(participants.length);
      console.log('isExpiringSoon: ', isExpiringSoon);
      console.log('isExpired: ', isExpired);
      console.log('Checking participants...', participants.length);
      console.log(participants);
    }
    if (participants.length <= 1) {
      isExpiringSoon ? setIsExpired(true) : setIsExpiringSoon(true);
      if (!isExpiringSoon && !isExpired && showWarnings) {
        enqueueSnackbar(
          intl.formatMessage({id: 'ui.liveStreamRoom.check.youAreAloneInTheRoom', defaultMessage: 'ui.liveStreamRoom.check.youAreAloneInTheRoom'}),
          {variant: 'warning', autoHideDuration: 7000}
        );
      } else if (isExpired && performDisconnect) {
        // Leave the room
        __DEBUG && console.log('Leave the room: no participants');
        buttonProps.onClick();
      }
      return;
    }
    __DEBUG && console.log('Checking live speaker...');
    const speaker = participants.find((pt) => {
      return pt.name === liveStream.host.username;
    });
    if (!speaker) {
      isExpiringSoon ? setIsExpired(true) : setIsExpiringSoon(true);
      if (!isExpiringSoon && !isExpired && liveStream.host.id !== scUserContext.user.id && showWarnings) {
        enqueueSnackbar(intl.formatMessage({id: 'ui.liveStreamRoom.check.hostMissing', defaultMessage: 'ui.liveStreamRoom.check.hostMissing'}), {
          variant: 'warning',
          autoHideDuration: 7000
        });
      } else if (isExpired && performDisconnect) {
        // Leave the room
        __DEBUG && console.log('Leave the room: no host');
        buttonProps.onClick();
      }
    }
    __DEBUG && console.log('Checking live status resources...');
    fetchLivestreamStatus();
  }, [isExpired, isExpiringSoon, buttonProps, participants]);

  useEffect(() => {
    intervalRef.current = setInterval(check, LIVE_CHECKING_INTERVAL * 1000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isExpired, isExpiringSoon]);

  return {timeRemaining, isExpiringSoon, isExpired};
}
