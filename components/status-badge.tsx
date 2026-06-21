export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    'pending-payment': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending Payment',
    },
    'payment-uploaded': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Payment Uploaded',
    },
    confirmed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Confirmed',
    },
    completed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled',
    },
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Active',
    },
    suspended: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Suspended',
    },
  };

  const config = statusConfig[status] || statusConfig['pending-payment'];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
