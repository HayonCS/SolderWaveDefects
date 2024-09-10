import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  ArrowRight,
  Close,
  HomeRounded,
  Menu as MenuIcon,
  Redo,
  Send,
  Undo,
} from "@mui/icons-material";
import { GentexBlue } from "./theme";
import { useNavigate } from "react-router-dom";
import { GentexLogo } from "./icons/GentexLogo";
import { Chevron } from "./icons/Chevron";
import { PART_NUMBERS, SolderProblems } from "./definitions";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: "#FFF",
    position: "relative",
    zIndex: 3,
    textAlign: "center",
  },
  appBar: {
    backgroundColor: GentexBlue,
    zIndex: 1,
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
  defectSelectLabel: {
    color: "rgb(225, 225, 225)",
    "&.Mui-focused": {
      color: "#fff",
    },
  },
  defectSelect: {
    color: "#fff",
    "&:before": {
      borderBottom: "1px solid rgba(255,255,255,0.5)",
    },
    "&:after": {
      borderBottom: "2px solid #fff",
    },
    "&:hover": {
      color: "#fff",
    },
  },
}));

export const AppBarTracker: React.FC<{
  defect: SolderProblems;
  onDefectChange?: (defect: SolderProblems) => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  disableCancel?: boolean;
  disableSubmit?: boolean;
}> = (props) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [drawerState, setDrawerState] = React.useState(false);

  const [defectValue, setDefectValue] = React.useState<SolderProblems>(
    props.defect ?? "Solder Hole"
  );

  const handleDefectSelect = (event: SelectChangeEvent) => {
    const defect = event.target.value as SolderProblems;
    setDefectValue(defect);
    if (props.onDefectChange) {
      props.onDefectChange(defect);
    }
  };

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
            onClick={() => setDrawerState(true)}
          >
            <GentexLogo className={classes.logo} data-testid="gentexLogo" />
          </div>
          <Chevron className={classes.chevron} data-testid="logoSeparator" />
          <Typography
            variant="body1"
            component={"span"}
            style={{ textAlign: "left", width: "max-content" }}
            onClick={() => setDrawerState(true)}
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
              alignItems: "center",
              gap: "16px",
              lineHeight: 0,
            }}
          >
            <Box sx={{ width: 160, textAlign: "left" }}>
              <FormControl fullWidth className={classes.defectSelect}>
                <InputLabel
                  id="defect-select-label"
                  className={classes.defectSelectLabel}
                >
                  Defect
                </InputLabel>
                <Select
                  variant="filled"
                  size="small"
                  labelId="defect-select-label"
                  id="defect-select"
                  value={defectValue}
                  label="Defect"
                  onChange={handleDefectSelect}
                  className={classes.defectSelect}
                  SelectDisplayProps={{
                    style: {
                      padding: "8px 0 8px 12px",
                    },
                  }}
                >
                  <MenuItem value={"Bridging"}>{"🟡 Bridging"}</MenuItem>
                  <MenuItem value={"Solder Hole"}>{"🔴 Solder Hole"}</MenuItem>
                  <MenuItem value={"Other"}>{"🟢 Other"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* <Tooltip title="Undo (ctrl+z)" placement="bottom">
              <IconButton size="large" sx={{ color: "#fff" }}>
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo (ctrl+y)" placement="bottom">
              <IconButton size="large" sx={{ color: "#fff" }}>
                <Redo />
              </IconButton>
            </Tooltip> */}

            <Button
              size="large"
              variant="outlined"
              sx={{ color: "#fff" }}
              disabled={props.disableCancel}
              onClick={() => {
                if (props.onCancel) {
                  props.onCancel();
                }
              }}
            >
              {"Clear"}
            </Button>
            <Button
              size="large"
              variant="contained"
              color="primary"
              endIcon={<Send />}
              disabled={props.disableSubmit}
              onClick={() => {
                if (props.onSubmit) {
                  props.onSubmit();
                }
              }}
            >
              {"Submit"}
            </Button>
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
                    onClick={() => navigate("/")}
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
              <List sx={{ backgroundColor: GentexBlue }}>
                {PART_NUMBERS.map((part, index) => (
                  <ListItem key={index} disablePadding={true}>
                    <ListItemButton
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => navigate(`/track/${part.partNumber}`)}
                    >
                      <ListItemIcon style={{ color: "#FFF" }}>
                        <ArrowRight />
                      </ListItemIcon>
                      <Typography
                        style={{ fontSize: "18px", fontWeight: "500" }}
                      >
                        {part.partNumber}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </React.Fragment>
      </AppBar>
    </div>
  );
};
