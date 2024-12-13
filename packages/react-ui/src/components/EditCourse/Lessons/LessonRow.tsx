import {DraggableProvided} from '@hello-pangea/dnd';
import {Icon, MenuItem, Stack, TableCell, TableRow, Typography} from '@mui/material';
import classNames from 'classnames';
import {PREFIX} from '../constants';
import {LessonRowInterface} from '../types';
import {useCallback, useState} from 'react';
import MenuRow from './MenuRow';
import {FormattedMessage} from 'react-intl';
import SelectRow from './SelectRow';
import FieldName from './FieldName';

const classes = {
  cellWidth: `${PREFIX}-cell-width`,
  cellAlignRight: `${PREFIX}-cell-align-right`,
  cellPadding: `${PREFIX}-cell-padding`,
  tableBodyIconWrapper: `${PREFIX}-table-body-icon-wrapper`,
  actionsWrapper: `${PREFIX}-actions-wrapper`
};

interface LessonRowProps {
  provider: DraggableProvided;
  lesson: LessonRowInterface;
  handleDeleteLesson: (id: number) => void;
  handleRenameLesson: (oldId: number, newName: string) => void;
}

export default function LessonRow(props: LessonRowProps) {
  // PROPS
  const {provider, lesson, handleDeleteLesson, handleRenameLesson} = props;

  // STATES
  const [editMode, setEditMode] = useState(false);

  // CALLBACKS
  const handleSetEditMode = useCallback(() => setEditMode(true), [setEditMode]);

  return (
    <TableRow {...provider.draggableProps} ref={provider.innerRef}>
      <TableCell width="4%" />
      <TableCell component="th" scope="row" {...provider.dragHandleProps} className={classNames(classes.cellWidth, classes.cellPadding)}>
        <Stack className={classes.tableBodyIconWrapper}>
          <Icon color="disabled">drag</Icon>
        </Stack>
      </TableCell>
      <TableCell>
        <FieldName row={lesson} handleRenameRow={handleRenameLesson} editMode={editMode} setEditMode={setEditMode} />
      </TableCell>
      <TableCell />
      <TableCell className={classes.cellAlignRight}>
        <Stack className={classes.actionsWrapper}>
          <SelectRow />

          <MenuRow>
            <MenuItem>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.table.menu.edit" defaultMessage="ui.editCourse.table.menu.edit" />
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.table.menu.view" defaultMessage="ui.editCourse.table.menu.view" />
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleSetEditMode}>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.table.menu.rename" defaultMessage="ui.editCourse.table.menu.rename" />
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleDeleteLesson(lesson.id)}>
              <Typography variant="body1">
                <FormattedMessage id="ui.editCourse.table.menu.delete" defaultMessage="ui.editCourse.table.menu.delete" />
              </Typography>
            </MenuItem>
          </MenuRow>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
