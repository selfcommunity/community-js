import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {PeopleSuggestionSkeleton} from '../Skeleton';
import {FormattedMessage} from 'react-intl';
import User, {UserProps} from '../User';

const PREFIX = 'SCTrendingPeople';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface TrendingPeople {
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
   * Override or extend the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;
}

export default function TrendingPeople(props: TrendingPeople): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {categoryId, autoHide, className, UserProps = {}} = props;

  // STATE
  const [people, setPeople] = useState<any[]>([]);
  const [visiblePeople, setVisiblePeople] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPeopleDialog, setOpenTrendingPeopleDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  /**
   * Fetches trending people list
   */
  function fetchTrendingPeople() {
    setLoading(true);
    http
      .request({
        url: Endpoints.CategoryTrendingPeople.url({id: categoryId}),
        method: Endpoints.CategoryTrendingPeople.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPeople(data.results);
        setHasMore(data.count > visiblePeople);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Loads more people on "see more" button click
   */
  function loadPeople() {
    const newIndex = visiblePeople + limit;
    const newHasMore = newIndex < people.length - 1;
    setVisiblePeople(newIndex);
    setHasMore(newHasMore);
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
          <Typography variant="body1">
            <FormattedMessage id="ui.TrendingPeople.title" defaultMessage="ui.TrendingPeople.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.TrendingPeople.noResults" defaultMessage="ui.TrendingPeople.noResults" />
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
            <Button size="small" onClick={() => loadPeople()}>
              <FormattedMessage id="ui.TrendingPeople.showAll" defaultMessage="ui.TrendingPeople.showAll" />
            </Button>
          )}
          {openTrendingPeopleDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return <Root className={className}>{p}</Root>;
  }
  return null;
}
