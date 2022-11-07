import React from 'react';
import {styled} from '@mui/material/styles';
import {Feed, FeedObjectSkeleton, SCFeedObjectTemplateType, FeedObject, FeedObjectProps} from '@selfcommunity/react-ui';
import {useSCFetchCategory} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import FeedObjsListSkeleton from './Skeleton';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {EndpointType} from '@selfcommunity/api-services';

const PREFIX = 'SCFeedObjsListTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  '& .SCFeed-left .SCCategory-root': {
    marginBottom: theme.spacing(2)
  }
}));

export interface FeedObjsListProps {
  /**
   * Id of the component
   * @default 'feedObjs_list'
   */
  id?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The endpoint to fetch for data
   */
  endpoint: EndpointType;
  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;
  /**
   * Id of the category for filter the feed
   * @default null
   */
  categoryId?: number;
  /**
   * Props to show component header
   * @default null
   */
  header?: JSX.Element;
  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;
}

/**
 * > API documentation for the Community-JS Feed Objs List Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedObjsList} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCFeedObjsListTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObjsListTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function FeedObjsList(inProps: FeedObjsListProps): JSX.Element {
  // PROPS
  const props: FeedObjsListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'feedObjs_list', className, category, categoryId, header = null, endpoint, FeedObjectProps = {}} = props;
  // HOOKS
  const {scCategory} = useSCFetchCategory({id: categoryId, category});

  if (scCategory === null || !endpoint) {
    return <FeedObjsListSkeleton />;
  }

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      endpoint={endpoint}
      ItemComponent={FeedObject}
      itemPropsGenerator={(scUser, item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null,
        markRead: scUser ? !item.seen_by_id.includes(scUser.id) : null
      })}
      itemIdGenerator={(item) => item[item.type].id}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      HeaderComponent={header}
      FooterComponent={null}
      hideAdvs={true}
      endMessage={<FormattedMessage id="templates.feedObjsList.noMoreResults" defaultMessage="templates.feedObjsList.noMoreResults" />}
    />
  );
}
