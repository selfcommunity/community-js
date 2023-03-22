import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, TypographyProps} from '@mui/material';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../../components/Widget';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCBaseItem';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  image: `${PREFIX}-image`,
  text: `${PREFIX}-text`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface BaseItemProps extends Pick<WidgetProps, Exclude<keyof WidgetProps, 'id'>> {
  /**
   * Id of user object
   * @default null
   */
  id?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Image to insert into the item
   * @default null
   */
  image?: React.ReactNode;
  /**
   * If true, the children won't be wrapped by a Typography component.
   * This can be useful to render an alternative Typography variant by wrapping the children (or primary) text, and optional secondary text with the Typography component.
   * @default false
   */
  disableTypography?: boolean;
  /**
   * The main content element
   */
  primary?: React.ReactNode;
  /**
   * Props to spread to Primary Typography
   * @default {component: 'span', variant: 'body1'}
   */
  primaryTypographyProps?: TypographyProps;
  /**
   * The secondary content element.
   */
  secondary?: React.ReactNode;
  /**
   * Props to spread to Secondary Typography
   * @default {component: 'p', variant: 'body2'}
   */
  secondaryTypographyProps?: TypographyProps;
  /**
   * The actions of the item
   */
  actions?: React.ReactNode;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS BaseItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {BaseItem} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `BaseItem` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBaseItem-root|Styles applied to the root element.|
 |content|.SCBaseItem-content|Styles applied to the content element.|
 |image|.SCBaseItem-image|Styles applied to image section.|
 |text|.SCBaseItem-text|Styles applied to text section.|
 |primary|.SCBaseItem-primary|Styles applied to primary section.|
 |secondary|.SCBaseItem-secondary|Styles applied to secondary section.|
 |actions|.SCBaseItem-actions|Styles applied to actions section.|

 * @param inProps
 */
export default function BaseItem(inProps: BaseItemProps): JSX.Element {
  // PROPS
  const props: BaseItemProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = null,
    className = null,
    image = null,
    disableTypography = false,
    primary = null,
    primaryTypographyProps = {component: 'span', variant: 'body1'},
    secondary = null,
    secondaryTypographyProps = {component: 'p', variant: 'body2'},
    actions = null,
    ...rest
  } = props;

  // RENDER
  return (
    <Root id={id} {...rest} className={classNames(classes.root, className)}>
      <Box className={classes.content}>
        {image && <Box className={classes.image}>{image}</Box>}
        <Box className={classes.text}>
          {primary &&
            (disableTypography ? (
              primary
            ) : (
              <Typography className={classes.primary} {...primaryTypographyProps}>
                {primary}
              </Typography>
            ))}
          {secondary &&
            (disableTypography ? (
              secondary
            ) : (
              <Typography className={classes.secondary} {...secondaryTypographyProps}>
                {secondary}
              </Typography>
            ))}
        </Box>
      </Box>
      {actions && <Box className={classes.actions}>{actions}</Box>}
    </Root>
  );
}
