export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}
