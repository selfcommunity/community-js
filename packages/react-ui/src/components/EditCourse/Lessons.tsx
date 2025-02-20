import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {Fragment, memo, useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import {Box, Icon, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import Status from './Status';
import LessonsSkeleton from './Lessons/Skeleton';
import EmptyStatus from '../../shared/EmptyStatus';
import AddButton from './Lessons/AddButton';
import SectionRow from './Lessons/SectionRow';
import {ActionLessonEnum, ActionLessonType} from './types';

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
  course: SCCourseType | null;
  setSCCourse: (course: SCCourseType) => void;
}

function Lessons(props: LessonsProps) {
  // PROPS
  const {course, setSCCourse} = props;

  // STATES
  const [sections, setSections] = useState<SCCourseSectionType[]>([]);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    if (course && course.sections) {
      setSections(course.sections);
    }
  }, [course]);

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
      if (!e.destination) {
        return;
      }

      const tempSections: SCCourseSectionType[] = Array.from(course.sections);
      const [sourceData] = tempSections.splice(e.source.index, 1);
      tempSections.splice(e.destination.index, 0, sourceData);

      const data: Partial<SCCourseType> = {
        sections_order: tempSections.map((tempSection) => tempSection.id)
      };

      CourseService.patchCourse(course.id, data)
        .then(() => setSCCourse({...course, sections: tempSections}))
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
    (section: SCCourseSectionType, type: ActionLessonType) => {
      switch (type) {
        case ActionLessonEnum.ADD:
          setSCCourse({
            ...course,
            num_sections: course.num_sections + 1,
            sections: [...course.sections, section]
          });
          break;
        case ActionLessonEnum.RENAME:
          setSCCourse({
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
        case ActionLessonEnum.DELETE:
          setSCCourse({
            ...course,
            num_sections: course.num_sections - 1,
            num_lessons: course.num_lessons - section.num_lessons,
            sections: course.sections.filter((prevSection: SCCourseSectionType) => prevSection.id !== section.id)
          });
          break;
        case ActionLessonEnum.UPDATE:
          setSCCourse({
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
        case type.endsWith(ActionLessonEnum.UPDATE) && type: {
          let numLessons = course.num_lessons;

          if (type === ActionLessonEnum.ADD_UPDATE) {
            numLessons = course.num_lessons + 1;
          } else if (type === ActionLessonEnum.DELETE_UPDATE) {
            numLessons = course.num_lessons - 1;
          }

          setSCCourse({
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
    },
    [course, setSections]
  );

  return (
    <Box>
      <Typography className={classes.lessonTitle} variant="h4">
        <FormattedMessage id="ui.editCourse.tab.lessons" defaultMessage="ui.editCourse.tab.lessons" />
      </Typography>

      <Stack className={classes.lessonInfoWrapper}>
        <Stack className={classes.lessonInfo}>
          <Icon>courses</Icon>

          {course ? (
            <Typography variant="body2">
              <FormattedMessage
                id="ui.course.type"
                defaultMessage="ui.course.type"
                values={{
                  typeOfCourse: intl.formatMessage({
                    id: `ui.course.type.${course.type}`,
                    defaultMessage: `ui.course.type.${course.type}`
                  })
                }}
              />
            </Typography>
          ) : (
            <Skeleton animation="wave" variant="text" width="150px" height="21px" />
          )}
        </Stack>

        <Status course={course} />
      </Stack>

      {!course && <LessonsSkeleton />}

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
          className={classes.lessonEmptyStatus}
        />
      )}

      {sections.length > 0 && (
        <Fragment>
          <Stack className={classes.lessonsSectionsWrapper}>
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

            <AddButton label="ui.editCourse.tab.lessons.table.section" handleAddRow={handleAddTempSection} color="primary" variant="contained" />
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
                      {sections.map((section, i, array) => (
                        <Draggable key={i} draggableId={i.toString()} index={i}>
                          {(innerProvider) => (
                            <SectionRow
                              key={i}
                              course={course}
                              provider={innerProvider}
                              section={section}
                              isNewRow={array.length > course?.sections.length}
                              handleManageSection={handleManageSection}
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
