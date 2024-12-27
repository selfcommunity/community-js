import {Skeleton, SkeletonOwnProps, Stack, TableCell, TableRow} from '@mui/material';

interface RowSkeletonProps {
  header?: boolean;
  animation?: SkeletonOwnProps['animation'];
}

export default function RowSkeleton(props: RowSkeletonProps) {
  const {header = false, animation = 'wave'} = props;

  return (
    <TableRow>
      {Array.from(new Array(4)).map((_, i) => (
        <TableCell width="25%" key={i}>
          {!header && i === 0 && (
            <Stack direction="row" alignItems="center" gap="16px">
              <Skeleton animation={animation} variant="circular" width="30px" height="30px" />
              <Skeleton animation={animation} variant="text" width="118px" height="24px" />
            </Stack>
          )}
          {((!header && i > 0) || header) && <Skeleton animation={animation} variant="text" width="78px" height="24px" />}
        </TableCell>
      ))}
    </TableRow>
  );
}
