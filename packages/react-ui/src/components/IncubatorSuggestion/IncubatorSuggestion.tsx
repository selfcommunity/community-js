import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography, ListItem} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCUserContextType, useIsComponentMountedRef, useSCUser} from '@selfcommunity/react-core';
import {SCIncubatorType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Incubator, {IncubatorProps} from '../Incubator';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import IncubatorDetail from '../IncubatorDetail';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCIncubatorSuggestion';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  incubatorItem: `${PREFIX}-incubator-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  '& .MuiListItem-root': {
    display: 'block',
    padding: 0
  },
  ' & .MuiCardContent-root': {
    padding: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  }
}));

export interface IncubatorSuggestionProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to single incubator object
   * @default {}
   */
  IncubatorProps?: IncubatorProps;

  /**
   * Other props
   */
  [p: string]: any;
}
/**
 > API documentation for the Community-JS Incubator Suggestion component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {IncubatorSuggestion} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCIncubatorSuggestion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorSuggestion-root|Styles applied to the root element.|
 |title|.SCIncubatorSuggestion-title|Styles applied to the title element.|
 |incubatorItem|.SCIncubatorSuggestion-incubator-item|Styles applied to the incubator item element.|
 |noResults|.SCIncubatorSuggestion-no-results|Styles applied to the no results section.|
 |showMore|.SCIncubatorSuggestion-show-more|Styles applied to the show more button element.|


 * @param inProps
 */
export default function IncubatorSuggestion(inProps: IncubatorSuggestionProps): JSX.Element {
  // CONST
  const limit = 2;

  // PROPS
  const props: IncubatorSuggestionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = true, className, IncubatorProps = {}, ...rest} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // STATE
  const [incubators, setIncubators] = useState<any[]>([]);
  const [visibleIncubators, setVisibleIncubators] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openIncubatorsDialog, setOpenIncubatorsDialog] = useState<boolean>(false);
  const [openIncubatorDetailDialog, setOpenIncubatorDetailDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.GetIncubatorSuggestion.url()}?limit=10`);
  const [detailObj, setDetailObj] = useState(null);

  // HANDLERS

  function handleIncubatorDetailDialogOpening(incubator) {
    setOpenIncubatorDetailDialog(true);
    setOpenIncubatorsDialog(false);
    setDetailObj(incubator);
  }

  const handleIncubatorDetailDialogClose = () => {
    setOpenIncubatorDetailDialog(false);
  };

  /**
   * Fetches incubator suggestion list
   */
  function fetchIncubatorSuggestion() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.GetIncubatorSuggestion.method
        })
        .then((res: HttpResponse<any>) => {
          if (isMountedRef.current) {
            const data = res.data;
            setIncubators([...incubators, ...data]);
            setHasMore(data.length > visibleIncubators);
            setNext(data['next']);
            setLoading(false);
            setTotal(data.length);
          }
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * On mount, if user is authenticated, fetches suggested incubators list
   */
  useEffect(() => {
    if (scUserContext.user) {
      fetchIncubatorSuggestion();
    }
  }, [authUserId]);

  /**
   * Handles subscriptions counter update on subscribe/unsubscribe action.
   * @param incubator
   */
  function handleSubscriptionsUpdate(incubator) {
    const newIncubators = [...incubators];
    const index = newIncubators.findIndex((i) => i.id === incubator.id);
    if (index !== -1) {
      if (incubator.subscribed) {
        newIncubators[index].subscribers_count = incubator.subscribers_count - 1;
        newIncubators[index].subscribed = !incubator.subscribed;
      } else {
        newIncubators[index].subscribers_count = incubator.subscribers_count + 1;
        newIncubators[index].subscribed = !incubator.subscribed;
      }
      setIncubators(newIncubators);
    }
  }

  /**
   * Renders suggested incubators list
   */
  if (loading) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant={'h5'}>
        <FormattedMessage id="ui.IncubatorSuggestion.title" defaultMessage="ui.IncubatorSuggestion.title" />
      </Typography>
      {!total ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.IncubatorSuggestion.noResults" defaultMessage="ui.IncubatorSuggestion.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {incubators.slice(0, visibleIncubators).map((incubator: SCIncubatorType) => (
              <ListItem key={incubator.id}>
                <Incubator
                  elevation={0}
                  incubator={incubator}
                  className={classes.incubatorItem}
                  subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                  ButtonProps={{onClick: () => handleIncubatorDetailDialogOpening(incubator)}}
                  {...IncubatorProps}
                />
              </ListItem>
            ))}
          </List>
          {hasMore && (
            <Button className={classes.showMore} size="small" onClick={() => setOpenIncubatorsDialog(true)}>
              <FormattedMessage id="ui.IncubatorSuggestion.ShowAll" defaultMessage="ui.IncubatorSuggestion.ShowAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openIncubatorsDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.IncubatorSuggestion.title" defaultMessage="ui.IncubatorSuggestion.title" />}
          onClose={() => setOpenIncubatorsDialog(false)}
          open={openIncubatorsDialog}>
          {loading ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={incubators.length}
              next={fetchIncubatorSuggestion}
              hasMoreNext={Boolean(next)}
              loaderNext={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.IncubatorSuggestion.noMoreIncubators" defaultMessage="ui.IncubatorSuggestion.noMoreIncubators" />
                  </b>
                </p>
              }>
              <List>
                {incubators.map((i) => (
                  <ListItem key={i.id} sx={{display: 'block', padding: 0}}>
                    <Incubator
                      elevation={0}
                      incubator={i}
                      className={classes.incubatorItem}
                      subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                      ButtonProps={{onClick: () => handleIncubatorDetailDialogOpening(i)}}
                      {...IncubatorProps}
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
      {openIncubatorDetailDialog && (
        <IncubatorDetail
          open={openIncubatorDetailDialog}
          onClose={handleIncubatorDetailDialogClose}
          incubator={detailObj}
          onSubscriptionsUpdate={handleSubscriptionsUpdate}
        />
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return <HiddenPlaceholder />;
  }
  if (scUserContext.user) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {c}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
