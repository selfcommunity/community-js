import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, ButtonBase, ButtonBaseProps, Typography, TypographyProps} from '@mui/material';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../../components/Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';

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
})(({theme}) => ({
  [`&.${classes.root}`]: {
    position: 'relative',
    width: '100%',
    '&.MuiPaper-elevation': {
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '&.MuiPaper-elevation0': {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        [`& .${classes.actions}`]: {
          right: 0
        }
      }
    }
  },
  [`& .${classes.content}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  [`& .${classes.image}`]: {
    flexShrink: 0,
    marginRight: theme.spacing(2)
  },
  [`& .${classes.text}`]: {
    textAlign: 'left',
    flex: '1 1 auto',
    minWidth: 0,
    marginTop: theme.spacing(),
    marginBottom: theme.spacing()
  },
  [`& .${classes.primary}`]: {},
  [`& .${classes.secondary}`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary
  },
  [`& .${classes.actions}`]: {
    position: 'absolute',
    right: theme.spacing(),
    top: '50%',
    transform: 'translateY(-50%)'
  }
}));

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
   * Props to spread to ButtonBase
   * @default {}
   */
  ButtonBaseProps?: ButtonBaseProps;
  /**
   * Image to insert into the item
   * @default null
   */
  image?: React.ReactNode;
  /**
   * The main content element
   */
  primary: React.ReactNode;
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
 * > API documentation for the Community-UI BaseItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {BaseItem} from '@selfcommunity/ui';
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
    ButtonBaseProps = {},
    image = null,
    primary,
    primaryTypographyProps = {component: 'span', variant: 'body1'},
    secondary = null,
    secondaryTypographyProps = {component: 'p', variant: 'body2'},
    actions = null,
    ...rest
  } = props;

  // RENDER
  return (
    <Root id={id} {...rest} className={classNames(classes.root, className)}>
      <ButtonBase className={classes.content} {...ButtonBaseProps}>
        {image && <Box className={classes.image}>{image}</Box>}
        <Box className={classes.text}>
          <Typography className={classes.primary} {...primaryTypographyProps}>
            {primary}
          </Typography>
          {secondary && (
            <Typography className={classes.secondary} {...secondaryTypographyProps}>
              {secondary}
            </Typography>
          )}
        </Box>
      </ButtonBase>
      {actions && <Box className={classes.actions}>{actions}</Box>}
    </Root>
  );
}
