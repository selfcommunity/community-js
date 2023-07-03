import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Paper, Typography} from '@mui/material';
import CategoryFollowButton, {CategoryFollowButtonProps} from '../CategoryFollowButton';
import {FormattedMessage} from 'react-intl';
import {useSCFetchCategory} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import CategoryFollowersButton, {CategoryFollowersButtonProps} from '../CategoryFollowersButton';

const PREFIX = 'SCCategoryHeader';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  name: `${PREFIX}-name`,
  slogan: `${PREFIX}-slogan`,
  info: `${PREFIX}-info`,
  followedCounter: `${PREFIX}-followed-counter`,
  followed: `${PREFIX}-followed`,
  action: `${PREFIX}-action`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CategoryHeaderProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;
  /**
   * Id of category object
   * @default null
   */
  categoryId?: number;

  /**
   * Props to spread category button followed
   * @default {}
   */
  CategoryFollowButtonProps?: Pick<CategoryFollowButtonProps, Exclude<keyof CategoryFollowButtonProps, 'category' | 'onFollow'>>;

  /**
   * Props to spread to followedBy dialog
   * @default {}
   */
  CategoryFollowersButtonProps?: Pick<CategoryFollowersButtonProps, Exclude<keyof CategoryFollowersButtonProps, 'category' | 'categoryId'>>;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Category AppBar component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the top section for category pages.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CategoryHeader)
 *
 #### Import
 ```jsx
 import {CategoryHeader} from '@selfcommunity/react-ui';
 ```
 #### Component Name

 The name `SCCategoryHeader` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryHeader-root|Styles applied to the root element.|
 |cover|.SCCategoryHeader-cover|Styles applied to the cover element.|
 |name|.SCCategoryHeader-name|Styles applied to the name element.|
 |slogan|.SCCategoryHeader-slogan|Styles applied to the slogan element.|
 |info|.SCCategoryHeader-info|Styles applied to the info element.|
 |followedCounter|.SCCategoryHeader-followed-by-counter|Styles applied to the followers counter element.|
 |followed|.SCCategoryHeader-followed|Styles applied to the followers avatars section.|
 |action|.SCCategoryHeader-action|Styles applied to the action section.|

 * @param inProps
 */
export default function CategoryHeader(inProps: CategoryHeaderProps): JSX.Element {
  // PROPS
  const props: CategoryHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, categoryId, category, CategoryFollowButtonProps = {}, CategoryFollowersButtonProps = {}, ...rest} = props;

  // STATE
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});

  /**
   * Handles callback follow/unfollow category
   */
  const handleFollow = (category, follow) => {
    setSCCategory({...category, followers_counter: category.followers_counter + (follow ? 1 : -1)});
  };

  // RENDER
  const _backgroundCover = useMemo(
    () => ({
      ...(scCategory ? {background: `url('${scCategory.emotional_image_original}') center / cover`} : {})
    }),
    [scCategory]
  );

  if (!scCategory) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}} />
      <Box className={classes.info}>
        <Typography variant="h3" className={classes.name} gutterBottom>
          {scCategory.name}
        </Typography>
        {scCategory.slogan && (
          <Typography variant="h5" className={classes.slogan}>
            {scCategory.slogan}
          </Typography>
        )}
        <Box className={classes.followed}>
          <Typography className={classes.followedCounter} component="div">
            <FormattedMessage
              id="ui.categoryHeader.followedBy"
              defaultMessage="ui.categoryHeader.followedBy"
              values={{total: scCategory.followers_counter}}
            />
          </Typography>
          <CategoryFollowersButton category={scCategory} categoryId={scCategory?.id} {...CategoryFollowersButtonProps} />
        </Box>
        <Box className={classes.action}>
          <CategoryFollowButton category={scCategory} onFollow={handleFollow} {...CategoryFollowButtonProps} />
        </Box>
      </Box>
    </Root>
  );
}
