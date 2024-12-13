import {Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';

export default function Customize() {
  return (
    <>
      <Typography variant="h6">
        <FormattedMessage id="ui.editCourse.tab.customize" defaultMessage="ui.editCourse.tab.customize" />
      </Typography>
    </>
  );
}
