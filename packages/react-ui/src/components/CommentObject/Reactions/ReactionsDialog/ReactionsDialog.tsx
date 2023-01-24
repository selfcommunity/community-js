import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Box, List, ListItem, Tab, Tabs} from '@mui/material';
import InfiniteScroll from '../../../../shared/InfiniteScroll';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {useSCFetchCommentObject} from '@selfcommunity/react-core';
import {SCCommentType, SCCommentTypologyType, SCReactionType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import BaseDialog from '../../../../shared/BaseDialog';
import CentralProgress from '../../../../shared/CentralProgress';
import User from '../../../User';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import _ from 'lodash';

const PREFIX = 'SCCommentObjectReactionsDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});

export interface CommentObjectReactionsDialogProps {
  /**
   * Id of the comment object
   * @default null
   */
  commentObjectId?: number;

  /**
   * Comment object
   * @default null
   */
  commentObject?: SCCommentType;

  /**
   * open/close the dialog
   * @default false
   */
  open?: boolean;

  /**
   * Callback invoked when dialog close
   */
  onClose?: () => any;

  /**
   * The reactions added to the comment
   */
  reactionsList: SCReactionType[];
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string | any;
}
function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div hidden={value !== index} id={`tab-panel-${index}`} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}

export default function CommentObjectReactionsDialog(inProps: CommentObjectReactionsDialogProps): JSX.Element {
  // PROPS
  const props: CommentObjectReactionsDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {commentObjectId, commentObject, open = false, onClose, reactionsList = []} = props;

  // RETRIEVE OBJECTS
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votes, setVotes] = useState([]);
  const [next, setNext] = useState<string>(null);
  const [tabIndex, setTabIndex] = useState<string>('all');
  const filteredVotes = _.groupBy(votes, (v) => v.reaction.label);

  // HANDLERS
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (obj) {
      fetchVotes();
    }
  }, [obj.id]);

  function fetchVotes() {
    setIsLoading(true);
    http
      .request({
        url: next ? next : `${Endpoints.VotesList.url({type: SCCommentTypologyType, id: obj.id})}`,
        method: Endpoints.VotesList.method
      })
      .then((res: HttpResponse<any>) => {
        const data: {results: Record<string, any>[]; next?: string} = res.data;
        setVotes([...data.results, ...votes]);
        setIsLoading(false);
        setNext(data.next !== null ? data.next : null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  return (
    <BaseDialog
      title={
        <Tabs value={tabIndex} onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab
            value={'all'}
            label={<FormattedMessage defaultMessage="ui.commentObjectReactionsDialog.title" id="ui.commentObjectReactionsDialog.title" />}
          />
          {reactionsList.map((r: any, index) => (
            <Tab
              icon={
                <Icon>
                  <img alt={r.reaction.label} src={r.reaction.image} width={20} height={20} />
                </Icon>
              }
              iconPosition="start"
              label={r.count}
              key={index}
              value={r.reaction.label}
            />
          ))}
        </Tabs>
      }
      onClose={onClose}
      open={open}>
      {isLoading ? (
        <CentralProgress size={50} />
      ) : (
        <>
          <TabPanel value={'all'} index={tabIndex}>
            <InfiniteScroll
              dataLength={votes.length}
              next={fetchVotes}
              hasMoreNext={Boolean(next)}
              loaderNext={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage
                      id="ui.commentObjectReactionsDialog.noOtherLikes"
                      defaultMessage="ui.commentObjectReactionsDialog.noOtherLikes"
                    />
                  </b>
                </p>
              }>
              <List>
                {votes.map((vote, index) => (
                  <ListItem key={index}>
                    <User elevation={0} user={vote.user} key={index} sx={{m: 0}} showReaction={true} reaction={vote.reaction} />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          </TabPanel>
          {Object.keys(filteredVotes).map((key, index) => (
            <React.Fragment key={index}>
              <TabPanel value={key} index={tabIndex}>
                <InfiniteScroll
                  dataLength={votes.length}
                  next={fetchVotes}
                  hasMoreNext={Boolean(next)}
                  loaderNext={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage
                          id="ui.commentObjectReactionsDialog.noOtherLikes"
                          defaultMessage="ui.commentObjectReactionsDialog.noOtherLikes"
                        />
                      </b>
                    </p>
                  }>
                  <List>
                    {filteredVotes[key].map((vote, index) => (
                      <ListItem key={index}>
                        <User elevation={0} user={vote.user} key={index} sx={{m: 0}} showReaction={true} reaction={vote.reaction} />
                      </ListItem>
                    ))}
                  </List>
                </InfiniteScroll>
              </TabPanel>
            </React.Fragment>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
