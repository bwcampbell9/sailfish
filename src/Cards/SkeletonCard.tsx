import { Button, Skeleton, SkeletonItem, makeStyles, shorthands, tokens } from "@fluentui/react-components"

const useStyles = makeStyles({
    invertedWrapper: {
      backgroundColor: tokens.colorNeutralBackground1,
    },
    firstRow: {
      alignItems: "center",
      display: "grid",
      paddingBottom: "10px",
      position: "relative",
      ...shorthands.gap("10px"),
      gridTemplateColumns: "min-content 80%",
    },
    secondThirdRow: {
      alignItems: "center",
      display: "grid",
      paddingBottom: "10px",
      position: "relative",
      ...shorthands.gap("10px"),
      gridTemplateColumns: "min-content 20% 20% 15% 15%",
    },
  });

export const SkeletonCard = () => {
    const styles = useStyles();
    return (
        <Skeleton>
        <div className={styles.firstRow}>
          <SkeletonItem shape="circle" size={24} />
          <SkeletonItem shape="rectangle" size={16} />
        </div>
        <div className={styles.secondThirdRow}>
          <SkeletonItem shape="circle" size={24} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
        </div>
        <div className={styles.secondThirdRow}>
          <SkeletonItem shape="square" size={24} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
        </div>
        <Button>Test</Button>
      </Skeleton>
    )
}