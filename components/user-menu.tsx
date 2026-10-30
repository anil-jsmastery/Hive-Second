'use client';
import { UserButton } from '@clerk/nextjs';
import { UserIcon } from 'lucide-react';

// Clerk only recognizes UserButton's custom menu items inside a client component.
export function UserMenu({ handle }: { handle: string | null }) {
  return (
    <UserButton>
      {handle && (
        <UserButton.MenuItems>
          <UserButton.Link label="Profile" labelIcon={<UserIcon className="size-4" />} href={`/u/${handle}`} />
        </UserButton.MenuItems>
      )}
    </UserButton>
  );
}
