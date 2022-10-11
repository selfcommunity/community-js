import React from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import ConsentSolution, {ConsentSolutionProps} from '../ConsentSolution';
import {Button} from '@mui/material';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCConsentSolutionButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ConsentSolutionButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

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

  // STATE
  const [open, setOpen] = React.useState(false);

  /**
   * Handle click on button
   */
  const handleClick = () => {
    setOpen((p) => !p);
  };

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Button size="small" variant="outlined" onClick={handleClick} {...rest}>
        <FormattedMessage id="ui.consentSolutionButton.viewStateButton" defaultMessage="ui.consentSolutionButton.viewStateButton" />
      </Button>
      {open && <ConsentSolution {...ConsentSolutionProps} open onClose={handleClick} />}
    </React.Fragment>
  );
}
