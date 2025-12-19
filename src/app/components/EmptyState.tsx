type EmptyStateProps = {
  title: string;
  message: string;
};

export const EmptyState = ({ title, message }: EmptyStateProps) => (
  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/70 p-6 text-center">
    <h3 className="font-display text-lg text-slate-100">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{message}</p>
  </div>
);
