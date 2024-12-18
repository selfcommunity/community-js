import {DragDropContext, Draggable, DraggableProvided, Droppable, DropResult} from '@hello-pangea/dnd';
import {Fragment, useCallback, useState} from 'react';
import {Collapse, Icon, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import classNames from 'classnames';
import {PREFIX} from '../constants';
import LessonRow from './LessonRow';
import AddButton from './AddButton';
import {ActionLessonEnum, ActionLessonType, SectionRowInterface} from '../types';
import MenuRow from './MenuRow';
import {FormattedMessage} from 'react-intl';
import {getLesson} from '../data';
import FieldName from './FieldName';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from 'packages/react-ui/src/constants/Errors';
import {useSnackbar} from 'notistack';
import LessonReleaseMenu from '../../LessonReleaseMenu';
import {SCCourseType} from '@selfcommunity/types';

const classes = {
  tableBodyIconWrapper: `${PREFIX}-table-body-icon-wrapper`,
  tableBodyAccordion: `${PREFIX}-table-body-accordion`,
  actionsWrapper: `${PREFIX}-actions-wrapper`,
  tableBodyCollapseWrapper: `${PREFIX}-table-body-collapse-wrapper`,
  cellWidth: `${PREFIX}-cell-width`,
  cellAlignRight: `${PREFIX}-cell-align-right`,
  cellAlignCenter: `${PREFIX}-cell-align-center`,
  cellPadding: `${PREFIX}-cell-padding`
};

interface SectionRowProps {
  course: SCCourseType;
  provider: DraggableProvided;
  section: SectionRowInterface;
  handleUpdateSection: (section: SectionRowInterface, lesson?: ActionLessonType) => void;
  handleDeleteSection: (id: number) => void;
  handleRenameSection: (oldId: number, newName: string) => void;
}

export default function SectionRow(props: SectionRowProps) {
  // PROPS
  const {course, provider, section, handleUpdateSection, handleDeleteSection, handleRenameSection} = props;

  // STATES
  const [open, setOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleExpandAccordion = useCallback(() => setOpen(!open), [open]);

  const handleDragEnd = useCallback(
    (e: DropResult<string>) => {
      if (!e.destination) {
        return;
      }

      const tempLessons = Array.from(section.lessons);
      const [sourceData] = tempLessons.splice(e.source.index, 1);
      tempLessons.splice(e.destination.index, 0, sourceData);

      const tempRow: SectionRowInterface = {
        ...section,
        lessons: tempLessons
      };

      handleUpdateSection(tempRow);
    },
    [section, handleUpdateSection]
  );

  const handleAddLesson = useCallback(() => {
    getLesson((section.lessons[section.lessons.length - 1]?.id || 0) + 1)
      .then((newLesson) => {
        const tempRow: SectionRowInterface = {
          ...section,
          lessons: [...section.lessons, newLesson]
        };

        handleUpdateSection(tempRow, ActionLessonEnum.ADD);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [section, handleUpdateSection]);

  const handleDeleteLesson = useCallback(
    (id: number) => {
      const tempRow: SectionRowInterface = {
        ...section,
        lessons: section.lessons.filter((lesson) => lesson.id !== id)
      };

      handleUpdateSection(tempRow, ActionLessonEnum.DELETE);
    },
    [section, handleUpdateSection]
  );

  const handleRenameLesson = useCallback(
    (oldId: number, newName: string) => {
      const tempRow = section.lessons.reduce(
        (acc: SectionRowInterface, _lesson) => {
          if (_lesson.id === oldId) {
            return {
              ...acc,
              lessons: [
                ...acc.lessons,
                {
                  id: oldId,
                  name: newName
                }
              ]
            };
          }

          return {
            ...acc,
            lessons: [...acc.lessons, _lesson]
          };
        },
        {
          ...section,
          lessons: []
        }
      );

      handleUpdateSection(tempRow);
    },
    [section, handleUpdateSection]
  );

  const handleSetEditMode = useCallback(() => setEditMode(true), [setEditMode]);

  return (
    <Fragment>
      <TableRow {...provider.draggableProps} ref={provider.innerRef} className={classes.tableBodyAccordion}>
        <TableCell component="th" scope="row" {...provider.dragHandleProps} className={classNames(classes.cellWidth, classes.cellPadding)}>
          <Stack className={classes.tableBodyIconWrapper}>
            <IconButton aria-label="expand row" size="small" onClick={handleExpandAccordion}>
              {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </IconButton>

            <Icon color="disabled">drag</Icon>
          </Stack>
        </TableCell>
        <TableCell>
          <FieldName row={section} handleRenameRow={handleRenameSection} editMode={editMode} setEditMode={setEditMode} />
        </TableCell>
        <TableCell className={classes.cellAlignCenter}>
          <LessonReleaseMenu course={course} />
        </TableCell>
        <TableCell className={classes.cellAlignRight}>
          <Stack className={classes.actionsWrapper}>
            <AddButton label="ui.editCourse.table.lesson" handleAddRow={handleAddLesson} color="primary" variant="outlined" />

            <MenuRow>
              <MenuItem onClick={handleSetEditMode}>
                <Typography variant="body1">
                  <FormattedMessage id="ui.editCourse.table.menu.rename" defaultMessage="ui.editCourse.table.menu.rename" />
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => handleDeleteSection(section.id)}>
                <Typography variant="body1">
                  <FormattedMessage id="ui.editCourse.table.menu.delete" defaultMessage="ui.editCourse.table.menu.delete" />
                </Typography>
              </MenuItem>
            </MenuRow>
          </Stack>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell className={classes.tableBodyCollapseWrapper} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table>
                <Droppable droppableId="droppable-2">
                  {(outerProvider) => (
                    <TableBody ref={outerProvider.innerRef} {...outerProvider.droppableProps}>
                      {section.lessons?.map((lesson, i) => (
                        <Draggable key={i} draggableId={i.toString()} index={i}>
                          {(innerProvider) => (
                            <LessonRow
                              key={i}
                              provider={innerProvider}
                              lesson={lesson}
                              handleDeleteLesson={handleDeleteLesson}
                              handleRenameLesson={handleRenameLesson}
                            />
                          )}
                        </Draggable>
                      ))}
                      {outerProvider.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
