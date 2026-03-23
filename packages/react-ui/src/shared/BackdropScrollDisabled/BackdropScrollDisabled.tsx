import {Backdrop, BackdropProps, getContrastRatio, useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';

/**
 * Prevents scrolling of content behind the backdrop
 */
export default function BackdropScrollDisabled(props: BackdropProps): JSX.Element {
  const theme = useTheme<SCThemeType>();

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Backdrop
      {...props}
      onTouchMove={onTouchMove}
      style={{
        touchAction: 'none',
        backgroundColor: getContrastRatio(theme.palette.background.default, theme.palette.common.white) > 4.5 ? 'rgba(255, 255, 255, 0.5)' : undefined
      }}
    />
  );
}
