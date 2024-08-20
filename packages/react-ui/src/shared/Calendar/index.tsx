import { Box, Stack, styled, Typography } from '@mui/material';

const PREFIX = 'SCCalendar';

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})();

export interface CalendarProps {
  day: number;
}

export default function Calendar(props: CalendarProps) {
  const day = props.day;

  return (
    <Root
      gap="7px"
      position="absolute"
      bottom="-36px"
      left="24px"
      width="60px"
      height="60px"
      borderRadius="5px"
      boxShadow="0px 3px 8px #00000040"
      bgcolor="#fff"
      overflow="hidden">
      <Box width="100%" height="16px" bgcolor="#b20404" />
      <Typography variant="h2" textAlign="center">
        {day}
      </Typography>
    </Root>
  );
}
