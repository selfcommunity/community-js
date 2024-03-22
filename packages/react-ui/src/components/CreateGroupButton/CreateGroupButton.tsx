import React, {useContext} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Button, Icon} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {ButtonProps} from '@mui/material/Button/Button';
import classNames from 'classnames';
import CreateGroup, {CreateGroupProps} from '../CreateGroup';

const PREFIX = 'SCCreateGroupButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CreateGroupButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  CreateGroupProps?: CreateGroupProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Group Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateGroupButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateGroupButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateGroupButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateGroupButton(inProps: CreateGroupButtonProps): JSX.Element {
  //PROPS
  const props: CreateGroupButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, CreateGroupProps = {}, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [open, setOpen] = React.useState(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handle click on button
   */
  const handleClick = () => {
    setOpen((p) => !p);
  };

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClick}
        size="small"
        variant="contained"
        startIcon={<Icon fontSize="small">add</Icon>}
        {...rest}>
        <FormattedMessage id="ui.createGroupButton" defaultMessage="ui.createGroupButton" />
      </Root>
      {open && <CreateGroup {...CreateGroupProps} open onClose={handleClick} />}
    </React.Fragment>
  );
}
