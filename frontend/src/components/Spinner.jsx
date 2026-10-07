export default function Spinner({ full = false }) {
  if (full) {
    return (
      <div className="spinner-full">
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="spinner-inline">
      <div className="spinner" />
    </div>
  );
}
