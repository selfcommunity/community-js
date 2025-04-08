import {Stack, Skeleton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box} from '@mui/material';
import {PREFIX} from '../constants';

const classes = {
  lessonTitle: `${PREFIX}-lesson-title`,
  lessonInfoWrapper: `${PREFIX}-lesson-info-wrapper`,
  lessonInfo: `${PREFIX}-lesson-info`,
  lessonsSectionsWrapper: `${PREFIX}-lessons-sections-wrapper`,
  lessonsSections: `${PREFIX}-lessons-sections`,
  tableContainer: `${PREFIX}-table-container`,
  margin: `${PREFIX}-margin`,
  marginLeft: `${PREFIX}-margin-left`,
  actionsWrapper: `${PREFIX}-actions-wrapper`
};

export default function LessonsSkeleton() {
  return (
    <Box>
      <Skeleton animation="wave" variant="text" width="150px" height="21px" className={classes.lessonTitle} />

      <Stack className={classes.lessonInfoWrapper}>
        <Stack className={classes.lessonInfo}>
          <Skeleton animation="wave" variant="rectangular" width="14px" height="14px" />
          <Skeleton animation="wave" variant="text" width="150px" height="21px" />
        </Stack>

        <Skeleton animation="wave" variant="rectangular" width="105px" height="32px" />
      </Stack>

      <Stack className={classes.lessonsSectionsWrapper}>
        <Skeleton animation="wave" width="159px" height="21px" />

        <Skeleton animation="wave" width="100px" height="32px" />
      </Stack>

      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <Skeleton animation="wave" variant="text" width="102px" height="32px" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="text" width="87px" height="32px" className={classes.margin} />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="text" width="48px" height="32px" className={classes.marginLeft} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell />
              <TableCell>
                <Skeleton animation="wave" variant="text" width="102px" height="21px" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="rectangular" width="250px" height="54px" className={classes.margin} />
              </TableCell>
              <TableCell>
                <Stack className={classes.actionsWrapper}>
                  <Skeleton animation="wave" variant="rounded" width="105px" height="37px" />
                  <Skeleton animation="wave" variant="circular" width="36px" height="36px" />
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
