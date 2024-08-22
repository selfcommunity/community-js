import { Box, Button, CardContent, Icon, Stack, styled, Typography, useThemeProps } from '@mui/material';
import { useSCFetchEvent } from '@selfcommunity/react-core';
import { SCEventType } from '@selfcommunity/types';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import EventInfoDetails from '../../shared/EventInfoDetails';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Widget, { WidgetProps } from '../Widget';
import { PREFIX } from './constants';
import Skeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  titleWrapper: `${PREFIX}-title-wrapper`,
  textWrapper: `${PREFIX}-text-wrapper`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})();

export interface EventInfoWidgetProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of event object
   * @default null
   */
  eventId?: number;

  /**
   * True if summary must be already expanded
   * @default false
   */
  summaryExpanded?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}

function isTextLongerThanLimit(text: string, limit = 125) {
  return text.length > limit;
}

function getTruncatedText(text: string, limit = 125) {
  return isTextLongerThanLimit(text, limit) ? text.substring(0, limit).concat('...') : text;
}

export default function EventInfoWidget(inProps: EventInfoWidgetProps) {
  // PROPS
  const props: EventInfoWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const { event, eventId, summaryExpanded = false, ...rest } = props;

  // STATE
  const [expanded, setExpanded] = useState(summaryExpanded);
  const [showButton, setShowButton] = useState(!summaryExpanded);
  const [loading, setLoading] = useState(true);

  // HOOKS
  const { scEvent } = useSCFetchEvent({ id: eventId, event });

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!scEvent) {
      return;
    }

    const _showButton = isTextLongerThanLimit(scEvent.description, 220);

    if (_showButton !== !summaryExpanded) {
      setShowButton(_showButton);
    }
  }, [scEvent]);

  /**
   * Handle toggle summary
   */
  const handleToggleSummary = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  // RENDER
  if (!scEvent && loading) {
    return <Skeleton />;
  }

  if (!scEvent) {
    return <HiddenPlaceholder />;
  }

  const description = expanded ? scEvent.description : getTruncatedText(scEvent.description, 220);

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Stack className={classes.titleWrapper}>
          <Icon fontSize="small">info</Icon>

          <Typography variant="h5">
            <FormattedMessage id="ui.infoEventWidget.title" defaultMessage="ui.infoEventWidget.title" />
          </Typography>
        </Stack>

        <Box className={classes.textWrapper}>
          <Typography component="span" variant="body1">
            {description}

            {showButton && !expanded && (
              <Button size="small" variant="text" className={classes.showMore} onClick={handleToggleSummary}>
                <FormattedMessage id="ui.infoEventWidget.showMore" defaultMessage="ui.infoEventWidget.showMore" />
              </Button>
            )}
          </Typography>
        </Box>

        <EventInfoDetails event={scEvent} hasCreatedInfo={true} />
      </CardContent>
    </Root>
  );
}
