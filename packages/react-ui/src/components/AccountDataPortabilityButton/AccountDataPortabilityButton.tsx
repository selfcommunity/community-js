import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Button, ButtonProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import BaseDialog from '../../shared/BaseDialog';
import AccountDataPortability from '../AccountDataPortability';

const PREFIX = 'SCAccountDataPortabilityButtonn';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root, styles.voted]
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface AccountDataPortabilityButtonProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'onClick' | 'disabled'>> {
  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Account Data Portability Button component. Learn about the available props and the CSS API.
 *
 *
 * This component display a button that open a Dialog that display the [AccountDataPortability](/docs/sdk/community-js/react-ui/Components/AccountDataPortability) component.

 #### Import

 ```jsx
 import {AccountDataPortabilityButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountDataPortabilityButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountDataPortabilityButtonn-root|Styles applied to the root element.|
 |dialogRoot|.SCAccountDataPortabilityButtonn-dialog-root|Styles applied to the dialog root element.|
 * @param inProps
 */
export default function AccountDataPortabilityButton(inProps: AccountDataPortabilityButtonProps): JSX.Element {
  // PROPS
  const props: AccountDataPortabilityButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HANDLERS
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // RENDER
  if (!scUserContext.user) {
    return null;
  }
  return (
    <>
      <Root onClick={handleOpen} className={classNames(classes.root, className)} {...rest}>
        <FormattedMessage id="ui.accountDataPortabilityButton.buttonLabel" defaultMessage="ui.accountDataPortabilityButton.buttonLabel" />
      </Root>
      {open && (
        <DialogRoot
          title={
            <FormattedMessage
              id="ui.accountDataPortabilityButton.dialogTitle"
              defaultMessage="ui.accountDataPortabilityButton.dialogTitle"
              values={{username: scUserContext.user.username}}
            />
          }
          onClose={handleClose}
          open={open}
          DialogContentProps={{}}>
          <AccountDataPortability />
        </DialogRoot>
      )}
    </>
  );
}
