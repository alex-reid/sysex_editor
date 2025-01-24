import useStore from "../../store/store";

export function InputLabel({ name }: { name: string }) {
  const params = useStore((state) => state.getParameterByName(name));
  if (!params) {
    return null;
  }
  return (
    <div
      style={{
        width: "100%",
        gridColumnStart: 1,
        gridColumnEnd: -1,
      }}
    >
      <h4>{params.label}</h4>
    </div>
  );
}
