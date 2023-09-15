import React from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {AUTO_HIDE, AUTO_HIDE_TIMEOUT} from '../../constants/ScrollContainer';

const PREFIX = 'SCScrollContainer';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Scrollbars, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  position: 'relative',
  height: '100%',
  '&:hover': {
    '& div:last-child': {
      opacity: '1 !important'
    }
  }
}));

export interface ScrollContainerProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Children
   * @default ''
   */
  children: any;

  /**
   * Enable auto-hide mode (default: false)
   * When true tracks will hide automatically and are only visible while scrolling.
   * @default false
   */
  autoHide?: boolean;

  /**
   * Hide delay in ms. (default: 500)
   */
  autoHideTimeout?: number;

  /**
   * Other props
   * https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   */
  [p: string]: any;
}

export default function ScrollContainer(props: ScrollContainerProps): JSX.Element {
  // PROPS
  const {children, className = {}, autoHide = AUTO_HIDE, autoHideTimeout = AUTO_HIDE_TIMEOUT, ...rest} = props;

  /**
   * Example of custom styles for vertical thumb
   * Add to the root of this component:
   *  renderThumbVertical={renderThumbVertical}
   * and implement renderThumbVertical:
   *  function renderThumbVertical() {
   *    return <div style={{width: 20, backgroundColor: '#2e9696'}}></div>;
   *  }
   */
  return (
    <Root autoHideTimeout={autoHideTimeout} autoHide={autoHide} className={classNames(classes.root, className)} {...rest}>
      {children}
    </Root>
  );
}
