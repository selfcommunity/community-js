import React, {useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Box, Button, Divider, IconButton, Tooltip, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import SharesDialog from './SharesDialog';
import {SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';

const messages = defineMessages({
  shares: {
    id: 'ui.feedObject.share.shares',
    defaultMessage: 'ui.feedObject.share.shares'
  },
  share: {
    id: 'ui.feedObject.share.share',
    defaultMessage: 'ui.feedObject.share.share'
  }
});

const PREFIX = 'SCShareObject';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function Share({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  withAction = false,
  inlineAction = true,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  withAction: boolean;
  inlineAction: boolean;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [openSharesDialog, setOpenSharesDialog] = useState<boolean>(false);
  const intl = useIntl();

  /**
   * Open/Close dialog shares
   */
  function handleToggleSharesDialog() {
    setOpenSharesDialog(!openSharesDialog);
  }

  /**
   * Perform share contribute
   */
  function share() {
    setIsSharing(false);
  }

  /**
   * Render inline action (as button if withAction==true && inlineAction==true)
   * @return {JSX.Element}
   */
  function renderInlineStartShareBtn() {
    if (withAction && inlineAction) {
      return (
        <Tooltip title={isSharing ? '' : 'Share'}>
          <IconButton disabled={isSharing} onClick={share} edge={isSharing ? false : 'end'} size="large">
            {isSharing ? (
              <Box style={{padding: 10}}>
                <CircularProgress size={14} style={{marginTop: -2}} />
              </Box>
            ) : (
              <React.Fragment>
                <ShareIcon fontSize="small" />
              </React.Fragment>
            )}
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  /**
   * Render audience with detail dialog
   * @return {JSX.Element}
   */
  function renderAudience() {
    const sharesCount = obj.share_count;
    return (
      <Box>
        {renderInlineStartShareBtn()}
        <Button variant="text" size="small" onClick={handleToggleSharesDialog} disabled={sharesCount < 1} sx={{height: 32}}>
          <Typography variant={'body2'}>
            <React.Fragment>{`${intl.formatMessage(messages.shares, {total: sharesCount})}`}</React.Fragment>
          </Typography>
        </Button>
        {openSharesDialog && sharesCount > 0 && <SharesDialog object={obj} open={openSharesDialog} onClose={handleToggleSharesDialog} />}
      </Box>
    );
  }

  /**
   * Render vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderShareBtn() {
    return (
      <React.Fragment>
        {withAction && !inlineAction && (
          <React.Fragment>
            <Divider />
            <Tooltip title={`${intl.formatMessage(messages.share)}`}>
              <LoadingButton loading={isSharing} onClick={share}>
                <ShareIcon fontSize={'large'} />
              </LoadingButton>
            </Tooltip>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return (
    <Root {...rest}>
      {renderAudience()}
      {renderShareBtn()}
    </Root>
  );
}
