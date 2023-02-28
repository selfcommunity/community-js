import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, Icon, IconButton, List, TextField} from '@mui/material';
import Widget from '../Widget';
import {SCPrivateMessageSnippetType, SCPrivateMessageThreadType} from '@selfcommunity/types';
import PrivateMessageSnippetsSkeleton from './Skeleton';
import PrivateMessageSnippetItem from '../PrivateMessageSnippetItem';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

const messages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.snippets.searchBar.placeholder',
    defaultMessage: 'ui.privateMessage.snippets.searchBar.placeholder'
  }
});
const PREFIX = 'SCPrivateMessageSnippets';

const classes = {
  root: `${PREFIX}-root`,
  searchBar: `${PREFIX}-search-bar`,
  icon: `${PREFIX}-icon`,
  input: `${PREFIX}-input`,
  clear: `${PREFIX}-clear`,
  newMessageButton: `${PREFIX}-new-message-button`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageSnippetsProps {
  /**
   * Snippets list
   * @default[]
   */
  snippets?: SCPrivateMessageSnippetType[];
  /**
   * Loading state
   *
   */
  loading?: boolean;
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
   *
   */
  snippetActions?: {
    onSnippetClick?: (msg) => void;
    onNewMessageClick?: () => void;
    onMenuItemClick?: (msg) => void;
  };
  /**
   * Any other properties
   */
  [p: string]: any;
  /**
   * Clicked thread object
   * @default null
   */
  threadObj?: SCPrivateMessageThreadType;
}
/**
 *
 > API documentation for the Community-JS PrivateMessageSnippets component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippets} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippets` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippets-root|Styles applied to the root element.|
 |icon|.SCPrivateMessageSnippets-icon|Styles applied to the search icon element.|
 |input|.SCPrivateMessageSnippets-input|Styles applied to the search input element.|
 |clear|.SCPrivateMessageSnippets-clear|Styles applied to the search bar clear icon element.|
 |searchBar|.SCPrivateMessageSnippets-searchBar|Styles applied to the search bar element.|
 |newMessageButton|.SCPrivateMessageSnippets-new-message-button|Styles applied to new message button element.|

 * @param inProps
 */
export default function PrivateMessageSnippets(inProps: PrivateMessageSnippetsProps): JSX.Element {
  // PROPS
  const props: PrivateMessageSnippetsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {snippets = [], loading, autoHide = false, className = null, threadObj = null, snippetActions, clearSearch, ...rest} = props;
  console.log(threadObj);

  // STATE
  const [search, setSearch] = useState<string>('');

  // INTL
  const intl = useIntl();

  // CONST
  const filteredSnippets = snippets.filter((el) => {
    if (search === '') {
      return el;
    }
    return el.receiver.username.toLowerCase().includes(search);
  });
  const isNumber = typeof threadObj === 'number';

  //HANDLERS
  const handleChange = (event) => {
    setSearch(event.target.value);
  };
  const handleClear = () => {
    setSearch('');
  };

  const handleOpenNewMessage = () => {
    snippetActions && snippetActions.onNewMessageClick();
    handleClear();
  };

  const handleDeleteConversation = (msg) => {
    snippetActions && snippetActions.onMenuItemClick(msg);
  };

  function handleOpenThread(msg) {
    snippetActions && snippetActions.onSnippetClick(msg);
    handleClear();
  }

  useEffect(() => {
    if (clearSearch) handleClear();
  }, [clearSearch]);

  //RENDERING

  /**
   * Renders snippets skeleton when loading
   */
  if (loading) {
    return <PrivateMessageSnippetsSkeleton elevation={0} />;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        <CardContent>
          <Button variant="outlined" size="medium" className={classes.newMessageButton} onClick={handleOpenNewMessage}>
            <FormattedMessage id="ui.privateMessage.snippets.button.newMessage" defaultMessage="ui.privateMessage.snippets.button.newMessage" />
          </Button>
          {snippets.length !== 0 && (
            <>
              <TextField
                className={classes.searchBar}
                margin="normal"
                fullWidth
                id={`${PREFIX}-search`}
                placeholder={`${intl.formatMessage(messages.placeholder)}`}
                size="small"
                onChange={handleChange}
                value={search}
                InputProps={{
                  className: classes.input,
                  startAdornment: <Icon className={classes.icon}>search</Icon>,
                  endAdornment: (
                    <IconButton className={classes.clear} disabled={!search} onClick={handleClear} size="small">
                      <Icon>close</Icon>
                    </IconButton>
                  )
                }}
              />
              <List>
                {filteredSnippets.map((message: SCPrivateMessageSnippetType) => (
                  <PrivateMessageSnippetItem
                    message={message}
                    key={message.id}
                    actions={{onItemClick: () => handleOpenThread(message), onMenuClick: () => handleDeleteConversation(message)}}
                    selected={
                      message.id === (isNumber ? threadObj : threadObj?.id) || message.receiver.id === (isNumber ? threadObj : threadObj?.receiver.id)
                    }
                  />
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
