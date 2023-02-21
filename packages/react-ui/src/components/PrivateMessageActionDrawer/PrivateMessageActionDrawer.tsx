import React from 'react';
import {styled} from '@mui/material/styles';
import {SwipeableDrawer, MenuItem, ListItemIcon, SwipeableDrawerProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCPrivateMessageActionDrawer';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageActionDrawerProps extends SwipeableDrawerProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles menu item callbacks on click
   */
  onMenuItemDeleteClick?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS PrivateMessageActionDrawer component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageActionDrawer} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageActionDrawer` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageActionDrawer-root|Styles applied to the root element.|
 |paper|.SCPrivateMessageActionDrawer-paper|Styles applied to the paper element.|
 |item|.SCPrivateMessageActionDrawer-item|Styles applied to the menu item element.|

 * @param inProps
 */
export default function PrivateMessageActionDrawer(inProps: PrivateMessageActionDrawerProps): JSX.Element {
  // PROPS
  const props: PrivateMessageActionDrawerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {PaperProps = {className: classes.paper}, className, onMenuItemDeleteClick, ...rest} = props;

  return (
    <Root className={classNames(classes.root, className)} PaperProps={PaperProps} {...rest}>
      <MenuItem className={classes.item} onClick={onMenuItemDeleteClick}>
        <ListItemIcon>
          <Icon fontSize="small">delete</Icon>
        </ListItemIcon>
        <FormattedMessage id="ui.privateMessage.actionDrawer.item.delete" defaultMessage="ui.privateMessage.actionDrawer.item.delete" />
      </MenuItem>
    </Root>
  );
}
