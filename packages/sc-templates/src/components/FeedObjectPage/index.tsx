import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Hidden, Typography} from '@mui/material';
import {FeedObject, RelatedDiscussion, FeedObjectTemplateType, CommentsObject, CommentsOrderBy} from '@selfcommunity/ui';
import {SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/core';
import Sticky from 'react-stickynode';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCFeedObjectPage';

const classes = {
  sidebar: `${PREFIX}-sidebar`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  [`& .${classes.sidebar}`]: {
    paddingTop: 15
  }
}));

export interface FeedObjectPageProps {
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

  /**
   * Id of feed object
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Type of feed object
   * @default SCFeedObjectTypologyType.POST
   */
  feedObjectType?: SCFeedObjectTypologyType;
}

export default function FeedObjectPage(props: FeedObjectPageProps): JSX.Element {
  // PROPS
  const {id = 'feed_object_page', className, feedObjectId, feedObject, feedObjectType} = props;

  return (
    <Root id={id} className={className}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <FeedObject feedObject={feedObject} feedObjectId={feedObjectId} feedObjectType={feedObjectType} template={FeedObjectTemplateType.DETAIL} />
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="templates.feedObjectPage.comments" defaultMessage="templates.feedObjectPage.comments" />
          </Typography>
          <CommentsObject
            feedObject={feedObject}
            feedObjectId={feedObjectId}
            feedObjectType={feedObjectType}
            commentsOrderBy={CommentsOrderBy.ADDED_AT_ASC}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Hidden smDown>
            <Sticky enabled top={15}>
              <Box className={classes.sidebar}>
                <RelatedDiscussion feedObjectId={feedObjectId} feedObjectType={feedObjectType} />
              </Box>
            </Sticky>
          </Hidden>
        </Grid>
      </Grid>
    </Root>
  );
}
