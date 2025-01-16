import {
  KnobHeadless,
  KnobHeadlessLabel,
  KnobHeadlessOutput,
  useKnobKeyboardControls,
} from "react-knob-headless";
import classes from "./Knob.module.css";
import { memo, useId } from "react";

interface KnobProps {
  valueMin: number;
  valueMax: number;
  label: string;
  tooltip: string;
  valueRaw: number;
  setValueRaw: (value: number) => void;
}

const Knob = memo(
  ({
    valueMin,
    valueMax,
    label,
    tooltip,
    valueRaw,
    setValueRaw,
  }: KnobProps) => {
    const knobId = useId();
    const labelId = useId();
    // const [valueRaw, setValueRaw] = useState<number>(valueDefault);
    const value01 = (valueRaw - valueMin) / (valueMax - valueMin);
    const step = 1;
    const stepLarger = 10;
    const dragSensitivity = 0.003;

    const keyboardControlHandlers = useKnobKeyboardControls({
      valueRaw,
      valueMin,
      valueMax,
      step,
      stepLarger,
      onValueRawChange: setValueRaw,
    });

    // console.log(label + " ReRender");

    return (
      <div className={classes.knob} title={tooltip}>
        <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel>
        <KnobHeadless
          id={knobId}
          aria-labelledby={labelId}
          className={classes.container}
          valueMin={valueMin}
          valueMax={valueMax}
          valueRaw={valueRaw}
          valueRawRoundFn={valueRawRoundFn}
          valueRawDisplayFn={valueRawDisplayFn}
          dragSensitivity={dragSensitivity}
          onValueRawChange={(e) => {
            setValueRaw(e);
          }}
          includeIntoTabOrder
          {...keyboardControlHandlers}
        >
          <KnobBaseThumb value01={value01} />
        </KnobHeadless>
        <KnobHeadlessOutput htmlFor={knobId} className={classes.value}>
          {valueRawDisplayFn(valueRaw)}
        </KnobHeadlessOutput>
      </div>
    );
  }
);

const valueRawRoundFn = Math.round;
const valueRawDisplayFn = (valueRaw: number): string =>
  `${valueRawRoundFn(valueRaw)}`;

export function KnobBaseThumb({ value01 }: { value01: number }) {
  const angleMin = -144;
  const angleMax = 144;
  const angle = value01 * (angleMax - angleMin) + angleMin;
  return (
    <div className={classes.thumb}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.svg}
      >
        <path
          d="M27.0569 82.7661C20.1374 77.921 14.9294 71.0097 12.1793 63.0227C9.42913 55.0358 9.2781 46.3832 11.7478 38.3051C14.2175 30.2271 19.1812 23.1382 25.9274 18.0546C32.6736 12.9709 40.856 10.1535 49.3019 10.0061C57.7478 9.85867 66.0235 12.3888 72.9431 17.2339C79.8626 22.079 85.0706 28.9903 87.8207 36.9773C90.5709 44.9642 90.7219 53.6168 88.2522 61.6949C85.7825 69.7729 80.8188 76.8618 74.0726 81.9454"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M27.0569 82.7661C20.1374 77.921 14.9294 71.0097 12.1793 63.0227C9.42913 55.0358 9.2781 46.3832 11.7478 38.3051C14.2175 30.2271 19.1812 23.1382 25.9274 18.0546C32.6736 12.9709 40.856 10.1535 49.3019 10.0061C57.7478 9.85867 66.0235 12.3888 72.9431 17.2339C79.8626 22.079 85.0706 28.9903 87.8207 36.9773C90.5709 44.9642 90.7219 53.6168 88.2522 61.6949C85.7825 69.7729 80.8188 76.8618 74.0726 81.9454"
          className={classes.svgBar}
          strokeWidth="8"
          strokeDasharray={201}
          strokeDashoffset={201 - 201 * value01 || 0}
          strokeLinecap="round"
        />
      </svg>
      <div
        className={classes.pointerHolder}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className={classes.pointer} />
      </div>
    </div>
  );
}

export default Knob;
