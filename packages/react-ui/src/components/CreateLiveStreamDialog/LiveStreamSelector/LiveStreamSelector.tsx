import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, Button, Paper, Container, Radio, Theme} from '@mui/material';
import Icon from '@mui/material/Icon';
import {PREFIX} from '../constants';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {LiveStreamType} from '../types';
import {SCEventLocationType, SCEventRecurrenceType, SCEventType, SCLiveStreamType} from '@selfcommunity/types';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import {EVENT_DESCRIPTION_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH} from '../../../constants/Event';

const classes = {
  root: `${PREFIX}-root`,
  options: `${PREFIX}-options`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Container, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  [`& .${classes.options}`]: {
    display: 'flex',
		justifyContent: 'center',
    alignItems: 'center',
		'& > div': {
			width: '310px'
		}
  },
  [`& .${classes.actions}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: theme.spacing(4)
  }
}));

// Styled components
const OptionCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<{theme: Theme; selected: boolean}>(({theme, selected}) => ({
  maxWidth: '300px',
  padding: theme.spacing(3),
  margin: theme.spacing(0, 3),
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short
  }),
  backgroundColor: selected ? theme.palette.grey[100] : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    boxShadow: theme.shadows[2]
  },
  border: `1px solid ${theme.palette.divider}`,
  [`& > div`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    maxWidth: '300px'
  },
  [`& ul`]: {
    marginTop: theme.spacing(2),
    padding: 0,
    listStyle: 'none'
  }
}));

const RadioIndicator = styled(Radio, {
  // shouldForwardProp: (prop) => prop !== 'selected'
})<{theme: Theme; selected: boolean}>(({theme, selected}) => ({
  /* width: 16,
  height: 16,
  borderRadius: '50%',
  border: `2px solid ${selected ? theme.palette.secondary.main : theme.palette.grey[300]}`,
  backgroundColor: selected ? theme.palette.secondary.main : 'transparent',
  transition: theme.transitions.create(['border-color', 'background-color'], {
    duration: theme.transitions.duration.shortest
  }) */
}));

const FeatureItem = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0
  }
}));

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

  const options = [
    {
      title: 'Schedule a live event',
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

  return (
    <Root className={classNames(classes.root, className)} maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{mb: 4, fontWeight: 500}}>
        How do you want to go live?
      </Typography>
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
        <Button disabled={!selectedOption} variant="contained" onClick={handleNext} color="secondary">
          Next
        </Button>
      </Box>
    </Root>
  );
}
