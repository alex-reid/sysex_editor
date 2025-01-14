import x5dr from "../constants/x5dr/x5drConfig.json";

export const GenerateVoice2ParamsFromJSON = () => {
  const voice1 = x5dr.parameters.find((p) => p.name === "VOICE_1")?.children;
  const voice2 = x5dr.parameters.find((p) => p.name === "VOICE_2")?.children;
  // eslint-disable-next-line
  const [v1OSC, v1VDF, v1VDA] = voice1 || [];
  // eslint-disable-next-line
  const [v2OSC, v2VDF, v2VDA] = voice2 || [];
  // map all parameters form v1osc to v2osc where the name is the same
  // eslint-disable-next-line
  const v2Params = v1VDA?.children?.map((p) => {
    // eslint-disable-next-line
    const v2Param = v2VDA?.children?.find((v2p) => v2p.name === p.name);
    return {
      ...p,
      sysexOutParamVal: v2Param?.sysexOutParamVal,
      dumpParamVal: {
        ...p.dumpParamVal,
        ParamNo: p.dumpParamVal.ParamNo + 47,
      },
    };
  });
  return (
    <div style={{ textAlign: "left" }}>
      <h2>Generate Voice 2 Parameters from Voice 1</h2>
      <h3>Parameters:</h3>
      <pre>{JSON.stringify(v2Params, null, 2)}</pre>
    </div>
  );
};
