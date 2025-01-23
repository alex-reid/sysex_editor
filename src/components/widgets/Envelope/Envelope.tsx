import { useState } from "react";
import classes from "./Envelope.module.css";

const EnvelopeTester = ({ bipolar = true }) => {
  // env times
  const [attackTime, setAttackTime] = useState(0.1);
  const [decayTime, setDecayTime] = useState(0.5);
  const [slopeTime, setSlopeTime] = useState(1);
  const [releaseTime, setReleaseTime] = useState(1);

  // env levels
  const [attackLevel, setAttackLevel] = useState(1);
  const [breakPointLevel, setBreakPointLevel] = useState(0.75);
  const [sustainLevel, setSustainLevel] = useState(0.5);
  const [releaseLevel, setReleaseLevel] = useState(0);

  return (
    <div>
      <EnvelopeADHSR
        bipolar={bipolar}
        attackTime={attackTime}
        decayTime={decayTime}
        slopeTime={slopeTime}
        releaseTime={releaseTime}
        attackLevel={attackLevel}
        breakPointLevel={breakPointLevel}
        sustainLevel={sustainLevel}
        releaseLevel={releaseLevel}
      />
      <br />
      <label>
        Attack Time
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={attackTime}
          onChange={(e) => setAttackTime(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Attack Level
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={attackLevel}
          onChange={(e) => setAttackLevel(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Decay Time
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={decayTime}
          onChange={(e) => setDecayTime(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Breakpoint Level
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={breakPointLevel}
          onChange={(e) => setBreakPointLevel(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Slope Time
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={slopeTime}
          onChange={(e) => setSlopeTime(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Sustain Level
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={sustainLevel}
          onChange={(e) => setSustainLevel(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Release Time
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={releaseTime}
          onChange={(e) => setReleaseTime(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Release Level
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={releaseLevel}
          onChange={(e) => setReleaseLevel(parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
};

interface EnvelopeInnerProps {
  bipolar?: boolean;
  attackTime: number;
  decayTime: number;
  slopeTime: number;
  releaseTime: number;
  attackLevel: number;
  breakPointLevel: number;
  sustainLevel: number;
  releaseLevel: number;
}

const EnvelopeADHSR = ({
  bipolar = true,
  attackTime,
  decayTime,
  slopeTime,
  releaseTime,
  attackLevel,
  breakPointLevel,
  sustainLevel,
  releaseLevel,
}: EnvelopeInnerProps) => {
  const paramWidth = 100;
  const sustainWidth = 50;
  const scale = bipolar ? 100 : 200;

  const attackTimeValue = attackTime * paramWidth;
  const attackLevelValue = (1 - attackLevel) * scale;
  const decayTimeValue = decayTime * paramWidth + attackTimeValue;
  const breakPointLevelValue = (1 - breakPointLevel) * scale;
  const slopeTimeValue = slopeTime * paramWidth + decayTimeValue;
  const sustainLevelValue = (1 - sustainLevel) * scale;
  const releaseTimeValue =
    releaseTime * paramWidth + slopeTimeValue + sustainWidth;
  const releaseLevelValue = (1 - releaseLevel) * scale;

  const pathVars = `M0 ${scale}L${attackTimeValue} ${attackLevelValue}L${decayTimeValue} ${breakPointLevelValue}L${slopeTimeValue} ${sustainLevelValue}H${
    slopeTimeValue + sustainWidth
  } L${releaseTimeValue} ${releaseLevelValue}`;

  return (
    <div>
      <svg
        viewBox="-1 -1 452 202"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.envelope}
      >
        <rect
          width="450"
          height="200"
          fill="white"
          className={classes.background}
        />
        <path
          d={`M0 ${scale}H450`}
          className={classes.lines}
          strokeDasharray="2.5,2.5"
        />
        <path d={pathVars} className={classes.lines} strokeWidth={2} />
        {/* <circle cx="13" cy="109" r="5" fill="#D9D9D9" />
        <circle cx="13" cy="109" r="2" fill="white" /> */}
      </svg>
    </div>
  );
};

export { EnvelopeTester, EnvelopeADHSR };
