import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {PeopleSuggestionSkeleton} from '../PeopleSuggestion';
import {FormattedMessage} from 'react-intl';
import User, {UserProps} from '../User';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';

const PREFIX = 'SCTrendingPeople';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-noResults`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface TrendingPeopleProps {
  /**
   * Category id
   * @default null
   */
  categoryId?: number;

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
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI Trending People component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {TrendingPeople} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCTrendingPeople` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCTrendingPeople-root|Styles applied to the root element.|

 * @param props
 */
export default function TrendingPeople(props: TrendingPeopleProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {categoryId, autoHide, className, UserProps = {}, ...rest} = props;

  // STATE
  const [people, setPeople] = useState<any[]>([]);
  const [visiblePeople, setVisiblePeople] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPeopleDialog, setOpenTrendingPeopleDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [next, setNext] = useState<string>(`${Endpoints.CategoryTrendingPeople.url({id: categoryId})}?limit=10`);

  /**
   * Fetches trending people list
   */
  function fetchTrendingPeople() {
    setLoading(true);
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.CategoryTrendingPeople.method
        })
        .then((res: AxiosResponse<any>) => {
          const data = res.data;
          setPeople([...people, ...data.results]);
          setHasMore(data.count > visiblePeople);
          setNext(data['next']);
          setLoading(false);
          setTotal(data.count);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }

  /**
   * On mount, fetches trending people list
   */
  useEffect(() => {
    fetchTrendingPeople();
  }, []);

  /**
   * Renders trending people list
   */
  const p = (
    <React.Fragment>
      {loading ? (
        <PeopleSuggestionSkeleton />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="body1">
            <FormattedMessage id="ui.trendingPeople.title" defaultMessage="ui.trendingPeople.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.trendingPeople.noResults" defaultMessage="ui.trendingPeople.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {people.slice(0, visiblePeople).map((user, index) => (
                  <User elevation={0} user={user} id={user.id} key={index} {...UserProps} />
                ))}
              </List>
            </React.Fragment>
          )}
          {hasMore && (
            <Button size="small" onClick={() => setOpenTrendingPeopleDialog(true)}>
              <FormattedMessage id="ui.trendingPeople.button.showAll" defaultMessage="ui.trendingPeople.button.showAll" />
            </Button>
          )}
          {openTrendingPeopleDialog && (
            <BaseDialog
              title={<FormattedMessage defaultMessage="ui.trendingPeople.title" id="ui.trendingPeople.title" />}
              onClose={() => setOpenTrendingPeopleDialog(false)}
              open={openTrendingPeopleDialog}>
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={people.length}
                  next={fetchTrendingPeople}
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.trendingPeople.noOtherResults" defaultMessage="ui.trendingPeople.noOtherResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {people.map((p, index) => (
                      <User elevation={0} user={p} key={p.id} sx={{m: 0}} {...UserProps} />
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
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
      {p}
    </Root>
  );
}
