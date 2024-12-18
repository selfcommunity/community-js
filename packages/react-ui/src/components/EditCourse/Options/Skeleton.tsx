import {Divider, FormControl, FormControlLabel, FormLabel, Skeleton, Stack, Switch} from '@mui/material';
import {PREFIX} from '../constants';

const classes = {
  optionsWrapper: `${PREFIX}-options-wrapper`,
  optionsDivider: `${PREFIX}-options-divider`,
  optionsButtonWrapper: `${PREFIX}-options-button-wrapper`
};

export default function OptionsSkeleton() {
  return (
    <>
      <Stack className={classes.optionsWrapper}>
        {Array.from(Array(3)).map((_, i) => (
          <FormControl key={i} component="fieldset" variant="standard">
            <FormLabel component="legend">
              <Skeleton animation="wave" variant="text" width="52px" height="21px" />
            </FormLabel>
            <FormControlLabel control={<Switch />} label={<Skeleton animation="wave" variant="text" width="595px" height="38px" />} />
          </FormControl>
        ))}
      </Stack>

      <Divider className={classes.optionsDivider} />

      <Stack className={classes.optionsButtonWrapper}>
        <Skeleton animation="wave" variant="rounded" width="133px" height="33px" />
      </Stack>
    </>
  );
}
