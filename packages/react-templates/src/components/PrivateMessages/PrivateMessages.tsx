import React from 'react';
import {styled} from '@mui/material/styles';
import {PrivateMessageComponent, PrivateMessageComponentProps} from '@selfcommunity/react-ui';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Box} from '@mui/material';

const PREFIX = 'SCPrivateMessagesTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessagesProps {
  /**
   * Private Message Component props
   * @default {}
   */
  PrivateMessageComponentProps?: PrivateMessageComponentProps;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}
/**
 *
 > API documentation for the Community-JS Private Messages template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessages} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCPrivateMessagesTemplate` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessagesTemplate-root|Styles applied to the root element.|

 * @param inProps
 */
export default function PrivateMessages(inProps: PrivateMessagesProps): JSX.Element {
  //PROPS
  const props: PrivateMessagesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, PrivateMessageComponentProps = {}} = props;

  return (
    <Root className={classNames(classes.root, className)}>
      <PrivateMessageComponent {...PrivateMessageComponentProps} />
    </Root>
  );
}
