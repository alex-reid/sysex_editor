import useStore from "../../../store/store";
import { EnvelopeADHSR } from "./Envelope";
interface EnvWithIDsProps {
  attackTimeID: number;
  decayTimeID: number;
  slopeTimeID: number;
  releaseTimeID: number;
  attackLevelID: number;
  breakPointLevelID: number;
  sustainLevelID: number;
  releaseLevelID: number;
}
const EnvWithIDs = ({
  attackTimeID,
  decayTimeID,
  slopeTimeID,
  releaseTimeID,
  attackLevelID,
  breakPointLevelID,
  sustainLevelID,
  releaseLevelID,
}: EnvWithIDsProps) => {
  const attackTime = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === attackTimeID)?.parameterValue
  );
  const decayTime = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === decayTimeID)?.parameterValue
  );
  const slopeTime = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === slopeTimeID)?.parameterValue
  );
  const releaseTime = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === releaseTimeID)
        ?.parameterValue
  );
  const attackLevel = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === attackLevelID)
        ?.parameterValue
  );
  const breakPointLevel = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === breakPointLevelID)
        ?.parameterValue
  );
  const sustainLevel = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === sustainLevelID)
        ?.parameterValue
  );
  const releaseLevel = useStore(
    (state) =>
      state.programParameters.find((p) => p.id === releaseLevelID)
        ?.parameterValue
  );
  return (
    <EnvelopeADHSR
      bipolar={true}
      attackTime={(attackTime || 0) * 0.01}
      decayTime={(decayTime || 0) * 0.01}
      slopeTime={(slopeTime || 0) * 0.01}
      releaseTime={(releaseTime || 0) * 0.01}
      attackLevel={(attackLevel || 0) * 0.01}
      breakPointLevel={(breakPointLevel || 0) * 0.01}
      sustainLevel={(sustainLevel || 0) * 0.01}
      releaseLevel={(releaseLevel || 0) * 0.01}
    />
  );
};

export default EnvWithIDs;
