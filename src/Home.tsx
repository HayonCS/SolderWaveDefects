import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Chip, Fab, Link, Stack, Typography } from "@mui/material";
import { PART_NUMBERS } from "./definitions";
import { AppBarMenu } from "./AppBar";
import {
  DashboardRounded,
  DesignServices,
  LeaderboardRounded,
} from "@mui/icons-material";

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

export const HomePage: React.FC<{}> = () => {
  document.title = "Home | Solder Tracker";

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
          <Fab
            variant="extended"
            color="primary"
            style={{ transform: "scale(1.25)", marginBottom: "60px" }}
            // sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            onClick={() => {
              navigate("/track");
            }}
          >
            <DesignServices style={{ paddingRight: "8px" }} />
            {"TRACK"}
          </Fab>
          <Fab
            variant="extended"
            color="primary"
            style={{ transform: "scale(1.25)", marginBottom: "80px" }}
            // sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            onClick={() => {
              navigate("/view");
            }}
          >
            <DashboardRounded style={{ paddingRight: "8px" }} />
            {"VIEW"}
          </Fab>
          {/* <Stack direction="row" spacing={2}>
            <Chip
              label="Resources"
              color="primary"
              sx={{
                // backgroundColor: "rgba(255, 255, 255, 0.1)",
                width: "90px",
              }}
              onClick={() => {
                navigate("/resources");
              }}
            />
            <Chip
              label="About"
              color="primary"
              sx={{
                // backgroundColor: "rgba(255, 255, 255, 0.1)",
                width: "90px",
              }}
              onClick={() => {
                navigate("/about");
              }}
            />
          </Stack> */}
        </div>
      </div>
    </React.Fragment>
  );
};
