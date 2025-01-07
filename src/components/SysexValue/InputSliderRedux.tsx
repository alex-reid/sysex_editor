import { useEffect, useRef, useState } from "react";
import { useWebMidi } from "../../contexts/webmidi";
import { splitValInto7bitArray } from "../../utils/converters";
import { MAX_PARAMETER_VALUE } from "../../constants/x5dr/midiinfo";
import { useAppDispatch, useAppSelector } from "../../utils/reduxHooks";
import { selectParameterById, updateParameter } from "../../redux/parameters";

const InputSliderRedux = ({
  functionCode,
  id,
}: {
  functionCode: number;
  id: string;
}) => {
  const parameter = useAppSelector((state) => selectParameterById(state, id));
  const dispatch = useAppDispatch();
  const { sendSysexMessage } = useWebMidi();

  const timeoutRef = useRef(setTimeout(() => {}, 0));

  const { enabled, label, value, valueFrom, valueTo, sysexOutParamVal } =
    parameter!;
  // console.log(id, enabled, label, value);

  useEffect(() => {
    console.log(id, "value", value);
  }, [id, value]);
  useEffect(() => {
    console.log(id, "enabled", enabled);
  }, [enabled, id]);
  useEffect(() => {
    console.log(id, "label", label);
  }, [id, label]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      let outputValue = value || 0;
      if (outputValue < 0) {
        outputValue += MAX_PARAMETER_VALUE;
      }
      // console.log("sent", outputValue);
      sendSysexMessage(functionCode, [
        ...splitValInto7bitArray(sysexOutParamVal.ParamNo),
        ...splitValInto7bitArray(outputValue),
      ])
        .then(() => {
          // console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 30);

    return () => clearTimeout(timeoutRef.current);
  }, [
    value,
    functionCode,
    parameter,
    sendSysexMessage,
    sysexOutParamVal.ParamNo,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateParameter({
        id: id,
        action: {
          type: "parameter/setValue",
          payload: parseInt(e.target.value, 10),
        },
      })
    );
  };

  return (
    <div>
      <label>
        {label}
        <br />
        <input
          type="range"
          min={valueFrom || 0}
          max={valueTo || 0}
          onChange={handleChange}
          value={value}
        />
        <input type="number" value={value} readOnly style={{ width: "2rem" }} />
      </label>
    </div>
  );
};

export default InputSliderRedux;
