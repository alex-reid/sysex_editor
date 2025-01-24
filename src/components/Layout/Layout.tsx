import { useState } from "react";
import layoutJSON from "../../constants/x5dr/layout.json";
import classes from "./Layout.module.css";
import { ParamInput } from "../zustand/ParamList";
import useStore from "../../store/store";
import EnvWithNames from "../widgets/Envelope/EnvWithNames";

const Layout = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const programConfig = useStore((state) => state.programConfig);
  return (
    <div>
      <div className={classes.tabs}>
        {layoutJSON.map((tab, key) => (
          <button
            key={key}
            className={`${classes.tab} ${
              currentTab == key ? classes.activeTab : ""
            }`}
            onClick={() => setCurrentTab(key)}
          >
            <h4>{tab.tabName}</h4>
          </button>
        ))}
      </div>
      <div className={classes.layoutGrid}>
        {layoutJSON[currentTab].tabContent?.map((tabContent, key) => {
          switch (tabContent.type) {
            case "section":
              return (
                <div
                  key={key}
                  className={classes.sectionWrapper}
                  style={{
                    gridColumnStart: tabContent.x || 1,
                    gridColumnEnd: tabContent.x + tabContent.width,
                    gridRowStart: tabContent.y || 1,
                    gridRowEnd: tabContent.y + tabContent.height,
                  }}
                >
                  <h5 className={classes.sectionLabel}>
                    {tabContent.sectionName}
                  </h5>
                </div>
              );
            case "number":
            case "list":
            case "boolean":
              if (!programConfig) return null;
              return (
                <div
                  key={key}
                  style={{
                    gridColumnStart: tabContent.x || 1,
                    gridColumnEnd: tabContent.x + tabContent.width,
                    gridRowStart: tabContent.y || 1,
                    gridRowEnd: tabContent.y + tabContent.height,
                  }}
                >
                  <ParamInput
                    label={tabContent.label}
                    key={key}
                    name={tabContent.name || ""}
                    type={tabContent.type}
                    programConfig={programConfig}
                  />
                </div>
              );
            case "envelope":
              return (
                <div
                  key={key}
                  style={{
                    gridColumnStart: tabContent.x || 1,
                    gridColumnEnd: tabContent.x + tabContent.width,
                    gridRowStart: tabContent.y || 1,
                    gridRowEnd: tabContent.y + tabContent.height,
                  }}
                >
                  <EnvWithNames
                    bipolar={tabContent.nameParams?.bipolar || false}
                    attackTimeName={tabContent.nameParams?.attackTimeName || ""}
                    decayTimeName={tabContent.nameParams?.decayTimeName || ""}
                    slopeTimeName={tabContent.nameParams?.slopeTimeName || ""}
                    releaseTimeName={
                      tabContent.nameParams?.releaseTimeName || ""
                    }
                    attackLevelName={
                      tabContent.nameParams?.attackLevelName || ""
                    }
                    breakPointLevelName={
                      tabContent.nameParams?.breakPointLevelName || ""
                    }
                    sustainLevelName={
                      tabContent.nameParams?.sustainLevelName || ""
                    }
                    releaseLevelName={
                      tabContent.nameParams?.releaseLevelName || ""
                    }
                  />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default Layout;
