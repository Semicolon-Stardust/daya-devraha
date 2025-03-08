import Footer from '@/components/ui/footer/footer';
import Header from '@/components/ui/header/header';
import React from 'react';

interface HomeLayoutProps {
	children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
	return (
		<html>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
