import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Link, Stack, Typography } from "@mui/material";
import { PART_NUMBERS } from "./definitions";
import { AppBarMenu } from "./AppBar";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  appHeader: {
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "default",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  mainBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // height: "calc(100vh - 300px)",
  },
}));

export const TrackPage: React.FC<{}> = () => {
  document.title = "Track | Solder Tracker";

  const classes = useStyles();

  const navigate = useNavigate();

  React.useEffect(() => {}, []);

  return (
    <React.Fragment>
      <AppBarMenu />
      <div id="main-root" className={classes.root}>
        <header className={classes.appHeader}>
          <Typography
            style={{ fontSize: "72px", fontWeight: "bold", color: "#000" }}
          >
            Solder Defect Tracker
          </Typography>
          <Typography
            style={{ fontSize: "12px", fontWeight: "400", color: "#000" }}
          >
            Track solder skips and defects for parts.
          </Typography>
        </header>
        <div className={classes.mainBody}>
          <Stack direction="column" spacing={1}>
            {PART_NUMBERS.map((part, index) => (
              <Link
                key={index}
                component="button"
                variant="h4"
                onClick={() => {
                  navigate(`/track/${part.partNumber}`);
                }}
              >
                {part.partNumber}
              </Link>
            ))}
          </Stack>
        </div>
      </div>
    </React.Fragment>
  );
};
