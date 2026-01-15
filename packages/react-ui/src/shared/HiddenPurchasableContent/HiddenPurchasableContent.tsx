import React from 'react';
import {styled, Typography} from '@mui/material';
import Widget, {WidgetProps} from '../../components/Widget';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCHiddenPurchasableContent';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface HiddenPurchasableContentProps extends Pick<WidgetProps, Exclude<keyof WidgetProps, 'id'>> {
  /**
   * Id of user object
   * @default null
   */
  id?: string;

  /**
   * Title
   */
  title?: string;

  /**
   * Content
   */
  content?: React.ReactNode;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS HiddenPurchasableContent component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {HiddenPurchasableContent} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `HiddenPurchasableContent` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCHiddenPurchasableContent-root|Styles applied to the root element.|

 * @param inProps
 */
export default function HiddenPurchasableContent(inProps: HiddenPurchasableContentProps): JSX.Element {
  // PROPS
  const props: HiddenPurchasableContentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = null, className = null, title, content, elevation, ...rest} = props;

  // RENDER
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest} elevation={elevation}>
      <Typography variant="h3" gutterBottom>
        <b>{title || <FormattedMessage id="ui.shared.hiddenPurchasableContent.title" defaultMessage="ui.shared.hiddenPurchasableContent.title" />}</b>
      </Typography>
      {content || (
        <Typography variant="body1">
          <FormattedMessage id="ui.shared.hiddenPurchasableContent.content" defaultMessage="ui.shared.hiddenPurchasableContent.content" />{' '}
        </Typography>
      )}
    </Root>
  );
}
