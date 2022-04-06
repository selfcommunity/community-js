import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography, Box, IconButton} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger, SCIncubatorType} from '@selfcommunity/core';
import Skeleton from './Skeleton';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Incubator from '../Incubator';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import useThemeProps from '@mui/material/styles/useThemeProps';
import Widget from '../Widget';

const PREFIX = 'SCIncubatorsList';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  actions: `${PREFIX}-actions`,
  helpPopover: `${PREFIX}-help-popover`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.header}`]: {
    display: 'flex',
    alignItems: 'center'
  },
  [`& .${classes.actions}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

export interface IncubatorsListProps {
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
}
/**
 > API documentation for the Community-UI Categories Popular component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {IncubatorsList} from '@selfcommunity/ui';
 ```

 #### Component Name
 The name `SCIncubatorsList` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorsList-root|Styles applied to the root element.|
 |header|.SCIncubatorsList-header|Styles applied to the header element.|
 |title|.SCIncubatorsList-title|Styles applied to the title element.|
 |noResults|.SCIncubatorsList-no-results|Styles applied to the no results section.|
 |actions|.SCIncubatorsList-actions|Styles applied to the actions section.|
 |helpPopover|.SCIncubatorsList-help-popover|Styles applied to the help popover element.|

 * @param inProps
 */
export default function IncubatorsList(inProps: IncubatorsListProps): JSX.Element {
  // CONST
  const limit = 2;

  // PROPS
  const props: IncubatorsListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = true, className, ...rest} = props;

  // STATE
  const [incubators, setIncubators] = useState<any[]>([]);
  const [visibleIncubators, setVisibleIncubators] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openIncubatorsDialog, setOpenIncubatorsDialog] = useState<boolean>(false);
  const [openCreateIncubatorDialog, setOpenCreateIncubatorDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.GetAllIncubators.url()}?limit=10`);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);

  // HANDLERS

  const handleClickHelpButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  /**
   * Fetches incubators list
   */
  const fetchIncubators = useMemo(
    () => () => {
      if (next) {
        http
          .request({
            url: next,
            method: Endpoints.GetAllIncubators.method
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status < 300) {
              const data = res.data;
              setIncubators([...incubators, ...data['results']]);
              setHasMore(data['count'] > visibleIncubators);
              setNext(data['next']);
              setLoading(false);
              setTotal(data['count']);
            }
          })
          .catch((error) => {
            setLoading(false);
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [incubators, next, loading]
  );

  /**
   * On mount, fetches popular incubators list
   */
  useEffect(() => {
    fetchIncubators();
  }, []);

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
   * Renders popular incubators list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
      ) : (
        <CardContent>
          <Box className={classes.header}>
            <Typography className={classes.title} variant={'h5'}>
              <FormattedMessage id="ui.incubatorsList.title" defaultMessage="ui.incubatorsList.title" />
            </Typography>
            <IconButton className={classes.helpPopover} color="primary" aria-label="info" component="span" onClick={handleClickHelpButton}>
              <Icon fontSize="small">help_outline</Icon>
            </IconButton>
            {isOpen && (
              <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}>
                <Box sx={{p: '10px'}}>
                  <Typography component={'span'} sx={{whiteSpace: 'pre-line'}}>
                    <FormattedMessage id="ui.incubatorsList.popover" defaultMessage="ui.incubatorsList.popover" />
                  </Typography>
                </Box>
              </Popover>
            )}
          </Box>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.incubatorsList.noResults" defaultMessage="ui.incubatorsList.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {incubators.slice(0, visibleIncubators).map((incubator: SCIncubatorType, index) => (
                  <div key={index}>
                    <Incubator
                      elevation={0}
                      incubator={incubator}
                      key={incubator.id}
                      subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                    />
                  </div>
                ))}
              </List>
              <Box className={classes.actions}>
                {hasMore && (
                  <Button size="small" onClick={() => setOpenIncubatorsDialog(true)}>
                    <FormattedMessage id="ui.incubatorsList.ShowAll" defaultMessage="ui.incubatorsList.ShowAll" />
                  </Button>
                )}
                <Button size="small" onClick={() => setOpenCreateIncubatorDialog(true)}>
                  <FormattedMessage id="ui.incubatorsList.SuggestNewTopic" defaultMessage="ui.incubatorsList.SuggestNewTopic" />
                </Button>
              </Box>
            </React.Fragment>
          )}
          {openIncubatorsDialog && (
            <BaseDialog
              title={<FormattedMessage id="ui.incubatorsList.title" defaultMessage="ui.incubatorsList.title" />}
              onClose={() => setOpenIncubatorsDialog(false)}
              open={openIncubatorsDialog}>
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={incubators.length}
                  next={fetchIncubators}
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.incubatorsList.noMoreIncubators" defaultMessage="ui.incubatorsList.noMoreIncubators" />
                      </b>
                    </p>
                  }>
                  <List>
                    {incubators.map((i, index) => (
                      <Incubator elevation={0} incubator={i} key={i.id} sx={{m: 0}} subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}} />
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
          {openCreateIncubatorDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
