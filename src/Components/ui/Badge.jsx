const styles = {
  BOOKED: 'bg-info/10 text-info',
  CONFIRMED: 'bg-success/10 text-success',
  COMPLETED: 'bg-ink-muted/10 text-ink-muted',
  CANCELLED: 'bg-danger/10 text-danger',
  REJECTED: 'bg-danger/10 text-danger',
  NO_SHOW: 'bg-warning/10 text-warning',
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status] || 'bg-border text-ink-muted'}`}>
      {status}
    </span>
  );
}