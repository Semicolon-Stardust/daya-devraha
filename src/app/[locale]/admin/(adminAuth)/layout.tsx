import Footer from '@/components/ui/footer/footer';
import Header from '@/components/ui/header/header';
import { ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div>
			<Header
				links={[
					{ linkName: 'Home', href: '/' },
					{ linkName: 'About', href: '/about' },
					{ linkName: 'Contact', href: '/contact' },
				]}
				ctaButtons={[
					{
						href: '/admin/login',
						label: 'Login',
						variant: 'outline',
						effect: 'hoverUnderline',
					},
					{
						href: '/admin/register',
						label: 'Register',
						variant: 'default',
						effect: 'hoverUnderline',
					},
				]}
			/>
			{children}
			<Footer />
		</div>
	);
}
