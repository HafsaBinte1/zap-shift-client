export default function Spinner({ full = false }) {
  if (full) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }
  return <span className="loading loading-spinner loading-md text-primary" />;
}
