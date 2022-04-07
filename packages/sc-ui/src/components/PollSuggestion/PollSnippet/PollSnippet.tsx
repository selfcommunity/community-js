import React from 'react';
import {styled} from '@mui/material/styles';
import {Button, Typography} from '@mui/material';
import {Link, SCFeedDiscussionType, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {getContributionRouteName, getRouteData} from '../../../utils/contribute';
import BaseItemButton from '../../../shared/BaseItemButton';

const PREFIX = 'SCPollSnippet';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  action: `${PREFIX}-action`,
  seeItem: `${PREFIX}-see-item`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PollSnippetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The feed Object
   * @default null
   */
  feedObj?: SCFeedDiscussionType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI PollSnippet component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {PollSnippet} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCPollSnippet` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSnippet-root|Styles applied to the root element.|
 |title|.SCPollSnippet-title|Styles applied to the title element.|
 |action|.SCPollSnippet-actions|Styles applied to action section.|
 |seeItem|.SCPollSnippet-see-item|Styles applied to the see item button element.|

 * @param inProps
 */
export default function PollSnippet(inProps: PollSnippetProps): JSX.Element {
  // PROPS
  const props: PollSnippetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {feedObj = null, className = null, autoHide = false, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // RENDER
  if (!autoHide) {
    return (
      <Root
        {...rest}
        className={classNames(classes.root, className)}
        primary={
          <>
            <Typography>{feedObj.author.username}</Typography>
            <Typography variant="body1" className={classes.title}>
              {feedObj.poll.title}
            </Typography>
          </>
        }
        secondary={
          <Typography
            variant="body2"
            sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
            dangerouslySetInnerHTML={{__html: feedObj.summary ?? null}}
          />
        }
        actions={
          <Button
            size="small"
            variant="outlined"
            className={classes.seeItem}
            component={Link}
            to={scRoutingContext.url(getContributionRouteName(feedObj), getRouteData(feedObj))}>
            <FormattedMessage id="ui.pollSuggestion.pollSnippet.button.seeItem" defaultMessage="ui.pollSuggestion.pollSnippet.button.seeItem" />
          </Button>
        }
      />
    );
  }
  return null;
}
