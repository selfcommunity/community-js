import {Backdrop, BackdropProps} from '@mui/material';

/**
 * Prevents scrolling of content behind the backdrop
 */
export default function BackdropScrollDisabled(props: BackdropProps): JSX.Element {
  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return <Backdrop {...props} onTouchMove={onTouchMove} />;
}
