import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  Dialog,
  FormControlLabel,
  Paper,
  Slider,
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
  getDefectLogsAll,
  getDefectPartsAll,
  insertDefectLogs,
  insertDefectPart,
} from "./rest-endpoint";
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
}));

const TRANSLATE = true;
// const pictureZoomMagnifier = 2;
const pictureZoomSize = 600;

export const PartTrack: React.FC<{ part: PartNumber }> = (props) => {
  document.title = `${props.part.partNumber} | Solder Tracker`;

  const classes = useStyles();

  const navigate = useNavigate();

  const nodeDiagram = require(`./images/${props.part.pcbNumber}.jpg`);
  const assemblyDiagram = require(`./images/${props.part.pcbNumber}-assy-inverse.jpg`);

  const [defectValue, setDefectValue] =
    React.useState<SolderProblems>("Solder Hole");

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

  const [zoomOnClick, setZoomOnClick] = React.useState(false);

  const [selectedNodes, setSelectedNodes] = React.useState<NodeDefect[]>([]);

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
        for (let k = 0; k < component.length; k++) {
          const comp = component[k];
          for (let j = 0; j < comp.nodes.length; j++) {
            const node = comp.nodes[j];
            const widthDiff = node.width / 2;
            const heightDiff = node.height / 2;
            const x_min = node.posX - widthDiff;
            const x_max = node.posX + widthDiff;
            const y_min = node.posY - heightDiff;
            const y_max = node.posY + heightDiff;
            if (x >= x_min && x <= x_max && y >= y_min && y <= y_max) {
              return { component: comp, node: node };
            }
          }
        }
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
            return { component: component, node: node };
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

  // React.useEffect(() => {
  //   let nodes: typeof selectedNodes = [];
  //   for (let i = 0; i < props.part.components.length; i++) {
  //     const component = props.part.components[i];
  //     if (Array.isArray(component)) {
  //       for (let k = 0; k < component.length; k++) {
  //         const comp = component[k];
  //         for (let j = 0; j < comp.nodes.length; j++) {
  //           const node = comp.nodes[j];
  //           nodes.push({ component: comp, ...node, defect: defectValue });
  //         }
  //       }
  //     } else {
  //       for (let j = 0; j < component.nodes.length; j++) {
  //         const node = component.nodes[j];
  //         nodes.push({ component: component, ...node, defect: defectValue });
  //       }
  //     }
  //   }
  //   setSelectedNodes(nodes);
  // }, [props.part, defectValue]);

  const handleDiagramClick = (event: any) => {
    const srcHeight = event.currentTarget.naturalHeight;
    var rect = event.target.getBoundingClientRect();
    var clientX = event.clientX - rect.left; //x position within the element.
    var clientY = event.clientY - rect.top; //y position within the element.
    const ratio = srcHeight / rect.height;
    const x = clientX * ratio;
    const y = clientY * ratio;
    console.log(`X: ${x}, Y: ${y}`);
    const node = getNode(x, y);
    if (node) {
      const foundIndex = selectedNodes.findIndex(
        (x) => x.name === node.node.name && x.posX === node.node.posX
      );
      if (foundIndex > -1) {
        let newNodes = [...selectedNodes];
        newNodes.splice(foundIndex, 1);
        setSelectedNodes(newNodes);
      } else {
        setSelectedNodes((x) => {
          return [
            ...x,
            { ...node.node, component: node.component, defect: defectValue },
          ];
        });
      }
    }
  };

  const handleCancelTrack = () => {
    setSelectedNodes([]);
    enqueueSnackbar("Cleared the tracking diagram.", {
      variant: "info",
      autoHideDuration: 4000,
    });
  };

  const handleSubmitTrack = () => {
    void (async () => {
      const logResponse = await insertDefectLogs(
        props.part.partNumber,
        props.part.pcbNumber,
        selectedNodes
      );
      const partResponse = await insertDefectPart(
        props.part.partNumber,
        props.part.pcbNumber,
        selectedNodes
      );
      if (logResponse && partResponse) {
        enqueueSnackbar(
          `Submitted 1 Part with ${selectedNodes.length} defects.`,
          {
            variant: "success",
            autoHideDuration: 4000,
          }
        );
        handleDialogClose();
        setSelectedNodes([]);
      } else {
        enqueueSnackbar(
          `Failed to submit part with ${selectedNodes.length} defects.`,
          {
            variant: "error",
            autoHideDuration: 4000,
          }
        );
      }
    })();
  };

  React.useEffect(() => {
    setPictureZoomMagnifier(sliderZoom);
  }, [sliderZoom]);

  return (
    <React.Fragment>
      <SnackbarProvider
        maxSnack={6}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <AppBarTracker
        defect={defectValue}
        onDefectChange={(defect) => setDefectValue(defect)}
        onCancel={handleCancelTrack}
        onSubmit={handleSubmitTrack}
        disableCancel={selectedNodes.length < 1}
        disableSubmit={selectedNodes.length < 1}
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
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              value={zoomOnClick}
              onChange={(value) => setZoomOnClick(value.currentTarget.checked)}
            />
          }
          label="Zoom on Click"
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
        {selectedNodes.map((node, index) => (
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
        ))}
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
          onClick={zoomOnClick ? handleZoomClick : handleDiagramClick}
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
          onClick={zoomOnClick ? handleZoomClick : handleDiagramClick}
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
                    border: `5px solid ${getDefectColor(node)}`,
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
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)",
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
                  // height: `calc((100vh - 102px) * ${pictureZoomMagnifier})`,
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
