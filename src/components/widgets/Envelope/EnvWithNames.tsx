import useStore from "../../../store/store";
import { EnvelopeADHSR } from "./Envelope";
interface EnvWithNamesProps {
  attackTimeName: string;
  decayTimeName: string;
  slopeTimeName: string;
  releaseTimeName: string;
  attackLevelName: string;
  breakPointLevelName: string;
  sustainLevelName: string;
  releaseLevelName: string;
}
const EnvWithNames = ({
  attackTimeName,
  decayTimeName,
  slopeTimeName,
  releaseTimeName,
  attackLevelName,
  breakPointLevelName,
  sustainLevelName,
  releaseLevelName,
}: EnvWithNamesProps) => {
  const attackTime = useStore((state) =>
    state.getParameterValueByName(attackTimeName)
  );
  const decayTime = useStore((state) =>
    state.getParameterValueByName(decayTimeName)
  );
  const slopeTime = useStore((state) =>
    state.getParameterValueByName(slopeTimeName)
  );
  const releaseTime = useStore((state) =>
    state.getParameterValueByName(releaseTimeName)
  );
  const attackLevel = useStore((state) =>
    state.getParameterValueByName(attackLevelName)
  );
  const breakPointLevel = useStore((state) =>
    state.getParameterValueByName(breakPointLevelName)
  );
  const sustainLevel = useStore((state) =>
    state.getParameterValueByName(sustainLevelName)
  );
  const releaseLevel = useStore((state) =>
    state.getParameterValueByName(releaseLevelName)
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

export default EnvWithNames;
