import { Box, Stack, styled, Typography } from '@mui/material';

const PREFIX = 'SCCalendar';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`
};

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
    <Root className={classes.root}>
      <Box className={classes.header} />
      <Typography variant="h2" textAlign="center">
        {day}
      </Typography>
    </Root>
  );
}
