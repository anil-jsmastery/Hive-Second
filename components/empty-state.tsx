import type { ReactNode } from 'react';

export function EmptyState({ title, body, action, small = false }: {
  title: string;
  body: string;
  action?: ReactNode;
  small?: boolean;
}) {
  return (
    <div className={small ? 'empty small' : 'empty'}>
      <strong>{title}</strong>
      {body}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
