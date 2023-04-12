import React, {useCallback, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Icon, IconButton, IconButtonProps} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {SCContextType, SCUserContextType, UserUtils, useSCContext, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import Composer, {ComposerProps} from '../Composer';
import {useSnackbar} from 'notistack';

const PREFIX = 'SCComposerIconButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ComposerIconButtonProps extends IconButtonProps {
  /**
   * Composer Props
   * @default null
   */
  ComposerProps?: ComposerProps;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  items?: any;
}

/**
 * > API documentation for the Community-JS Composer Icon Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ComposerIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SComposerIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SComposerIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ComposerIconButton(inProps: ComposerIconButtonProps): JSX.Element {
  // PROPS
  const props: ComposerIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, ComposerProps = {}, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (scUserContext.user) {
        if (UserUtils.isBlocked(scUserContext.user)) {
          enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
            variant: 'warning',
            autoHideDuration: 3000
          });
        } else {
          setOpen(true);
        }
      } else {
        scContext.settings.handleAnonymousAction();
      }
    },
    [enqueueSnackbar, scContext.settings, scUserContext.user]
  );
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>add_circle_outline</Icon>
      </Root>
      <Composer {...ComposerProps} open={open} maxWidth="sm" fullWidth scroll="body" onClose={handleClose} onSuccess={handleClose} />
    </>
  );
}
