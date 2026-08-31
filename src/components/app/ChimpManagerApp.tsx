"use client";

import { useChimpManager } from "./useChimpManager";
import { CMContext } from "./context";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { DetailPanel } from "./DetailPanel";
import { ChimpyPanel } from "./ChimpyPanel";
import { CommandPalette } from "./CommandPalette";
import { Toast } from "./Toast";
import { CaptureScreen } from "./screens/CaptureScreen";
import { OverviewScreen } from "./screens/OverviewScreen";
import { TrackerScreen } from "./screens/TrackerScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { ModulesScreen } from "./screens/ModulesScreen";
import { PeopleScreen } from "./screens/PeopleScreen";
import { RulesScreen } from "./screens/RulesScreen";
import type { ProjectState } from "@/lib/types";

export function ChimpManagerApp({ initialState }: { initialState: ProjectState }) {
  const cm = useChimpManager(initialState);
  const { ui } = cm;

  return (
    <CMContext.Provider value={cm}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
          <TopBar />
          <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
            {ui.screen === "capture" && <CaptureScreen />}
            {ui.screen === "overview" && <OverviewScreen />}
            {ui.screen === "tracker" && <TrackerScreen />}
            {ui.screen === "review" && <ReviewScreen />}
            {ui.screen === "modules" && <ModulesScreen />}
            {ui.screen === "people" && <PeopleScreen />}
            {ui.screen === "settings" && <RulesScreen />}
          </div>
        </main>
        <DetailPanel />
        <ChimpyPanel />
        <CommandPalette />
        <Toast />
      </div>
    </CMContext.Provider>
  );
}
