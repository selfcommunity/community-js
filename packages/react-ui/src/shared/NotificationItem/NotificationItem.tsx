import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, TypographyProps} from '@mui/material';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../../components/Widget';
import {useThemeProps} from '@mui/system';
import NewChip from '../NewChip/NewChip';
import {SCNotificationObjectTemplateType} from '../../types/notification';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCNotificationItem';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  image: `${PREFIX}-image`,
  snippetImage: `${PREFIX}-snippet-image`,
  title: `${PREFIX}-title`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  actions: `${PREFIX}-actions`,
  footer: `${PREFIX}-footer`,
  snippet: `${PREFIX}-snippet`,
  new: `${PREFIX}-new`,
  newChip: `${PREFIX}-new-chip`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: {theme: SCThemeType}) => ({}));

export interface NotificationItemProps extends Pick<WidgetProps, Exclude<keyof WidgetProps, 'id'>> {
  /**
   * Id of user object
   * @default null
   */
  id?: string;
  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;
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
   * The footer of the item
   */
  footer?: React.ReactNode;
  /**
   * If notification is new
   */
  isNew?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS BaseItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NotificationItem} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `NotificationItem` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBaseItem-root|Styles applied to the root element.|
 |new|.SCBaseItem-new-snippet|Styles applied to the root element when notification is marked as new.|
 |content|.SCBaseItem-content|Styles applied to the content element.|
 |header|.SCBaseItem-header|Styles applied to the header element.|
 |image|.SCBaseItem-image|Styles applied to image section.|
 |snippetImage|.SCBaseItem-snippet-image|Styles applied to image section when a snippet notification is rendered.|
 |title|.SCBaseItem-text|Styles applied to title section.|
 |primary|.SCBaseItem-primary|Styles applied to primary section.|
 |secondary|.SCBaseItem-secondary|Styles applied to secondary section.|
 |actions|.SCBaseItem-actions|Styles applied to actions section.|
 |footer|.SCBaseItem-footer|Styles applied to footer section.|
 |newChip|.SCBaseItem-new-chip|Styles applied to the new chip element when notification is marked as new.|

 * @param inProps
 */
export default function NotificationItem(inProps: NotificationItemProps): JSX.Element {
  // PROPS
  const props: NotificationItemProps = useThemeProps({
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
    footer = null,
    template = SCNotificationObjectTemplateType.DETAIL,
    isNew = false,
    elevation = 0,
    ...rest
  } = props;

  // RENDER
  return (
    <Root
      id={id}
      {...rest}
      className={classNames(classes.root, className, `${PREFIX}-${template}`, {
        [classes.new]: isNew
      })}
      elevation={elevation}>
      <Box className={classes.header}>
        {image && <Box className={classNames(classes.image)}>{image}</Box>}
        <Box className={classes.title}>
          {primary && (
            <Box className={classes.primary}>
              {template === SCNotificationObjectTemplateType.DETAIL && isNew && <NewChip className={classes.newChip} />}
              {disableTypography ? primary : <Typography {...primaryTypographyProps}>{primary}</Typography>}
            </Box>
          )}
          {secondary && (
            <Box className={classes.secondary}>
              {disableTypography ? secondary : <Typography {...secondaryTypographyProps}>{secondary}</Typography>}
            </Box>
          )}
        </Box>
      </Box>
      {actions && <Box className={classes.actions}>{actions}</Box>}
      {footer && <Box className={classes.footer}>{footer}</Box>}
    </Root>
  );
}
