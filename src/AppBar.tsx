import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Link,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Close,
  ConstructionRounded,
  DashboardRounded,
  DesignServices,
  HomeRounded,
  InfoRounded,
  LeaderboardRounded,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { GentexBlue } from "./theme";
import { useNavigate } from "react-router-dom";
import { GentexLogo } from "./icons/GentexLogo";
import { Chevron } from "./icons/Chevron";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: "#FFF",
    zIndex: 999,
    textAlign: "center",
  },
  appBar: {
    backgroundColor: GentexBlue,
    zIndex: 999,
    justifyContent: "center",
  },
  appBarLink: {
    fontSize: 16,
    color: "#FFF",
    marginRight: 30,
    cursor: "pointer",
    userSelect: "none",
  },
  menuButton: {
    marginRight: 1,
  },
  logo: {
    fontSize: 150,
    marginLeft: 16,
    marginRight: 8,
    scale: 1.3,
  },
  chevron: {
    fontSize: 20,
    marginLeft: 8,
    marginRight: 8,
    scale: 0.8,
  },
  logoDrawer: {
    fontSize: 150,
    marginLeft: 16,
    marginRight: 8,
    scale: 1.5,
  },
  drawerClose: {
    marginRight: 8,
    color: "rgba(255, 255, 255, 0.3)",
    "&:hover": {
      color: "rgba(255, 255, 255, 0.8)",
    },
  },
  menuPanel: {
    backgroundColor: GentexBlue,
    color: "#FFF",
    height: "100%",
  },
  accountButton: {
    display: "flex",
    alignItems: "center",
    userSelect: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
}));

export const AppBarMenu: React.FC<{}> = (props) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      if (
        (event as React.MouseEvent).clientX <= 250 &&
        ((event as React.MouseEvent).clientY > 287 ||
          (event as React.MouseEvent).clientY < 56)
      ) {
        return;
      }
      setDrawerState(open);
    };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerState(true)}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              margin: "0 12px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <GentexLogo className={classes.logo} data-testid="gentexLogo" />
          </div>
          <Chevron className={classes.chevron} data-testid="logoSeparator" />
          <Typography
            variant="body1"
            component={"span"}
            style={{ textAlign: "left", width: "max-content" }}
            onClick={() => navigate("/")}
          >
            <Box
              fontWeight="normal"
              fontSize="18px"
              style={{
                cursor: "pointer",
                userSelect: "none",
                display: "flex",
                width: "max-content",
              }}
            >
              {`SOLDER DEFECT TRACKER`}
            </Box>
          </Typography>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              lineHeight: 0,
            }}
          >
            <Link className={classes.appBarLink} onClick={() => navigate("/")}>
              Home
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => navigate("/track")}
            >
              Track
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => navigate("/view")}
            >
              View
            </Link>
          </div>
        </Toolbar>

        <React.Fragment>
          <Drawer
            anchor={"left"}
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
              className={classes.menuPanel}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    margin: "12px 8px 8px 30px",
                  }}
                >
                  <GentexLogo
                    className={classes.logoDrawer}
                    data-testid="gentexLogoDrawer"
                  />
                </div>
                <IconButton
                  aria-label="Close"
                  size="small"
                  className={classes.drawerClose}
                  onClick={() => setDrawerState(false)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>

              <List>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate("/home")}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <HomeRounded />
                    </ListItemIcon>
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                      Home
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider style={{ backgroundColor: "#FFF" }} />
              <List>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate("/track")}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <DesignServices />
                    </ListItemIcon>
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                      Track
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate("/view")}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <DashboardRounded />
                    </ListItemIcon>
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                      View
                    </Typography>
                  </ListItemButton>
                </ListItem>
                {/* <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate("/resources")}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <ConstructionRounded />
                    </ListItemIcon>
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                      Resources
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate("/about")}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <InfoRounded />
                    </ListItemIcon>
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                      About
                    </Typography>
                  </ListItemButton>
                </ListItem> */}
              </List>
            </Box>
          </Drawer>
        </React.Fragment>
      </AppBar>
    </div>
  );
};
