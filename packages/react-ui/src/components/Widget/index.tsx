import React, {ComponentRef, forwardRef, ForwardRefRenderFunction} from 'react';
import {styled} from '@mui/material/styles';
import {Card, CardProps} from '@mui/material';
import classNames from 'classnames';

const PREFIX = 'SCWidget';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

/**
 * > API documentation for the Community-JS Widget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Widget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCWidget-root|Styles applied to the root element.|
 *
 */

export interface WidgetProps extends CardProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Other props
   */
  [p: string]: any;
}

const Widget: ForwardRefRenderFunction<ComponentRef<'div'>, WidgetProps> = (props, ref) => {
  const {className, onHeightChange, onStateChange, ...rest} = props;
  return <Root className={classNames(classes.root, className)} {...rest} ref={ref} />;
};

export default forwardRef(Widget);
