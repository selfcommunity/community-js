import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import {styled} from '@mui/material/styles';
import {Icon, IconButton, IconButtonProps} from '@mui/material';
import {
  Link,
  SCContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import Composer, {ComposerProps} from '../Composer';
import {SnackbarKey, useSnackbar} from 'notistack';
import {getRouteData} from '../../utils/contribution';

const PREFIX = 'SCComposerIconButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface ComposerIconButtonProps extends IconButtonProps {
  /**
   * Composer Props
   * @default null
   */
  ComposerProps?: ComposerProps;
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
export default React.forwardRef(function ComposerIconButton(inProps: ComposerIconButtonProps, ref: React.Ref<HTMLButtonElement>): ReactElement {
  // PROPS
  const props: ComposerIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, ComposerProps = {}, onClick, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleClick = useCallback(
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
      onClick && onClick(event);
    },
    [onClick, enqueueSnackbar, scContext.settings, scUserContext.user]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSuccess = useMemo(
    () => (feedObject) => {
      setOpen(false);
      enqueueSnackbar(<FormattedMessage id="ui.composerIconButton.composer.success" defaultMessage="ui.composerIconButton.composer.success" />, {
        action: (snackbarId: SnackbarKey) => (
          <Link to={scRoutingContext.url(SCRoutes[`${feedObject.type.toUpperCase()}_ROUTE_NAME`], getRouteData(feedObject))}>
            <FormattedMessage id="ui.composerIconButton.composer.viewContribute" defaultMessage="ui.composerIconButton.composer.viewContribute" />
          </Link>
        ),
        variant: 'success',
        autoHideDuration: 7000
      });
    },
    []
  );

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleClick} ref={ref}>
        <Icon>add_circle_outline</Icon>
      </Root>
      <Composer open={open} fullWidth onClose={handleClose} onSuccess={handleSuccess} {...ComposerProps} />
    </>
  );
});
