import React from 'react';
import {styled} from '@mui/material/styles';
import {Menu, MenuItem, ListItemIcon, MenuProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCPrivateMessageActionMenu';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageActionMenuProps extends MenuProps {
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
 > API documentation for the Community-JS PrivateMessageActionMenu component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageActionMenu} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageActionMenu` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageActionMenu-root|Styles applied to the root element.|
 |paper|.SCPrivateMessageActionMenu-paper|Styles applied to the paper element.|
 |item|.SCPrivateMessageActionMenu-item|Styles applied to the menu item element.|

 * @param inProps
 */
export default function PrivateMessageActionMenu(inProps: PrivateMessageActionMenuProps): JSX.Element {
  // PROPS
  const props: PrivateMessageActionMenuProps = useThemeProps({
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
        <FormattedMessage id="ui.privateMessage.actionMenu.item.delete" defaultMessage="ui.privateMessage.actionMenu.item.delete" />
      </MenuItem>
    </Root>
  );
}
