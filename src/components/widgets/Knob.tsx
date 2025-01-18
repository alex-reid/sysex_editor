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
          <KnobBaseThumb
            value01={value01}
            split={valueMin < 0 && valueMax > 0}
          />
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

export function KnobBaseThumb({
  value01,
  split,
}: {
  value01: number;
  split?: boolean;
}) {
  const angleMin = -145;
  const angleMax = 145;
  const angle = value01 * (angleMax - angleMin) + angleMin;
  const strokeLength = 233.6;
  let value02 = value01;
  let dashArray = `${strokeLength * value01} ${strokeLength * 2}`;
  let dashOffset = 0;
  if (split) {
    value02 = value01 * 2 - 1;
    dashArray =
      value02 >= 0
        ? `${(strokeLength / 2) * value02} ${strokeLength}`
        : `${(strokeLength / 2) * Math.abs(value02)}, ${strokeLength}`;
    dashOffset =
      value02 >= 0
        ? -strokeLength / 2
        : -strokeLength / 2 + (strokeLength / 2) * Math.abs(value02);
  }
  return (
    <div className={classes.thumb}>
      <svg
        width="100%"
        height="100%"
        viewBox="-10 -10 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.svg}
      >
        <path
          d=" M 24 88 A 46 46 0 1 1 76 88"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d=" M 24 88 A 46 46 0 1 1 76 88"
          className={classes.svgBar}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
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
