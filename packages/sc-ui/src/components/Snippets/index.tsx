import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import Snippet from '../Message';
import {AxiosResponse} from 'axios';
import {SCPrivateMessageType} from '@selfcommunity/core/src/types';
import {FormattedMessage} from 'react-intl';
import SnippetsSkeleton from '../Skeleton/SnippetsSkeleton';

const PREFIX = 'SCSnippets';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface SnippetSuggestionProps {
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
   * Function fired when message obj is clicked.
   */
  onClick?: () => void;
}
export default function SnippetsSuggestion(props: SnippetSuggestionProps): JSX.Element {
  //PROPS
  const {autoHide = false, className = null, ...rest} = props;

  // STATE
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnippet, setOpenSnippet] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  /**
   * Fetches Snippets
   */
  function fetchSnippets() {
    http
      .request({
        url: Endpoints.GetSnippets.url(),
        method: Endpoints.GetSnippets.method
      })
      .then((res: AxiosResponse<any>) => {
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
   * On mount, fetches snippets
   */
  useEffect(() => {
    fetchSnippets();
  }, []);

  /**
   * Renders snippets list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <SnippetsSkeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              {snippets.map((message: SCPrivateMessageType, index) => (
                <div key={index}>
                  <Snippet elevation={0} message={message} key={message.id} onClick={() => setOpenSnippet(true)} />
                  {index < total - 1 ? <Divider /> : null}
                </div>
              ))}
            </React.Fragment>
          )}
          {openSnippet && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={className}>
        {c}
      </Root>
    );
  }
  return null;
}
