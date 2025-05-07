import classes from "./loading.module.css";

export default function Loading() {
  return (
    <p className={classes.loading}>
      Please wait while we fetch the meals for you.
    </p>
  );
}
