import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  lighten,
  Paper,
  SelectChangeEvent,
  Slider,
  Tooltip,
} from "@mui/material";
import {
  NodeDefect,
  NodeDefinition,
  PartNumber,
  SolderProblems,
} from "./definitions";
import { AppBarTracker } from "./AppBarTracker";
import { LightBlue } from "./theme";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import {
  DefectPart,
  getDefectLogsAll,
  getDefectPartsAll,
  getDefectPartsSpecific,
  insertDefectLogs,
  insertDefectPart,
} from "./rest-endpoint";
import { AppBarViewer } from "./AppBarViewer";
import { dateTimeToString } from "./utils";
import { ResizePayload, useResizeDetector } from "react-resize-detector";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    // height: "100%",
    height: "calc(100vh - 100px)",
    textAlign: "center",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
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
    height: "calc(100vh - 300px)",
  },
  node: {
    border: "none",
    zIndex: 1,
    "&:hover": {
      border: `3px solid ${LightBlue}`,
      zIndex: 999,
    },
  },
}));

export type SolderDefectViews = SolderProblems | "All Defects";

export type NodeDefectMap = NodeDefect & {
  count: number;
  ratio: number;
};

const TRANSLATE = true;
// const pictureZoomMagnifier = 2;
const pictureZoomSize = 600;

export const PartView: React.FC<{ part: PartNumber }> = (props) => {
  document.title = `${props.part.partNumber} | Solder Viewer`;

  const classes = useStyles();

  const navigate = useNavigate();

  const nodeDiagram = require(`./images/${props.part.pcbNumber}.jpg`);
  const assemblyDiagram = require(`./images/${props.part.pcbNumber}-assy-inverse.jpg`);

  const [defectValue, setDefectValue] =
    React.useState<SolderDefectViews>("All Defects");

  const [pictureRatio, setPictureRatio] = React.useState(1);

  const [pictureDimensions, setPictureDimensions] = React.useState({
    x: 0,
    y: 0,
  });

  const [zoomedPoint, setZoomedPoint] = React.useState({ x: 0, y: 0 });
  const [screenZoomedPoint, setScreenZoomedPoint] = React.useState({
    x: 0,
    y: 0,
  });

  const [pictureZoomMagnifier, setPictureZoomMagnifier] = React.useState(2);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [sliderOpacity, setSliderOpacity] = React.useState(0);

  const [sliderZoom, setSliderZoom] = React.useState(2);

  const [selectedNodes, setSelectedNodes] = React.useState<NodeDefectMap[]>([]);
  const [defectParts, setDefectParts] = React.useState<DefectPart[]>([]);

  const [datePickerStart, setDatePickerStart] = React.useState(() => {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  });
  const [datePickerEnd, setDatePickerEnd] = React.useState(() => {
    let date = new Date();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    // date.setHours(0);
    // date.setMinutes(0);
    // date.setSeconds(0);
    // date.setMilliseconds(0);
    return date;
  });

  const picResizeDetector = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 100,
    onResize: React.useCallback((resize: ResizePayload) => {
      // console.log(resize);
      const srcHeight = (resize.entry?.target as any).naturalHeight;
      var rect = resize.entry?.target.getBoundingClientRect();
      const ratio = srcHeight / (rect?.height ?? 1);
      setPictureRatio(1 / ratio);
      setPictureDimensions({
        x: resize.width ?? 0,
        y: resize.height ?? 0,
      });
    }, []),
  });

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSliderOpacity = (event: Event, value: number | number[]) => {
    const op = typeof value === "number" ? value : value[0];
    setSliderOpacity(op);
  };

  const handleSliderZoom = (event: Event, value: number | number[]) => {
    const op = typeof value === "number" ? value : value[0];
    setSliderZoom(op);
  };

  const getDefectColor = (node: NodeDefect) => {
    if (node.defect === "Bridging") {
      return "rgb(255, 255, 0)";
    } else if (node.defect === "Solder Hole") {
      return "rgb(255, 0, 0)";
    } else {
      return "rgb(0, 255, 0)";
    }
  };

  // const getDefectColorMap = (node: NodeDefectMap) => {
  //   if (node.defect === "Bridging") {
  //     return lighten("rgb(255, 255, 0)", 1 - node.ratio);
  //   } else if (node.defect === "Solder Hole") {
  //     return lighten("rgb(255, 0, 0)", 1 - node.ratio);
  //   } else {
  //     return lighten("rgb(0, 255, 0)", 1 - node.ratio);
  //   }
  // };
  const getDefectColorMap = (node: NodeDefectMap) => {
    if (node.defect === "Bridging") {
      return `rgba(255, 255, 0, ${node.ratio})`;
    } else if (node.defect === "Solder Hole") {
      return `rgba(255, 0, 0, ${node.ratio})`;
    } else {
      return `rgba(0, 255, 0, ${node.ratio})`;
    }
  };

  const getNode = (x: number, y: number) => {
    // const foundNode = props.part.components.find((node) => {
    //   const widthDiff = node.width / 2;
    //   const heightDiff = node.height / 2;
    //   const x_min = node.posX - widthDiff;
    //   const x_max = node.posX + widthDiff;
    //   const y_min = node.posY - heightDiff;
    //   const y_max = node.posY + heightDiff;
    //   return x >= x_min && x <= x_max && y >= y_min && y <= y_max;
    // });
    for (let i = 0; i < props.part.components.length; i++) {
      const component = props.part.components[i];
      if (Array.isArray(component)) {
      } else {
        for (let j = 0; j < component.nodes.length; j++) {
          const node = component.nodes[j];
          const widthDiff = node.width / 2;
          const heightDiff = node.height / 2;
          const x_min = node.posX - widthDiff;
          const x_max = node.posX + widthDiff;
          const y_min = node.posY - heightDiff;
          const y_max = node.posY + heightDiff;
          if (x >= x_min && x <= x_max && y >= y_min && y <= y_max) {
            return { component, node };
          }
        }
      }
    }
    return undefined;
  };

  const handleZoomClick = (event: any) => {
    const srcWidth = event.currentTarget.naturalWidth;
    const srcHeight = event.currentTarget.naturalHeight;
    var rect = event.target.getBoundingClientRect();
    var clientX = event.clientX - rect.left; //x position within the element.
    var clientY = event.clientY - rect.top; //y position within the element.
    const ratio = srcHeight / rect.height;
    const x = clientX * ratio;
    const y = clientY * ratio;
    setPictureDimensions({
      x: event.currentTarget.width,
      y: event.currentTarget.height,
    });
    setPictureRatio(1 / ratio);

    setZoomedPoint({
      x: x,
      y: y,
    });
    setScreenZoomedPoint({
      x: event.clientX,
      y: event.clientY,
    });
    handleDialogOpen();
  };

  const handleDiagramClick = (event: any) => {
    const srcHeight = event.currentTarget.naturalHeight;
    var rect = event.target.getBoundingClientRect();
    var clientX = event.clientX - rect.left; //x position within the element.
    var clientY = event.clientY - rect.top; //y position within the element.
    const ratio = srcHeight / rect.height;
    const x = clientX * ratio;
    const y = clientY * ratio;
    const node = getNode(x, y);
    // if (node) {
    //   if (selectedNodes.some((x) => x.name === node.node.name)) {
    //     setSelectedNodes(
    //       selectedNodes.filter((x) => x.name !== node.node.name)
    //     );
    //   } else {
    //     setSelectedNodes((x) => {
    //       return [
    //         ...x,
    //         { ...node.node, component: node.component, defect: defectValue },
    //       ];
    //     });
    //   }
    // }
  };

  const handleSubmit = () => {
    void (async () => {
      const response = await getDefectPartsSpecific(
        datePickerStart,
        datePickerEnd,
        props.part.partNumber
      );
      if (response.length > 0) {
        enqueueSnackbar(
          `Successfully queried defects for ${props.part.partNumber}.`,
          {
            variant: "success",
            autoHideDuration: 4000,
          }
        );
        console.log(response);
        setDefectParts(response);
      } else {
        enqueueSnackbar(`No defects found for ${props.part.partNumber}.`, {
          variant: "error",
          autoHideDuration: 4000,
        });
      }
    })();
  };

  // React.useEffect(() => {
  //   console.log(`${picResizeDetector.width}, ${picResizeDetector.height}`);
  //   setPictureDimensions({
  //     x: picResizeDetector.width ?? 0,
  //     y: picResizeDetector.height ?? 0,
  //   });
  // }, [picResizeDetector]);

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      console.log("RESIZE");
    });

    return () => {
      window.removeEventListener("resize", () => {
        console.log("Done resize.");
      });
    };
  }, []);

  React.useEffect(() => {
    console.log(selectedNodes);
  }, [selectedNodes]);

  React.useEffect(() => {
    let allNodes: NodeDefect[] = [];
    defectParts.forEach((defect) => {
      for (let i = 0; i < defect.nodeNames.length; i++) {
        const component =
          [...props.part.components].find((x) =>
            !Array.isArray(x)
              ? x.name === defect.componentNames[i]
              : x.find((a) => a.name === defect.componentNames[i])
          ) ?? props.part.components[0];
        if (Array.isArray(component)) {
        } else {
          const foundNode =
            component.nodes.find((x) => x.name === defect.nodeNames[i]) ??
            component.nodes[0];
          const node: NodeDefect = {
            defect: defect.defects[i] as SolderProblems,
            component: component,
            posX: foundNode.posX,
            posY: foundNode.posY,
            width: foundNode.width,
            height: foundNode.height,
            node: foundNode.node,
            name: foundNode.name,
            desc: foundNode.desc,
          };
          allNodes.push(node);
        }
      }
    });
    const holeNodes = allNodes.filter((x) => x.defect === "Solder Hole");
    const bridgeNodes = allNodes.filter((x) => x.defect === "Bridging");
    const otherNodes = allNodes.filter((x) => x.defect === "Other");
    let mapNodes: NodeDefectMap[] = [];
    if (defectValue === "Solder Hole") {
      holeNodes.forEach((node) => {
        const foundIndex = mapNodes.findIndex(
          (x) => x.name === node.name && x.defect === node.defect
        );
        if (foundIndex > -1) {
          mapNodes[foundIndex].count++;
        } else {
          const newNode: NodeDefectMap = {
            ...node,
            count: 1,
            ratio: 1 / holeNodes.length,
          };
          mapNodes.push(newNode);
        }
      });
    } else if (defectValue === "Bridging") {
      bridgeNodes.forEach((node) => {
        const foundIndex = mapNodes.findIndex(
          (x) => x.name === node.name && x.defect === node.defect
        );
        if (foundIndex > -1) {
          mapNodes[foundIndex].count++;
        } else {
          const newNode: NodeDefectMap = {
            ...node,
            count: 1,
            ratio: 1 / bridgeNodes.length,
          };
          mapNodes.push(newNode);
        }
      });
    } else if (defectValue === "Other") {
      otherNodes.forEach((node) => {
        const foundIndex = mapNodes.findIndex(
          (x) => x.name === node.name && x.defect === node.defect
        );
        if (foundIndex > -1) {
          mapNodes[foundIndex].count++;
        } else {
          const newNode: NodeDefectMap = {
            ...node,
            count: 1,
            ratio: 1 / otherNodes.length,
          };
          mapNodes.push(newNode);
        }
      });
    } else {
      holeNodes.forEach((node) => {
        const foundIndex = mapNodes.findIndex(
          (x) => x.name === node.name && x.defect === node.defect
        );
        if (foundIndex > -1) {
          mapNodes[foundIndex].count++;
        } else {
          const newNode: NodeDefectMap = {
            ...node,
            count: 1,
            ratio: 1 / allNodes.length,
          };
          mapNodes.push(newNode);
        }
      });
      bridgeNodes.forEach((node) => {
        const foundIndex = mapNodes.findIndex(
          (x) => x.name === node.name && x.defect === node.defect
        );
        if (foundIndex > -1) {
          mapNodes[foundIndex].count++;
        } else {
          const newNode: NodeDefectMap = {
            ...node,
            count: 1,
            ratio: 1 / allNodes.length,
          };
          mapNodes.push(newNode);
        }
      });
      otherNodes.forEach((node) => {
        const foundIndex = mapNodes.findIndex(
          (x) => x.name === node.name && x.defect === node.defect
        );
        if (foundIndex > -1) {
          mapNodes[foundIndex].count++;
        } else {
          const newNode: NodeDefectMap = {
            ...node,
            count: 1,
            ratio: 1 / allNodes.length,
          };
          mapNodes.push(newNode);
        }
      });
    }
    const biggestCount = Math.max(...mapNodes.map((x) => x.count));
    const biggestRatio = Math.max(...mapNodes.map((x) => x.ratio));
    const ratioDiff = 1 - biggestRatio;
    let defectTypes =
      allNodes.map((x) => x.defect).filter((v, i, a) => a.indexOf(v) === i)
        .length - 1;
    defectTypes = defectTypes >= 1 ? defectTypes : 1;

    if (defectValue !== "All Defects") {
      mapNodes = mapNodes.map((node) => {
        return {
          ...node,
          ratio: (node.ratio + ratioDiff) * 0.75 * (node.count / biggestCount),
        };
      });
    } else {
      mapNodes = mapNodes.map((node) => {
        return {
          ...node,
          ratio: (node.ratio + ratioDiff) * 0.75 * (node.count / biggestCount),
        };
      });
    }
    // setSelectedNodes(allNodes);
    setSelectedNodes(mapNodes);
  }, [props.part, defectParts, defectValue]);

  React.useEffect(() => {
    setPictureZoomMagnifier(sliderZoom);
  }, [sliderZoom]);

  return (
    <React.Fragment>
      <SnackbarProvider
        maxSnack={6}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <AppBarViewer
        startDate={datePickerStart}
        endDate={datePickerEnd}
        defect={defectValue}
        onStartChange={(date) => setDatePickerStart(date)}
        onEndChange={(date) => setDatePickerEnd(date)}
        onDefectChange={(defect) => setDefectValue(defect)}
        onSubmit={handleSubmit}
      />
      <Paper
        sx={{
          width: "100%",
          height: "36px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "80px",
        }}
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <Slider
          value={sliderOpacity}
          onChange={handleSliderOpacity}
          min={0}
          max={100}
          step={1}
          // valueLabelDisplay="auto"
          style={{
            width: "300px",
          }}
        />
        <Slider
          value={sliderZoom}
          onChange={handleSliderZoom}
          min={1}
          max={5}
          step={0.05}
          // valueLabelDisplay="auto"
          style={{
            width: "300px",
          }}
        />
      </Paper>
      <div id="main-root" className={classes.root}>
        <div
          style={{
            display: dialogOpen ? undefined : "none",
            opacity: dialogOpen ? 1 : 0,
            position: "absolute",
            zIndex: 1,
            borderRadius: "50%",
            width: `${pictureZoomSize / pictureZoomMagnifier}px`,
            height: `${pictureZoomSize / pictureZoomMagnifier}px`,
            border: `5px solid ${LightBlue}`,
            left: `${
              zoomedPoint.x * pictureRatio -
              (pictureZoomSize / pictureZoomMagnifier / 2 -
                (window.innerWidth - pictureDimensions.x) / 2) -
              6
            }px`,
            top: `${
              zoomedPoint.y * pictureRatio -
              (pictureZoomSize / pictureZoomMagnifier / 2 - 100)
            }px`,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)",
            pointerEvents: "none",
          }}
        />
        {selectedNodes.map((node, index) => {
          const nodes = selectedNodes.filter((x) => x.name === node.name);
          return (
            <Tooltip
              key={index}
              title={
                `${node.name} - ` +
                nodes.map((x) => `${x.defect}: ${x.count}`).join(", ")
              }
            >
              <div
                key={index}
                className={classes.node}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  borderRadius: "50%",
                  width: `${node.width * pictureRatio}px`,
                  height: `${node.height * pictureRatio}px`,
                  // border: `5px solid ${getDefectColorMap(node)}`,
                  filter: "blur(3px)",
                  left: `${
                    node.posX * pictureRatio -
                    ((node.width * pictureRatio) / 2 -
                      (window.innerWidth - pictureDimensions.x) / 2) -
                    5
                  }px`,
                  top: `${
                    node.posY * pictureRatio -
                    ((node.height * pictureRatio) / 2 - 97)
                  }px`,
                  backgroundColor: getDefectColorMap(node),
                  boxShadow: `0 0 20px 20px ${getDefectColorMap(node)}`,
                  // pointerEvents: "none",
                }}
              />
            </Tooltip>
          );
        })}
        {/* {selectedNodes.map((node, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              zIndex: 1,
              borderRadius: "50%",
              width: `${node.width * pictureRatio}px`,
              height: `${node.height * pictureRatio}px`,
              border: `5px solid ${getDefectColor(node)}`,
              left: `${
                node.posX * pictureRatio -
                ((node.width * pictureRatio) / 2 -
                  (window.innerWidth - pictureDimensions.x) / 2) -
                5
              }px`,
              top: `${
                node.posY * pictureRatio -
                ((node.height * pictureRatio) / 2 - 97)
              }px`,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)",
              pointerEvents: "none",
            }}
          />
        ))} */}
        <img
          ref={picResizeDetector.ref}
          id="part-diagram-image"
          src={nodeDiagram}
          alt={props.part.partNumber}
          draggable={false}
          style={{
            userSelect: "none",
            marginTop: "2px",
            maxHeight: "calc(100vh - 102px)",
            maxWidth: "calc(100vw - 50px)",
            position: "fixed",
          }}
          onClick={handleZoomClick}
        />
        <img
          id="part-diagram-image-assy"
          src={assemblyDiagram}
          alt={props.part.partNumber + "-assy"}
          draggable={false}
          style={{
            userSelect: "none",
            marginTop: "2px",
            maxHeight: "calc(100vh - 102px)",
            maxWidth: "calc(100vw - 50px)",
            position: "fixed",
            opacity: sliderOpacity / 100,
          }}
          onClick={handleZoomClick}
        />
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          sx={{
            zIndex: 1,
          }}
          PaperProps={{
            sx: {
              overflow: "hidden",
              borderRadius: "50%",
              border: `5px solid ${LightBlue}`,
              maxWidth: "100%",
              translate: TRANSLATE
                ? `${
                    (screenZoomedPoint.x < window.innerWidth / 2
                      ? 0 - (window.innerWidth / 2 - screenZoomedPoint.x)
                      : screenZoomedPoint.x - window.innerWidth / 2) * 0.25
                  }px ${
                    (screenZoomedPoint.y < window.innerHeight / 2
                      ? 0 - (window.innerHeight / 2 - screenZoomedPoint.y)
                      : screenZoomedPoint.y - window.innerHeight / 2) * 0.25
                  }px`
                : undefined,
            },
          }}
        >
          <Paper
            style={{
              width: `${pictureZoomSize}px`,
              height: `${pictureZoomSize}px`,
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              {selectedNodes.map((node, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    zIndex: 5,
                    borderRadius: "50%",
                    width: `${
                      node.width * pictureRatio * pictureZoomMagnifier
                    }px`,
                    height: `${
                      node.height * pictureRatio * pictureZoomMagnifier
                    }px`,
                    // border: `5px solid ${getDefectColorMap(node)}`,
                    filter: "blur(3px)",
                    left: `${
                      node.posX * pictureRatio * pictureZoomMagnifier -
                      (node.width * pictureRatio * pictureZoomMagnifier) / 2 -
                      (zoomedPoint.x * pictureRatio * pictureZoomMagnifier -
                        pictureZoomSize / 2) -
                      4
                    }px`,
                    top: `${
                      node.posY * pictureRatio * pictureZoomMagnifier -
                      (node.height * pictureRatio * pictureZoomMagnifier) / 2 -
                      (zoomedPoint.y * pictureRatio * pictureZoomMagnifier -
                        pictureZoomSize / 2)
                    }px`,
                    backgroundColor: getDefectColorMap(node),
                    boxShadow: `0 0 20px 20px ${getDefectColorMap(node)}`,
                    pointerEvents: "none",
                  }}
                />
              ))}
              <img
                id="part-diagram-image-zoom"
                src={nodeDiagram}
                alt={props.part.partNumber + "-zoom"}
                draggable={false}
                style={{
                  userSelect: "none",
                  marginTop: "2px",
                  height: `calc(${pictureDimensions.y}px * ${pictureZoomMagnifier})`,
                  position: "absolute",
                  left: `${
                    0 -
                    (zoomedPoint.x * pictureRatio * pictureZoomMagnifier -
                      pictureZoomSize / 2)
                  }px`,
                  top: `${
                    0 -
                    (zoomedPoint.y * pictureRatio * pictureZoomMagnifier -
                      pictureZoomSize / 2)
                  }px`,
                }}
                onClick={handleDiagramClick}
              />
              <img
                id="part-diagram-image-zoom-assy"
                src={assemblyDiagram}
                alt={props.part.partNumber + "-zoom-assy"}
                draggable={false}
                style={{
                  userSelect: "none",
                  marginTop: "2px",
                  height: `calc(${pictureDimensions.y}px * ${pictureZoomMagnifier})`,
                  position: "absolute",
                  left: `${
                    0 -
                    (zoomedPoint.x * pictureRatio * pictureZoomMagnifier -
                      pictureZoomSize / 2)
                  }px`,
                  top: `${
                    0 -
                    (zoomedPoint.y * pictureRatio * pictureZoomMagnifier -
                      pictureZoomSize / 2)
                  }px`,
                  opacity: sliderOpacity / 100,
                  zIndex: 1,
                }}
                onClick={handleDiagramClick}
              />
            </div>
          </Paper>
        </Dialog>
      </div>
    </React.Fragment>
  );
};
