import Footer, {FooterProps} from '../Footer/Footer';
import {CardContent, styled, useThemeProps} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface FooterWidgetProps extends WidgetProps {
  /**
   * Props to spread to footer
   * @default undefined
   */
  footerProps?: FooterProps;
  /**
   * Other props
   */
  [p: string]: any;
}

export default function FooterWidget(inProps: FooterWidgetProps) {
  // PROPS
  const props: FooterWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // CONST
  const {footerProps, ...rest} = props;

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Footer {...footerProps} />
      </CardContent>
    </Root>
  );
}
