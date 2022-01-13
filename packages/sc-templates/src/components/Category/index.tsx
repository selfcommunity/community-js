import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {CategoryHeader} from '@selfcommunity/ui';
import CategoryFeed from '../CategoryFeed';

const PREFIX = 'SCCategoryTemplate';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface CategoryProps {
  /**
   * Id of the feed object
   * @default 'feed'
   */
  id?: string;

  /**
   * Override or extend the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the category for filter the feed
   * @default null
   */
  categoryId?: number;
}

export default function Category(props: CategoryProps): JSX.Element {
  // PROPS
  const {id = 'category', className, categoryId} = props;

  return (
    <Root id={id} className={className}>
      <CategoryHeader categoryId={categoryId} />
      <CategoryFeed categoryId={categoryId} />
    </Root>
  );
}
