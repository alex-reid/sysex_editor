// import x5dr from "../constants/x5dr/x5drConfig.json";

// export const GenerateVoice2ParamsFromJSON = () => {
//   const voice1 = x5dr.parameters.find((p) => p.name === "VOICE_1")?.children;
//   const voice2 = x5dr.parameters.find((p) => p.name === "VOICE_2")?.children;
//   // eslint-disable-next-line
//   const [v1OSC, v1VDF, v1VDA] = voice1 || [];
//   // eslint-disable-next-line
//   const [v2OSC, v2VDF, v2VDA] = voice2 || [];
//   // map all parameters form v1osc to v2osc where the name is the same
//   // eslint-disable-next-line
//   const v2Params = v1VDA?.children?.map((p) => {
//     // eslint-disable-next-line
//     const v2Param = v2VDA?.children?.find((v2p) => v2p.name === p.name);
//     return {
//       ...p,
//       sysexOutParamVal: v2Param?.sysexOutParamVal,
//       dumpParamVal: {
//         ...p.dumpParamVal,
//         ParamNo: p.dumpParamVal.ParamNo + 47,
//       },
//     };
//   });
//   return (
//     <div style={{ textAlign: "left" }}>
//       <h2>Generate Voice 2 Parameters from Voice 1</h2>
//       <h3>Parameters:</h3>
//       <pre>{JSON.stringify(v2Params, null, 2)}</pre>
//     </div>
//   );
// };

// export const GenerateEffectsParams = () => {
//   const builtEffects = Effects.map((effect) => {
//     const out = {
//       name: effect.name.replace(/\s/g, "_"),
//       label: effect.name.toLocaleLowerCase(),
//       sysexOutParamVal: {
//         prog: effect.prog,
//         combi: effect.combi,
//         multi: effect.multi,
//       },
//     };
//     if (effect.children) {
//       out.children = effect.children.map((child) => {
//         return {
//           name: child.name.replace(/\s/g, "_"),
//           label: child.name.toLocaleLowerCase(),
//           sysexOutParamVal: {
//             prog: child.prog,
//             combi: child.combi,
//             multi: child.multi,
//           },
//         };
//       });
//     }

//     return out;
//   });
//   return (
//     <div style={{ textAlign: "left" }}>
//       <h2>Generate Effects Parameters</h2>
//       <h3>Parameters:</h3>
//       <pre>{JSON.stringify(builtEffects, null, 2)}</pre>
//     </div>
//   );
// };

// const buildNewParam = (param) => {
//   const newParam = { ...param };
//   if (newParam.inputType) {
//     newParam.inputSettings = {};
//     if (newParam.values) {
//       // deep copy values
//       newParam.inputSettings.values = JSON.parse(
//         JSON.stringify(newParam.values)
//       );
//       delete newParam.values;
//     }
//     if (newParam.valuesConstant) {
//       newParam.inputSettings.valuesConstant = newParam.valuesConstant;
//       delete newParam.valuesConstant;
//     }
//     if (newParam.hasOwnProperty("valueFrom")) {
//       newParam.inputSettings.valueFrom = newParam.valueFrom;
//       delete newParam.valueFrom;
//     }
//     if (newParam.hasOwnProperty("valueTo")) {
//       newParam.inputSettings.valueTo = newParam.valueTo;
//       delete newParam.valueTo;
//     }
//   }
//   return newParam;
// };
// // recursively rebuild the inputs json
// export const rebuildInputsJSON = (json) => {
//   const newJson = json.map((param) => {
//     const newParam = { ...param };
//     if (newParam.children) {
//       newParam.children = rebuildInputsJSON([...newParam.children]);
//       return newParam;
//     }
//     return buildNewParam(newParam);
//   });
//   return newJson;
// };

// const Effects = [
//   {
//     name: "EFFECT 1 TYPE",
//     label: "",
//     prog: 155,
//     combi: 136,
//     multi: 144,
//   },
//   {
//     name: "EFFECT 2 TYPE",
//     label: "",
//     prog: 156,
//     combi: 137,
//     multi: 145,
//   },
//   {
//     name: "EFFECT 1 OFF ON",
//     label: "",
//     prog: 157,
//     combi: 138,
//     multi: 146,
//   },
//   {
//     name: "EFFECT 2 OFF ON",
//     label: "",
//     prog: 158,
//     combi: 139,
//     multi: 147,
//   },
//   {
//     name: "OUT3 PANPOT (Seri, Paral, 2)",
//     label: "",
//     prog: 159,
//     combi: 140,
//     multi: 148,
//   },
//   {
//     name: "OUT4 PANPOT (Seri, Paral,2)",
//     label: "",
//     prog: 160,
//     combi: 141,
//     multi: 149,
//   },
//   {
//     name: "OUT 3-L LEVEL (Para3)",
//     label: "",
//     prog: 161,
//     combi: 142,
//     multi: 150,
//   },
//   {
//     name: "OUT 3-R LEVEL (Para3)",
//     label: "",
//     prog: 162,
//     combi: 143,
//     multi: 151,
//   },
//   {
//     name: "OUT 4-L LEVEL (Para3)",
//     label: "",
//     prog: 163,
//     combi: 144,
//     multi: 152,
//   },
//   {
//     name: "OUT 4-R LEVEL (Para3)",
//     label: "",
//     prog: 164,
//     combi: 145,
//     multi: 153,
//   },
//   {
//     name: "PLACEMENT",
//     label: "",
//     prog: 165,
//     combi: 146,
//     multi: 154,
//   },
//   {
//     name: "EFFECT 1",
//     label: "",
//     children: [
//       {
//         name: "DYNAMIC MOD SOURCE",
//         label: "",
//         prog: 166,
//         combi: 147,
//         multi: 155,
//       },
//       {
//         name: "DYNAMIC MOD INT",
//         label: "",
//         prog: 167,
//         combi: 148,
//         multi: 156,
//       },
//       {
//         name: "PARAMETER 1",
//         label: "",
//         prog: 168,
//         combi: 149,
//         multi: 157,
//       },
//       {
//         name: "PARAMETER 2",
//         label: "",
//         prog: 169,
//         combi: 150,
//         multi: 158,
//       },
//       {
//         name: "PARAMETER 3",
//         label: "",
//         prog: 170,
//         combi: 151,
//         multi: 159,
//       },
//       {
//         name: "PARAMETER 4",
//         label: "",
//         prog: 171,
//         combi: 152,
//         multi: 160,
//       },
//       {
//         name: "PARAMETER 5",
//         label: "",
//         prog: 172,
//         combi: 153,
//         multi: 161,
//       },
//       {
//         name: "PARAMETER 6",
//         label: "",
//         prog: 173,
//         combi: 154,
//         multi: 162,
//       },
//       {
//         name: "PARAMETER 7",
//         label: "",
//         prog: 174,
//         combi: 155,
//         multi: 163,
//       },
//       {
//         name: "BALANCE 1",
//         label: "",
//         prog: 175,
//         combi: 156,
//         multi: 164,
//       },
//       {
//         name: "BALANCE 2",
//         label: "",
//         prog: 176,
//         combi: 157,
//         multi: 165,
//       },
//     ],
//   },
//   {
//     name: "EFFECT 2",
//     label: "",
//     children: [
//       {
//         name: "DYNAMIC MOD SOURCE",
//         label: "",
//         prog: 177,
//         combi: 158,
//         multi: 166,
//       },
//       {
//         name: "DYNAMIC MOD INT",
//         label: "",
//         prog: 178,
//         combi: 159,
//         multi: 167,
//       },
//       {
//         name: "PARAMETER 1",
//         label: "",
//         prog: 179,
//         combi: 160,
//         multi: 168,
//       },
//       {
//         name: "PARAMETER 2",
//         label: "",
//         prog: 180,
//         combi: 161,
//         multi: 169,
//       },
//       {
//         name: "PARAMETER 3",
//         label: "",
//         prog: 181,
//         combi: 162,
//         multi: 170,
//       },
//       {
//         name: "PARAMETER 4",
//         label: "",
//         prog: 182,
//         combi: 163,
//         multi: 171,
//       },
//       {
//         name: "PARAMETER 5",
//         label: "",
//         prog: 183,
//         combi: 164,
//         multi: 172,
//       },
//       {
//         name: "PARAMETER 6",
//         label: "",
//         prog: 184,
//         combi: 165,
//         multi: 173,
//       },
//       {
//         name: "PARAMETER 7",
//         label: "",
//         prog: 185,
//         combi: 166,
//         multi: 174,
//       },
//       {
//         name: "BALANCE 1",
//         label: "",
//         prog: 186,
//         combi: 167,
//         multi: 175,
//       },
//       {
//         name: "BALANCE 2",
//         label: "",
//         prog: 187,
//         combi: 168,
//         multi: 176,
//       },
//     ],
//   },
// ];
