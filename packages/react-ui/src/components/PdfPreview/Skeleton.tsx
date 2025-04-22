import * as React from 'react';
import {Box, CircularProgress, Skeleton} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {PdfMaxWidth} from './PdfPreview';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';

const PREFIX = 'PdfPreviewSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  circularProgress: `${PREFIX}-circular-progress`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: 400,
  [`& .${classes.circularProgress}`]: {
    position: 'absolute'
  }
}));

export interface InvoicePdfViewSkeletonProps {
  className?: string;
  maxWidth?: number;
}

export default function PdfPreviewSkeleton(inProps: InvoicePdfViewSkeletonProps): JSX.Element | null {
  // PROPS
  const props: InvoicePdfViewSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, maxWidth = PdfMaxWidth, ...rest} = props;
  return (
    <Root className={classNames(classes.root, className)} sx={{width: maxWidth}} {...rest}>
      {maxWidth < 1024 && <Skeleton variant="rounded" sx={{height: (maxWidth * 3.508) / 2.48, width: maxWidth}} />}
      <CircularProgress color="primary" className={classes.circularProgress} />
    </Root>
  );
}
