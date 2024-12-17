import {Stack, styled, Skeleton, TableContainer, Table, TableHead, TableRow, TableCell} from '@mui/material';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  lessonsSectionsWrapper: `${PREFIX}-lessons-sections-wrapper`,
  lessonsSections: `${PREFIX}-lessons-sections`,
  tableContainer: `${PREFIX}-table-container`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function TableSkeleton() {
  return (
    <Root className={classes.root}>
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
                <Skeleton animation="wave" width="102px" height="32px" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" width="87px" height="32px" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" width="48px" height="32px" />
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Root>
  );
}
