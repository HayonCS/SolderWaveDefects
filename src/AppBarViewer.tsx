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
import { makeStyles, withStyles } from "@mui/styles";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { SolderDefectViews } from "./PartView";

const CustomDatePicker = withStyles({
  "MuiInputBase-input": {
    padding: 0,
    "&.MuiOutlinedInput-input": {
      padding: 0,
    },
  },
  "&.MuiInputBase-input": {
    padding: 0,
    "&.MuiOutlinedInput-input": {
      padding: 0,
    },
  },
  root: {
    "MuiInputBase-input": {
      padding: 0,
      "&.MuiOutlinedInput-input": {
        padding: 0,
      },
    },
    ".MuiInputBase-input": {
      padding: 0,
      "&.MuiOutlinedInput-input": {
        padding: 0,
      },
    },
    "&.MuiInputBase-input": {
      padding: 0,
      "&.MuiOutlinedInput-input": {
        padding: 0,
      },
    },
    "&.MuiInputBase-root": {
      padding: 0,
      "&.MuiButtonBase-root": {
        padding: 0,
        paddingLeft: 10,
      },
      "&.MuiInputBase-input": {
        padding: 15,
        paddingLeft: 0,
      },
    },
  },
})(DatePicker);

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
  datePicker: {
    "MuiInputBase-input-MuiOutlinedInput-input": {
      padding: 0,
    },
    "MuiInputBase-input": {
      padding: 0,
      "&.MuiOutlinedInput-input": {
        padding: 0,
      },
    },
    ".MuiInputBase-input": {
      padding: 0,
      "&.MuiOutlinedInput-input": {
        padding: 0,
      },
    },
    "&.MuiInputBase-input": {
      padding: 0,
      "&.MuiOutlinedInput-input": {
        padding: 0,
      },
    },
    "&.MuiInputBase-root": {
      padding: 0,
      "&.MuiButtonBase-root": {
        padding: 0,
        paddingLeft: 10,
      },
      "&.MuiInputBase-input": {
        padding: 15,
        paddingLeft: 0,
      },
    },
  },
}));

export const AppBarViewer: React.FC<{
  startDate: Date;
  endDate: Date;
  defect: SolderDefectViews;
  onStartChange?: (date: Date) => void;
  onEndChange?: (date: Date) => void;
  onDefectChange?: (defect: SolderDefectViews) => void;
  onSubmit?: () => void;
}> = (props) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [drawerState, setDrawerState] = React.useState(false);

  const [datePickerStart, setDatePickerStart] = React.useState(props.startDate);
  const [datePickerEnd, setDatePickerEnd] = React.useState(props.endDate);

  const [defectValue, setDefectValue] = React.useState<SolderDefectViews>(
    props.defect ?? "All Defects"
  );

  const handleDefectSelect = (event: SelectChangeEvent) => {
    const defect = event.target.value as SolderDefectViews;
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
              {`SOLDER DEFECT VIEWER`}
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
                  <MenuItem value={"All Defects"}>{"⚪ All Defects"}</MenuItem>
                  <MenuItem value={"Bridging"}>{"🟡 Bridging"}</MenuItem>
                  <MenuItem value={"Solder Hole"}>{"🔴 Solder Hole"}</MenuItem>
                  <MenuItem value={"Other"}>{"🟢 Other"}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM/DD/YYYY"
                label="Start"
                closeOnSelect={false}
                maxDate={dayjs(datePickerEnd)}
                value={dayjs(datePickerStart)}
                onChange={(date: any) => {
                  const d = date ? date.toDate() : new Date();
                  setDatePickerStart(d);
                  if (props.onStartChange) {
                    props.onStartChange(d);
                  }
                }}
                sx={{
                  width: "160px",
                  margin: "8px 0",
                }}
                slotProps={{
                  openPickerButton: {
                    sx: {
                      color: "#fff",
                    },
                  },
                  textField: {
                    inputProps: {
                      style: {
                        padding: "8px 12px",
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
              <Typography
                variant="body1"
                component={"span"}
                style={{ padding: "0 10px" }}
              >
                {"- to -"}
              </Typography>
              <DatePicker
                format="MM/DD/YYYY"
                label="End"
                closeOnSelect={false}
                minDate={dayjs(datePickerStart)}
                value={dayjs(datePickerEnd)}
                onChange={(date: any) => {
                  const d = date ? date.toDate() : new Date();
                  setDatePickerEnd(d);
                  if (props.onEndChange) {
                    props.onEndChange(d);
                  }
                }}
                sx={{
                  width: "160px",
                  margin: "8px 0",
                }}
                slotProps={{
                  openPickerButton: {
                    sx: {
                      color: "#fff",
                    },
                  },
                  textField: {
                    inputProps: {
                      style: {
                        padding: "8px 12px",
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              size="large"
              variant="contained"
              color="primary"
              // endIcon={<Send />}
              // disabled={props.disableSubmit}
              onClick={() => {
                if (props.onSubmit) {
                  props.onSubmit();
                }
              }}
            >
              {"Get"}
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
                      onClick={() => navigate(`/view/${part.partNumber}`)}
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
