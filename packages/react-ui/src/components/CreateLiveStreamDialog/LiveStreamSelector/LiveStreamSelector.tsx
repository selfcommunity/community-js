import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, Button, Paper, Container, Radio, Theme, Alert} from '@mui/material';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {LiveStreamType} from '../types';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import EventImage from '../../../assets/liveStream/event';
import LiveImage from '../../../assets/liveStream/live';
import {LiveStreamApiClient} from '@selfcommunity/api-services';
import {WARNING_THRESHOLD_EXPIRING_SOON} from '../../LiveStreamRoom/constants';

export const PREFIX = 'SCLiveStreamSelector';

const classes = {
  root: `${PREFIX}-root`,
  warning: `${PREFIX}-warning`,
  options: `${PREFIX}-options`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Container, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

// Styled components
const OptionCard = styled(Paper, {
  name: PREFIX,
  slot: 'optionCardRoot',
  shouldForwardProp: (prop) => prop !== 'selected'
})<{theme: Theme; selected: boolean}>(({theme, selected}) => ({}));

const FeatureItem = styled(Box, {
  name: PREFIX,
  slot: 'featureItemRoot'
})(({theme}) => ({}));

export interface LiveStreamSelectorProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Option selected
   */
  liveSelected?: LiveStreamType;
  /**
   * Callback on selected option
   * @param LiveStreamType
   */
  onLiveSelected?: (live: LiveStreamType) => void;
  /**
   * On success callback function
   * @default null
   */
  onNext?: (live: LiveStreamType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS LiveStreamSelector component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamSelector} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCLiveStreamSelector` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamDialog-root|Styles applied to the root element.|

 * @param inProps
 */
export default function LiveStreamSelector(inProps: LiveStreamSelectorProps): JSX.Element {
  //PROPS
  const props: LiveStreamSelectorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, liveSelected, onLiveSelected, onNext, ...rest} = props;

  // CONTEXT
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const [selectedOption, setSelectedOption] = useState<LiveStreamType | null>(liveSelected);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const options = [
    {
      title: 'Schedule a live event',
      image: EventImage,
      type: LiveStreamType.EVENT_LIVE,
      features: [
        'Schedule a live room or stream in your event space',
        'Allow your members to RSVP, add to calendar, and receive event reminders',
        'Automatically post the event recording to your space',
        'Allow your members to host the event'
      ],
      icons: [<Icon>chevron_right</Icon>, <Icon>chevron_right</Icon>, <Icon>chevron_right</Icon>, <Icon>chevron_right</Icon>]
    },
    {
      title: 'Start a live stream',
      image: LiveImage,
      type: LiveStreamType.DIRECT_LIVE,
      features: [
        'Best for webinars, Q&As, AMAs, and for presentations',
        'Up to 100 people',
        'Only co-hosts can talk to each other with audio/video',
        'View-only participants can only chat or be promoted to the stage'
      ],
      icons: [<Icon>chevron_right</Icon>, <Icon>chevron_right</Icon>, <Icon>chevron_right</Icon>, <Icon>chevron_right</Icon>]
    }
  ];

  const handleOptionSelect = (type) => {
    setSelectedOption(type);
    onLiveSelected(type);
  };

  const handleNext = () => {
    if (!selectedOption) {
      enqueueSnackbar(<FormattedMessage id="ui.common.error" defaultMessage="ui.common.error" />, {
        variant: 'error',
        autoHideDuration: 3000
      });
    } else {
      onNext && onNext(selectedOption);
    }
  };

  const fetchLivestreamStatus = () => {
    LiveStreamApiClient.getMonthlyDuration()
      .then((r) => {
        setTimeRemaining(r.remaining_minutes);
      })
      .catch((error) => {
        console.error('Error fetching live status:', error);
      });
  };

  useEffect(() => {
    fetchLivestreamStatus();
  }, []);

  return (
    <Root className={classNames(classes.root, className)} maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{mb: 4, fontWeight: 500}}>
        How do you want to go live?
      </Typography>
      {timeRemaining !== null && timeRemaining <= WARNING_THRESHOLD_EXPIRING_SOON && (
        <Box className={classes.warning}>
          <Alert variant="filled" severity="warning">
            {timeRemaining <= 1 ? (
              <FormattedMessage
                id="ui.liveStreamRoom.selector.warningMinutesExausted"
                defaultMessage="ui.liveStreamRoom.selector.warningMinutesExausted"
              />
            ) : timeRemaining <= WARNING_THRESHOLD_EXPIRING_SOON ? (
              <FormattedMessage
                id="ui.liveStreamRoom.selector.warningRemainingMinutes"
                defaultMessage="ui.liveStreamRoom.selector.warningRemainingMinutes"
                values={{minutes: timeRemaining}}
              />
            ) : null}
          </Alert>
        </Box>
      )}
      <Box className={classes.options}>
        {options.map((option, index) => (
          <OptionCard
            key={index}
            selected={selectedOption === option.type}
            onClick={() => handleOptionSelect(option.type)}
            elevation={0}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOptionSelect(index);
                e.preventDefault();
              }
            }}
            theme={undefined}>
            <Box>
              <Typography variant="h6" component="h2" sx={{fontWeight: 500}}>
                {option.title}
              </Typography>
              <Radio checked={selectedOption === option.type} />
            </Box>
            <img src={option.image} alt="logo" />
            <Box component="ul">
              {option.features.map((feature, featureIndex) => {
                const _Icon = option.icons[featureIndex];
                return (
                  <FeatureItem component="li" key={featureIndex}>
                    {_Icon}
                    <Typography variant="body2" color="text.secondary" sx={{flex: 1}}>
                      {feature}
                    </Typography>
                  </FeatureItem>
                );
              })}
            </Box>
          </OptionCard>
        ))}
      </Box>
      <Box className={classes.actions}>
        <Button disabled={!selectedOption || !timeRemaining} variant="contained" onClick={handleNext} color="secondary">
          Next
        </Button>
      </Box>
    </Root>
  );
}
