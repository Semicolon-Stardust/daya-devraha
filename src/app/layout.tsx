// Since we have a root `not-found.tsx` page, a layout file
// is required, even if it's just passing children through.
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
	return children;
}
