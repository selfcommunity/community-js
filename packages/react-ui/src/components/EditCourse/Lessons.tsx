import {Box, Chip, Icon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {Fragment, useCallback, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {getSection, LESSONS_DATA} from './data';
import SectionRow from './Lessons/SectionRow';
import AddButton from './Lessons/AddButton';
import {ActionLessonEnum, ActionLessonType, SectionRowInterface} from './types';
import Empty from './Lessons/Empty';

const classes = {
  lessonTitle: `${PREFIX}-lesson-title`,
  lessonInfoWrapper: `${PREFIX}-lesson-info-wrapper`,
  lessonInfo: `${PREFIX}-lesson-info`,
  lessonStatus: `${PREFIX}-lesson-status`,
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
  cellAlignCenter: `${PREFIX}-cell-align-center`
};

export default function Lessons() {
  // STATES
  const [sections, setSections] = useState<SectionRowInterface[] | null>(null);
  const [lessons, setLessons] = useState<number>(0);

  // INTL
  const intl = useIntl();

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

  const handleAddSection = useCallback(async () => {
    const newSection: SectionRowInterface = await getSection((sections?.[sections.length - 1].id || 0) + 1);

    setSections((prevSections) => (prevSections ? [...prevSections, newSection] : [newSection]));
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
              id="ui.editCourse.lessons.typeOfCourse"
              defaultMessage="ui.editCourse.lessons.typeOfCourse"
              values={{
                typeOfCourse: intl.formatMessage({
                  id: `ui.typeOfCourse.${LESSONS_DATA.typeOfCourse}`,
                  defaultMessage: `ui.typeOfCourse.${LESSONS_DATA.typeOfCourse}`
                })
              }}
            />
          </Typography>
        </Stack>

        <Chip
          label={
            <Typography variant="body1">
              <FormattedMessage
                id="ui.editCourse.lessons.status"
                defaultMessage="ui.editCourse.lessons.status"
                values={{
                  status: intl.formatMessage({
                    id: `ui.statusCourse.${LESSONS_DATA.statusCourse}`,
                    defaultMessage: `ui.statusCourse.${LESSONS_DATA.statusCourse}`
                  })
                }}
              />
            </Typography>
          }
          className={classes.lessonStatus}
        />
      </Stack>

      {(!sections || sections.length === 0) && <Empty handleAddSection={handleAddSection} />}

      {sections?.length > 0 && (
        <Fragment>
          <Stack className={classes.lessonsSectionsWrapper}>
            <Stack className={classes.lessonsSections}>
              <Typography variant="h5">
                <FormattedMessage
                  id="ui.editCourse.sections.title"
                  defaultMessage="ui.editCourse.sections.title"
                  values={{
                    sectionsNumber: sections.length
                  }}
                />
              </Typography>

              <Box className={classes.circle} />

              <Typography variant="h5">
                <FormattedMessage
                  id="ui.editCourse.lessons.title"
                  defaultMessage="ui.editCourse.lessons.title"
                  values={{
                    lessonsNumber: lessons
                  }}
                />
              </Typography>
            </Stack>

            <AddButton label="ui.editCourse.table.section" handleAddRow={handleAddSection} color="primary" variant="contained" />
          </Stack>

          <DragDropContext onDragEnd={handleDragEnd}>
            <TableContainer className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell className={classes.cellWidth} />
                    <TableCell>
                      <Typography className={classes.tableHeaderTypography} variant="overline">
                        <FormattedMessage id="ui.editCourse.table.header.lessonName" defaultMessage="ui.editCourse.table.header.lessonName" />
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.cellAlignCenter}>
                      <Typography className={classes.tableHeaderTypography} variant="overline">
                        <FormattedMessage id="ui.editCourse.table.header.calendar" defaultMessage="ui.editCourse.table.header.calendar" />
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.cellAlignRight}>
                      <Typography className={classes.tableHeaderTypography} variant="overline">
                        <FormattedMessage id="ui.editCourse.table.header.actions" defaultMessage="ui.editCourse.table.header.actions" />
                      </Typography>
                    </TableCell>
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
