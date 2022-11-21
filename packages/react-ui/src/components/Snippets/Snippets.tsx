import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Divider, List, useMediaQuery, useTheme} from '@mui/material';
import Widget from '../Widget';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCPrivateMessageType, SCNotificationTopicType, SCNotificationTypologyType} from '@selfcommunity/types';
import SnippetsSkeleton from './Skeleton';
import Message from '../Message';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import PubSub from 'pubsub-js';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCSnippets';

const classes = {
  root: `${PREFIX}-root`,
  selected: `${PREFIX}-selected`,
  deleteSection: `${PREFIX}-delete-section`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  height: '550px',
  overflow: 'auto',
  [theme.breakpoints.up('sm')]: {
    minWidth: '500px'
  },
  [theme.breakpoints.down('md')]: {
    height: '100%',
    boxShadow: 'none'
  },
  [`& .${classes.selected}`]: {
    background: theme.palette.primary.main
  },
  [`& .${classes.deleteSection}`]: {
    display: 'flex',
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
}));

export interface SnippetsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
  /**
   * *Callback on snippet click
   * @param msg
   */
  onSnippetClick?: (msg) => void;
  /**
   * Clicked thread id
   * @default null
   */
  threadId?: number;
  /**
   * Callback to get new snippet headline on message sent
   * @param headline
   */
  getSnippetHeadline?: (headline) => void;
  /**
   * If component needs to reload
   * @default false
   */
  shouldUpdate?: boolean;
  /**
   * Props spread to delete icon
   */
  deleteIconProps?: {
    show: boolean;
    action?: () => void;
    name?: string;
  };
  /**
   * Prop to highlight selected snippet
   * @default null
   */
  selected?: any;
}
/**
 *
 > API documentation for the Community-JS Snippets component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Snippets} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCSnippets` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippets-root|Styles applied to the root element.|
 |selected|.SCSnippets-selected|Styles applied to the selected element.|
 |deleteSection|.SCSnippets-delete-section|Styles applied to  delete thread section.|

 * @param inProps
 */
export default function Snippets(inProps: SnippetsProps): JSX.Element {
  // PROPS
  const props: SnippetsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide = false, className = null, onSnippetClick, threadId, getSnippetHeadline, shouldUpdate, deleteIconProps, selected, ...rest} = props;

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const isNumber = typeof selected === 'number';

  // REFS
  const refreshSubscription = useRef(null);

  /**
   * Fetches Snippets
   */
  function fetchSnippets() {
    http
      .request({
        url: Endpoints.GetSnippets.url(),
        method: Endpoints.GetSnippets.method
      })
      .then((res: HttpResponse<any>) => {
        const data = res.data;
        setSnippets(data.results);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Updates snippet headline and status
   * @param id
   * @param headline
   * @param status
   */
  function updateSnippets(id, headline, status) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.id === id);
    if (index !== -1) {
      newSnippets[index].headline = headline;
      newSnippets[index].thread_status = status;
      setSnippets(newSnippets);
    }
  }

  /**
   * Updates snippet status
   * @param id
   * @param status
   */
  function updateStatus(id, status) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.id === id);
    if (index !== -1) {
      newSnippets[index].thread_status = status;
      setSnippets(newSnippets);
    }
  }

  /**
   * On mount, fetches snippets
   */
  useEffect(() => {
    fetchSnippets();
  }, [shouldUpdate]);

  /**
   * When a ws notification arrives, updates data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.PRIVATE_MESSAGE}`,
      subscriber
    );
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, [snippets]);

  /**
   * When the logged in user sends a message, snippet headline is updated
   */
  useEffect(() => {
    if (threadId) {
      updateSnippets(threadId, getSnippetHeadline, null);
    }
  }, [getSnippetHeadline]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    updateSnippets(res.thread_id, res.notification_obj.snippet.headline, res.notification_obj.snippet.thread_status);
  };

  /**
   * Handles thread opening
   */
  function handleOpenThread(msg) {
    onSnippetClick(msg);
    updateStatus(msg.id, null);
  }

  /**
   * Renders snippets skeleton when loading
   */
  if (loading) {
    return <SnippetsSkeleton elevation={0} />;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide && total) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        <List>
          {snippets.map((message: SCPrivateMessageType, index) => (
            <div key={index}>
              <Message
                elevation={0}
                message={message}
                key={message.id}
                onClick={() => handleOpenThread(message)}
                className={
                  message.id === threadId || (!isNumber && selected ? message.receiver.id === selected.receiver.id : message.receiver.id === selected)
                    ? classes.selected
                    : ''
                }
              />
              {index < total - 1 && !isMobile ? <Divider /> : null}
            </div>
          ))}
        </List>
        {total && deleteIconProps && deleteIconProps.show && (
          <Box className={classes.deleteSection}>
            <Icon onClick={deleteIconProps.action}>{deleteIconProps.name}</Icon>
          </Box>
        )}
      </Root>
    );
  }
  return null;
}
