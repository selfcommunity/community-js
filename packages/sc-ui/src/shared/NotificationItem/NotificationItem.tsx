import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, TypographyProps} from '@mui/material';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../../components/Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {SCNotificationObjectTemplateType} from '@selfcommunity/ui';
import NewChip from '../NewChip/NewChip';
import {grey, red} from '@mui/material/colors';

const PREFIX = 'SCNotificationItem';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  dense: `${PREFIX}-dense`,
  header: `${PREFIX}-header`,
  image: `${PREFIX}-image`,
  snippetImage: `${PREFIX}-snippet-image`,
  title: `${PREFIX}-title`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  actions: `${PREFIX}-actions`,
  footer: `${PREFIX}-footer`,
  snippet: `${PREFIX}-snippet`,
  newSnippet: `${PREFIX}-new-snippet`,
  newChip: `${PREFIX}-new-chip`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.root}`]: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(),
    boxSizing: 'border-box',
    '&.MuiPaper-elevation': {
      padding: `${theme.spacing()} ${theme.spacing(2)}`
    },
    '&.MuiPaper-elevation0': {
      borderRadius: 0,
      [`& .${classes.actions}`]: {
        right: 0
      }
    }
  },
  [`&.${classes.dense}`]: {
    '& .SCNotificationItem-header': {
      alignItems: 'center'
    },
    marginTop: 0,
    padding: `0px ${theme.spacing()} !important`
  },
  [`&.${classes.snippet}`]: {
    '&:before': {
      borderRadius: '5px',
      width: '4px',
      left: 1,
      height: '100%',
      display: 'block',
      zIndex: '20',
      position: 'absolute',
      content: '" "',
      backgroundColor: `${grey[200]}`
    },
    '& .SCNotificationItem-content': {
      padding: `5px ${theme.spacing()}`
    }
  },
  [`&.${classes.newSnippet}`]: {
    '&:before': {
      backgroundColor: `${red[200]}`
    }
  },
  [`& .${classes.content}`]: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  [`& .${classes.header}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    flex: 1
  },
  [`& .${classes.image}`]: {
    flexShrink: 0,
    marginRight: theme.spacing(1)
  },
  [`& .${classes.snippetImage}`]: {
    paddingLeft: `${theme.spacing()}`,
    '& .MuiAvatar-root': {
      width: 25,
      height: 25
    }
  },
  [`& .${classes.title}`]: {
    flex: '1 1 auto',
    textAlign: 'left',
    width: '100%'
  },
  [`& .${classes.primary}`]: {
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden'
  },
  [`& .${classes.secondary}`]: {
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden',
    color: theme.palette.text.secondary
  },
  [`& .${classes.actions}`]: {
    '> div': {
      justifyContent: 'flex-end'
    },
    flex: 1
  },
  [`& .${classes.footer}`]: {
    width: '100%',
    '> div': {
      paddingTop: 8
    },
    paddingRight: 8
  }
}));

export interface NotificationItemProps extends Pick<WidgetProps, Exclude<keyof WidgetProps, 'id'>> {
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
 * > API documentation for the Community-UI BaseItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NotificationItem} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `NotificationItem` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBaseItem-root|Styles applied to the root element.|
 |newSnippet|.SCBaseItem-new-snippet|Styles applied to the root element when notification is marked as new.|
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

  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isDetailTemplate = template === SCNotificationObjectTemplateType.DETAIL;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  // RENDER
  return (
    <Root
      id={id}
      {...rest}
      className={classNames(classes.root, className, {
        [classes.dense]: isSnippetTemplate || isToastTemplate,
        [classes.snippet]: isSnippetTemplate,
        [classes.newSnippet]: isSnippetTemplate && isNew
      })}
      elevation={elevation}>
      <Box className={classes.content}>
        <Box className={classes.header}>
          {image && <Box className={classNames(classes.image, {[classes.snippetImage]: isSnippetTemplate})}>{image}</Box>}
          <Box className={classes.title}>
            {primary && (
              <Box className={classes.primary}>
                {isDetailTemplate && isNew && <NewChip className={classes.newChip} />}
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
      </Box>
      {footer && <Box className={classes.footer}>{footer}</Box>}
    </Root>
  );
}
