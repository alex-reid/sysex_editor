const buildVars = (vars) => {
  const params = [];
  for (const key in vars) {
    if (typeof vars[key] === "object") {
      params.push({ name: key, children: buildVars(vars[key]) });
    } else {
      params.push({
        name: key,
        sysexOutParamVal: { type: "single", ParamNo: vars[key] },
        dumpParamVal: { type: "single", ParamNo: 0 },
      });
    }
  }
  return params;
};

export default buildVars;
