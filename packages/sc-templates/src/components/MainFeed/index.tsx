import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {CategoriesSuggestion, Feed, InlineComposer, LoyaltyProgram, PeopleSuggestion, Platform, SCFeedWidgetType} from '@selfcommunity/ui';
import {Endpoints} from '@selfcommunity/core';

const PREFIX = 'SCMainFeedTemplate';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface MainFeedProps {
  /**
   * Id of the feed object
   * @default 'feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: InlineComposer,
    componentProps: {},
    column: 'left',
    position: 0
  },
  {
    type: 'widget',
    component: Platform,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: LoyaltyProgram,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: CategoriesSuggestion,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: PeopleSuggestion,
    componentProps: {},
    column: 'right',
    position: 3
  }
];

export default function MainFeed(props: MainFeedProps): JSX.Element {
  // PROPS
  const {id = 'main_feed', className} = props;

  return (
    <Root id={id} className={className}>
      <Feed endpoint={Endpoints.MainFeed} widgets={WIDGETS} />
    </Root>
  );
}
