import {Box, Icon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {Fragment, memo, useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {getSections, getSection, LESSONS_DATA} from './data';
import SectionRow from './Lessons/SectionRow';
import AddButton from './Lessons/AddButton';
import {ActionLessonEnum, ActionLessonType, SectionRowInterface} from './types';
import EmptyStatus from '../../shared/EmptyStatus/EmptyStatus';
import {useSnackbar} from 'notistack';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Skeleton from './Lessons/Skeleton';
import {SCCourseType} from '@selfcommunity/types';
import Status from './Status';

const classes = {
  lessonTitle: `${PREFIX}-lesson-title`,
  lessonInfoWrapper: `${PREFIX}-lesson-info-wrapper`,
  lessonInfo: `${PREFIX}-lesson-info`,
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
  emptyStatusButton: `${PREFIX}-empty-status-button`
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
}

function Lessons(props: LessonsProps) {
  // PROPS
  const {course} = props;

  // STATES
  const [sections, setSections] = useState<SectionRowInterface[] | null>(null);
  const [lessons, setLessons] = useState<number>(0);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    getSections()
      .then((data) => {
        if (data) {
          setSections(data);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, []);

  // HANDLERS
  const handleDragEnd = useCallback(
    (e: DropResult<string>) => {
      if (!e.destination) {
        return;
      }

      const tempSections = Array.from(sections);
      const [sourceData] = tempSections.splice(e.source.index, 1);
      tempSections.splice(e.destination.index, 0, sourceData);

      setSections(tempSections);
    },
    [sections]
  );

  const handleUpdateSection = useCallback(
    (section: SectionRowInterface, lesson?: ActionLessonType) => {
      if (lesson === ActionLessonEnum.ADD) {
        setLessons((prevLesson) => prevLesson + 1);
      } else if (lesson === ActionLessonEnum.DELETE) {
        setLessons((prevLesson) => prevLesson - 1);
      }

      setSections((prevSection) =>
        prevSection.map((prevSection) => {
          if (prevSection.id === section.id) {
            return section;
          }

          return prevSection;
        })
      );
    },
    [setSections, setLessons]
  );

  const handleAddSection = useCallback(() => {
    getSection((sections?.[sections.length - 1]?.id || 0) + 1)
      .then((newSection) => setSections((prevSections) => (prevSections ? [...prevSections, newSection] : [newSection])))
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [sections]);

  const handleDeleteSection = useCallback(
    (id: number) => {
      const lessonsToRemove = sections.reduce((acc, section) => {
        if (section.id === id) {
          return acc + section.lessons.length;
        }

        return acc;
      }, 0);

      setLessons((prevLessons) => prevLessons - lessonsToRemove);
      setSections((prevSections) => prevSections.filter((prevSection) => prevSection.id !== id));
    },
    [sections, setLessons]
  );

  const handleRenameSection = useCallback(
    (oldId: number, newName: string) => {
      setSections((prevSections) =>
        prevSections.map((prevSection) => {
          if (prevSection.id === oldId) {
            return {
              ...prevSection,
              name: newName
            };
          }

          return prevSection;
        })
      );
    },
    [setSections]
  );

  return (
    <Box>
      <Typography className={classes.lessonTitle} variant="h4">
        <FormattedMessage id="ui.editCourse.tab.lessons" defaultMessage="ui.editCourse.tab.lessons" />
      </Typography>

      <Stack className={classes.lessonInfoWrapper}>
        <Stack className={classes.lessonInfo}>
          <Icon>courses</Icon>

          <Typography variant="body2">
            <FormattedMessage
              id="ui.course.type"
              defaultMessage="ui.course.type"
              values={{
                typeOfCourse: intl.formatMessage({
                  id: `ui.course.type.${LESSONS_DATA.typeOfCourse}`,
                  defaultMessage: `ui.course.type.${LESSONS_DATA.typeOfCourse}`
                })
              }}
            />
          </Typography>
        </Stack>

        <Status />
      </Stack>

      {!sections && <Skeleton />}

      {sections?.length === 0 && (
        <EmptyStatus
          icon="courses"
          title="ui.editCourse.tab.lessons.table.empty.title"
          description="ui.editCourse.tab.lessons.table.empty.description"
          actions={
            <AddButton
              className={classes.emptyStatusButton}
              label="ui.editCourse.tab.lessons.table.section"
              handleAddRow={handleAddSection}
              color="inherit"
              variant="outlined"
            />
          }
          className={classes.lessonEmptyStatus}
        />
      )}

      {sections?.length > 0 && (
        <Fragment>
          <Stack className={classes.lessonsSectionsWrapper}>
            <Stack className={classes.lessonsSections}>
              <Typography variant="h5">
                <FormattedMessage
                  id="ui.editCourse.tab.lessons.table.sections.title"
                  defaultMessage="ui.editCourse.tab.lessons.table.sections.title"
                  values={{
                    sectionsNumber: sections.length
                  }}
                />
              </Typography>

              <Box className={classes.circle} />

              <Typography variant="h5">
                <FormattedMessage
                  id="ui.course.table.lessons.title"
                  defaultMessage="ui.course.table.lessons.title"
                  values={{
                    lessonsNumber: lessons
                  }}
                />
              </Typography>
            </Stack>

            <AddButton label="ui.editCourse.tab.lessons.table.section" handleAddRow={handleAddSection} color="primary" variant="contained" />
          </Stack>

          <DragDropContext onDragEnd={handleDragEnd}>
            <TableContainer className={classes.tableContainer}>
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
                      {sections.map((section, i) => (
                        <Draggable key={i} draggableId={i.toString()} index={i}>
                          {(innerProvider) => (
                            <SectionRow
                              key={i}
                              course={course}
                              provider={innerProvider}
                              section={section}
                              handleUpdateSection={handleUpdateSection}
                              handleDeleteSection={handleDeleteSection}
                              handleRenameSection={handleRenameSection}
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
        </Fragment>
      )}
    </Box>
  );
}

export default memo(Lessons);
