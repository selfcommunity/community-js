import React, {useContext} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import ConsentSolution, {ConsentSolutionProps} from '../ConsentSolution';
import {Button} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {ButtonProps} from '@mui/material/Button/Button';

const PREFIX = 'SCConsentSolutionButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ConsentSolutionButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Props to spread to ConsentSolution component
   * @default empty object
   */
  ConsentSolutionProps?: ConsentSolutionProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS ConsentSolutionButton component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {ConsentSolutionButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCConsentSolutionButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCConsentSolution-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ConsentSolutionButton(inProps: ConsentSolutionButtonProps): JSX.Element {
  //PROPS
  const props: ConsentSolutionButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ConsentSolutionProps = {}, ...rest} = props;

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
      <Button onClick={handleClick} size="small" variant="outlined" {...rest}>
        <FormattedMessage id="ui.consentSolutionButton.viewStateButton" defaultMessage="ui.consentSolutionButton.viewStateButton" />
      </Button>
      {open && <ConsentSolution {...ConsentSolutionProps} open onClose={handleClick} />}
    </React.Fragment>
  );
}
