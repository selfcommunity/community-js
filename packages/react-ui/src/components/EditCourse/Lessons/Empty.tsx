import {Icon, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AddButton from './AddButton';
import {PREFIX} from '../constants';

const classes = {
  emptyWrapper: `${PREFIX}-empty-wrapper`,
  emptyBox: `${PREFIX}-empty-box`,
  emptyRotatedBox: `${PREFIX}-empty-rotated-box`,
  emptyIcon: `${PREFIX}-empty-icon`,
  emptyButton: `${PREFIX}-empty-button`
};

interface EmptyProps {
  handleAddSection: () => void;
}

export default function Empty(props: EmptyProps) {
  // PROPS
  const handleAddSection = props.handleAddSection;

  return (
    <Stack className={classes.emptyWrapper}>
      <Stack className={classes.emptyBox}>
        <Stack className={classes.emptyRotatedBox}>
          <Icon className={classes.emptyIcon} color="disabled" fontSize="large">
            courses
          </Icon>
        </Stack>
      </Stack>

      <Typography variant="body1">
        <FormattedMessage id="ui.editCourse.table.empty.title" defaultMessage="ui.editCourse.table.empty.title" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="ui.editCourse.table.empty.description" defaultMessage="ui.editCourse.table.empty.description" />
      </Typography>

      <AddButton
        className={classes.emptyButton}
        label="ui.editCourse.table.section"
        handleAddRow={handleAddSection}
        color="inherit"
        variant="outlined"
      />
    </Stack>
  );
}
