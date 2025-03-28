import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {Fragment, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import {Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import Status from './Status';
import EmptyStatus from '../../shared/EmptyStatus';
import AddButton from './Lessons/AddButton';
import SectionRow from './Lessons/SectionRow';
import {ActionLessonType, DeleteRowProps, DeleteRowRef, RowType} from './types';
import {useIsDisabled} from './hooks';
import classNames from 'classnames';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import CourseTypePopover from '../../shared/CourseTypePopover';

const classes = {
  lessonTitle: `${PREFIX}-lesson-title`,
  lessonInfoWrapper: `${PREFIX}-lesson-info-wrapper`,
  lessonsSectionsWrapper: `${PREFIX}-lessons-sections-wrapper`,
  lessonsSections: `${PREFIX}-lessons-sections`,
  circle: `${PREFIX}-circle`,
  tableContainer: `${PREFIX}-table-container`,
  table: `${PREFIX}-table`,
  tableHeader: `${PREFIX}-table-header`,
  tableHeaderTypography: `${PREFIX}-table-header-typography`,
  tableBody: `${PREFIX}-table-body`,
  cellWidth: `${PREFIX}-cell-width`,
  cellAlignRight: `${PREFIX}-cell-align-right`,
  cellAlignCenter: `${PREFIX}-cell-align-center`,
  lessonEmptyStatus: `${PREFIX}-lesson-empty-status`,
  emptyStatusButton: `${PREFIX}-empty-status-button`,
  contrastColor: `${PREFIX}-contrast-color`,
  contrastBgColor: `${PREFIX}-contrast-bg-color`
};

const headerCells = [
  {
    className: undefined,
    id: 'ui.editCourse.tab.lessons.table.header.lessonName'
  },
  {
    className: classes.cellAlignCenter,
    id: 'ui.editCourse.tab.lessons.table.header.calendar'
  },
  {
    className: classes.cellAlignRight,
    id: 'ui.editCourse.tab.lessons.table.header.actions'
  }
];

interface LessonsProps {
  course: SCCourseType;
  setCourse: (course: SCCourseType) => void;
}

function Lessons(props: LessonsProps) {
  // PROPS
  const {course, setCourse} = props;

  // STATES
  const [sections, setSections] = useState<SCCourseSectionType[]>([]);
  const [dialog, setDialog] = useState<DeleteRowProps | null>(null);

  // REFS
  const ref = useRef<DeleteRowRef | null>(null);

  // HOOKS
  const {isDisabled} = useIsDisabled();
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    if (course.sections) {
      setSections(course.sections);
    }
  }, [course]);

  // MEMOS
  const isNewRow = useMemo(() => sections.length > course.sections?.length, [course, sections]);

  // FUNCTIONS
  const getSection = useCallback((id: number) => {
    return {
      id,
      name: intl.formatMessage(
        {id: 'ui.editCourse.tab.lessons.table.newSection', defaultMessage: 'ui.editCourse.tab.lessons.table.newSection'},
        {num: id}
      )
    };
  }, []);

  // HANDLERS
  const handleDragEnd = useCallback(
    (e: DropResult<string>) => {
      if (!e.destination || e.destination.index === e.source.index) {
        return;
      }

      const tempSections: SCCourseSectionType[] = Array.from(course.sections);
      const [sourceData] = tempSections.splice(e.source.index, 1);
      tempSections.splice(e.destination.index, 0, sourceData);

      const data: Partial<SCCourseType> = {
        sections_order: tempSections.map((tempSection) => tempSection.id)
      };

      CourseService.patchCourse(course.id, data)
        .then(() => {
          setCourse({...course, sections: tempSections});

          enqueueSnackbar(
            <FormattedMessage id="ui.editCourse.tab.lessons.table.snackbar.save" defaultMessage="ui.editCourse.tab.lessons.table.snackbar.save" />,
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [course]
  );

  const handleAddTempSection = useCallback(() => {
    setSections((prevSections) => (prevSections.length > 0 ? [...prevSections, getSection(prevSections.length + 1)] : [getSection(1)]));
  }, [setSections]);

  const handleManageSection = useCallback(
    (section: SCCourseSectionType, type: ActionLessonType, newRow = false) => {
      switch (type) {
        case ActionLessonType.ADD: {
          const newSection: SCCourseSectionType = {
            ...section,
            lessons: []
          };

          setCourse({
            ...course,
            num_sections: course.num_sections + 1,
            sections: [...course.sections, newSection]
          });
          break;
        }
        case ActionLessonType.RENAME:
          setCourse({
            ...course,
            sections: course.sections.map((prevSection: SCCourseSectionType) => {
              if (prevSection.id === section.id) {
                return {
                  ...prevSection,
                  name: section.name
                };
              }

              return prevSection;
            })
          });
          break;
        case ActionLessonType.DELETE: {
          if (newRow) {
            setCourse({
              ...course,
              sections: course.sections.filter((prevSection: SCCourseSectionType) => prevSection.id !== section.id)
            });
          } else {
            setCourse({
              ...course,
              num_sections: course.num_sections - 1,
              num_lessons: course.num_lessons - section.num_lessons,
              sections: course.sections.filter((prevSection: SCCourseSectionType) => prevSection.id !== section.id)
            });
          }
          break;
        }
        case ActionLessonType.UPDATE:
          setCourse({
            ...course,
            sections: course.sections.map((prevSection: SCCourseSectionType) => {
              if (prevSection.id === section.id) {
                return {
                  ...prevSection,
                  lessons: section.lessons
                };
              }

              return prevSection;
            })
          });
          break;
        case type.endsWith(ActionLessonType.UPDATE) && type: {
          if (newRow) {
            setCourse({
              ...course,
              sections: course.sections.map((prevSection: SCCourseSectionType) => {
                if (prevSection.id === section.id) {
                  return section;
                }

                return prevSection;
              })
            });
          } else {
            let numLessons: number | undefined = course.num_lessons;

            if (type === ActionLessonType.ADD_UPDATE) {
              numLessons = course.num_lessons + 1;
            } else if (type === ActionLessonType.DELETE_UPDATE) {
              numLessons = course.num_lessons - 1;
            }

            setCourse({
              ...course,
              num_lessons: numLessons,
              sections: course.sections.map((prevSection: SCCourseSectionType) => {
                if (prevSection.id === section.id) {
                  return section;
                }

                return prevSection;
              })
            });
          }
        }
      }
    },
    [course]
  );

  const handleOpenDialog = useCallback(
    (row: DeleteRowProps | null) => {
      setDialog(row);
    },
    [setDialog]
  );

  const handleDeleteRow = useCallback(() => {
    switch (dialog.row) {
      case RowType.SECTION:
        ref.current.handleDeleteSection(dialog.section);
        break;
      case RowType.LESSON:
        ref.current.handleDeleteLesson(dialog.section, dialog.lesson);
    }

    handleOpenDialog(null);
  }, [dialog, handleOpenDialog]);

  return (
    <Box>
      <Typography className={classNames(classes.lessonTitle, classes.contrastColor)} variant="h4">
        <FormattedMessage id="ui.editCourse.tab.lessons" defaultMessage="ui.editCourse.tab.lessons" />
      </Typography>

      <Stack className={classes.lessonInfoWrapper}>
        <CourseTypePopover course={course} />
        <Status course={course} />
      </Stack>

      {sections.length === 0 && (
        <EmptyStatus
          icon="courses"
          title="ui.editCourse.tab.lessons.table.empty.title"
          description="ui.editCourse.tab.lessons.table.empty.description"
          actions={
            <AddButton
              className={classes.emptyStatusButton}
              label="ui.editCourse.tab.lessons.table.section"
              handleAddRow={handleAddTempSection}
              color="inherit"
              variant="outlined"
            />
          }
          className={classNames(classes.lessonEmptyStatus, classes.contrastBgColor)}
        />
      )}

      {sections.length > 0 && (
        <Fragment>
          <Stack className={classNames(classes.lessonsSectionsWrapper, classes.contrastBgColor)}>
            <Stack className={classes.lessonsSections}>
              <Typography variant="h5">
                <FormattedMessage
                  id="ui.course.table.sections.title"
                  defaultMessage="ui.course.table.sections.title"
                  values={{
                    sectionsNumber: course.num_sections
                  }}
                />
              </Typography>

              <Box className={classes.circle} />

              <Typography variant="h5">
                <FormattedMessage
                  id="ui.course.table.lessons.title"
                  defaultMessage="ui.course.table.lessons.title"
                  values={{
                    lessonsNumber: course.num_lessons
                  }}
                />
              </Typography>
            </Stack>

            <AddButton
              label="ui.editCourse.tab.lessons.table.section"
              handleAddRow={handleAddTempSection}
              color="primary"
              variant="contained"
              disabled={isDisabled}
            />
          </Stack>

          <DragDropContext onDragEnd={handleDragEnd}>
            <TableContainer className={classNames(classes.tableContainer, classes.contrastBgColor)}>
              <Table className={classes.table}>
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell className={classes.cellWidth} />

                    {headerCells.map((cell, i) => (
                      <TableCell key={i} className={cell.className}>
                        <Typography className={classes.tableHeaderTypography} variant="overline">
                          <FormattedMessage id={cell.id} defaultMessage={cell.id} />
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <Droppable droppableId="droppable-1">
                  {(outerProvider) => (
                    <TableBody ref={outerProvider.innerRef} {...outerProvider.droppableProps} className={classes.tableBody}>
                      {sections.map((section, i, array) => (
                        <Draggable key={i} draggableId={i.toString()} index={i} isDragDisabled={isDisabled}>
                          {(innerProvider) => (
                            <SectionRow
                              key={i}
                              course={course}
                              provider={innerProvider}
                              section={section}
                              isNewRow={isNewRow && i + 1 === array.length}
                              handleManageSection={handleManageSection}
                              handleOpenDialog={handleOpenDialog}
                              ref={ref}
                            />
                          )}
                        </Draggable>
                      ))}
                      {outerProvider.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </TableContainer>
          </DragDropContext>

          {dialog && <ConfirmDialog open onClose={() => handleOpenDialog(null)} onConfirm={handleDeleteRow} />}
        </Fragment>
      )}
    </Box>
  );
}

export default memo(Lessons);
