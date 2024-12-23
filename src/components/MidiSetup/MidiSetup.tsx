import { useWebMidi } from "../../contexts/webmidi";

export function MidiSetup() {
  const {
    midiInputs,
    midiOutputs,
    handleInputChange,
    handleOutputChange,
    currentInput,
    currentOutput,
    sendCMajorChord,
  } = useWebMidi();

  return (
    <div>
      Midi options:
      <label>
        Input:
        <select
          onChange={(e) => handleInputChange(e.target.value)}
          value={currentInput?.id}
        >
          <option value="">Select an input</option>
          {midiInputs &&
            midiInputs.map((input, index) => (
              <option key={index} value={input.id}>
                {input.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Output:
        <select
          onChange={(e) => handleOutputChange(e.target.value)}
          value={currentOutput?.id}
        >
          <option value="">Select an output</option>
          {midiOutputs &&
            midiOutputs.map((output, index) => (
              <option key={index} value={output.id}>
                {output.name}
              </option>
            ))}
        </select>
      </label>
      <button onClick={sendCMajorChord}>Send C Major Chord</button>
    </div>
  );
}
