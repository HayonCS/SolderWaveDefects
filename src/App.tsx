import { Route, Routes } from "react-router-dom";
import { HomePage } from "./Home";
import { PART_NUMBERS } from "./definitions";
import { PartTrack } from "./PartTrack";
import { TrackPage } from "./Track";
import { ViewPage } from "./View";
import { PartView } from "./PartView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/track" element={<TrackPage />} />

      <Route path="/view" element={<ViewPage />} />

      {PART_NUMBERS.map((part, index) => (
        <Route
          key={index}
          path={`/track/${part.partNumber}`}
          element={<PartTrack part={part} />}
        />
      ))}

      {PART_NUMBERS.map((part, index) => (
        <Route
          key={index}
          path={`/view/${part.partNumber}`}
          element={<PartView part={part} />}
        />
      ))}
    </Routes>
  );
}

export default App;
