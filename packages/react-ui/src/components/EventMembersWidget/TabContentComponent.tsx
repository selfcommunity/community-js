import {Button, List, ListItem, styled, Typography} from '@mui/material';
import {Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCEventType, SCUserType} from '@selfcommunity/types';
import {AxiosResponse} from 'axios';
import {Dispatch, SetStateAction, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {actionWidgetTypes} from '../../utils/widget';
import InviteUserEventButton from '../InviteUserEventButton';
import User, {UserProps, UserSkeleton} from '../User';
import {PREFIX} from './constants';

const classes = {
  actionButton: `${PREFIX}-action-button`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  endMessage: `${PREFIX}-end-message`
};

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

interface TabComponentProps {
  state: any;
  dispatch: Dispatch<any>;

  /**
   * Props to spread to single user object
   * @default empty object
   */
  userProps?: UserProps;

  /**
   * Props to spread to users suggestion dialog
   * @default {}
   */
  dialogProps?: BaseDialogProps;

  actionProps?: {
    scEvent?: SCEventType;
    setInvitedNumber: Dispatch<SetStateAction<number>>;
  };
}

export default function TabContentComponent(props: TabComponentProps) {
  // PROPS
  const {state, dispatch, userProps, dialogProps, actionProps} = props;

  // STATE
  const [openDialog, setOpenDialog] = useState(false);

  // HANDLERS
  /**
   * Handles pagination
   */
  const handleNext = useCallback(() => {
    dispatch({type: actionWidgetTypes.LOADING_NEXT});
    http
      .request({
        url: state.next,
        method: Endpoints.UserSuggestion.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
      });
  }, [dispatch, state.next, state.isLoadingNext, state.initialized]);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  const getActionsComponent = useCallback(
    (userId: number) =>
      actionProps ? <InviteUserEventButton event={actionProps.scEvent} userId={userId} setInvitedNumber={actionProps.setInvitedNumber} /> : undefined,
    [actionProps]
  );

  return (
    <>
      <List>
        {state.results.map((user: SCUserType) => (
          <ListItem key={user.id}>
            <User elevation={0} user={user} {...userProps} actions={getActionsComponent(user.id)} />
          </ListItem>
        ))}
      </List>

      {state.count > state.visibleItems && (
        <Button onClick={handleToggleDialogOpen} className={classes.actionButton}>
          <Typography variant="caption">
            <FormattedMessage id="ui.eventMembersWidget.showAll" defaultMessage="ui.eventMembersWidget.showAll" />
          </Typography>
        </Button>
      )}

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.eventMembersWidget.title" id="ui.eventMembersWidget.title" />}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...dialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<UserSkeleton elevation={0} {...userProps} />}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.eventMembersWidget.noMoreResults" defaultMessage="ui.eventMembersWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User elevation={0} user={user} {...userProps} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
