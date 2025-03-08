'use client';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Button } from '../button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@/components/utils/mode-toggle';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const menuVariants = {
	open: {
		opacity: 1,
		height: 'auto',
		transition: {
			duration: 0.5,
			ease: 'easeInOut',
		},
	},
	closed: {
		opacity: 0,
		height: 0,
		transition: {
			duration: 0.5,
			ease: 'easeInOut',
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const hoverVariants = {
	hover: { fontFamily: 'font-mono', transition: { duration: 0.3 } },
};

interface LinkItem {
	linkName: string;
	href: string;
}

interface CTAButton {
	href: string;
	label: string;
	variant?:
		| 'link'
		| 'outline'
		| 'default'
		| 'destructive'
		| 'secondary'
		| 'ghost';
	effect?:
		| 'underline'
		| 'expandIcon'
		| 'ringHover'
		| 'shine'
		| 'shineHover'
		| 'gooeyRight'
		| 'gooeyLeft'
		| 'hoverUnderline'
		| null
		| undefined;
}

interface HeaderProps {
	links: LinkItem[];
	ctaButtons: CTAButton[]; // New prop for CTA buttons
}

export default function Header({ links, ctaButtons }: HeaderProps) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
			className={cn(
				'fixed top-0 left-0 z-50 w-full bg-white select-none dark:bg-black',
				scrolled
					? 'border-b border-gray-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-md transition-shadow duration-500 dark:border-gray-700 dark:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)]'
					: 'transition-shadow duration-500'
			)}
		>
			<Navbar links={links} ctaButtons={ctaButtons} />
		</motion.header>
	);
}

interface NavbarProps {
	links: LinkItem[];
	ctaButtons: CTAButton[]; // Prop drilling CTA buttons
}

function Navbar({ links, ctaButtons }: NavbarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslations('Header');

	return (
		<motion.div
			initial={false}
			animate={isOpen ? 'open' : 'closed'}
			className={cn(
				'flex flex-col items-center justify-between px-5 py-1 md:flex-row md:px-20 lg:px-40'
			)}
		>
			<motion.div
				initial="hidden"
				animate="visible"
				variants={itemVariants}
				className="flex w-full items-center justify-between md:w-auto"
			>
				<Link href="/" className="flex items-center gap-1">
					<Image
						src="/daya-logo.svg"
						alt="Daya Logo"
						width={70}
						height={70}
						priority
					/>
					<h1
						className={cn(
							'text-2xl font-bold text-black lg:text-3xl dark:text-white'
						)}
					>
						{t('logo')}
					</h1>
				</Link>
				<div className="md:hidden">
					<Button
						variant={'link'}
						effect={'shine'}
						className="bg-black text-lg font-[300] text-white dark:bg-white dark:text-black"
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? <X size={30} /> : <Menu size={30} />}
					</Button>
				</div>
			</motion.div>

			<motion.div
				initial="hidden"
				animate="visible"
				variants={{
					...itemVariants,
					visible: {
						...itemVariants.visible,
						transition: {
							...itemVariants.visible.transition,
							delay: 0.2,
						},
					},
				}}
				className="hidden items-center gap-5 md:flex"
			>
				<Links links={links} />
				<CTAButtons buttons={ctaButtons} />
				<ModeToggle />
			</motion.div>
			<motion.div
				initial={false}
				animate={isOpen ? 'open' : 'closed'}
				variants={menuVariants}
				className={cn('flex w-full flex-col md:hidden')}
			>
				<AnimatePresence>
					{isOpen && (
						<MobileLinks links={links} ctaButtons={ctaButtons} />
					)}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}

interface LinkProps {
	links: LinkItem[];
}

function Links({ links }: LinkProps) {
	return (
		<ul className={cn('flex items-center')}>
			{links.map((link) => (
				<motion.li
					key={link.href}
					initial="hidden"
					animate="visible"
					variants={{
						...itemVariants,
						visible: {
							...itemVariants.visible,
							transition: {
								...itemVariants.visible.transition,
								delay: 0.3,
							},
						},
					}}
				>
					<motion.div whileHover="hover" variants={hoverVariants}>
						<Button
							variant={'link'}
							effect={'hoverUnderline'}
							className="text-lg font-[300] text-black dark:text-white"
						>
							<Link href={link.href}>{link.linkName}</Link>
						</Button>
					</motion.div>
				</motion.li>
			))}
		</ul>
	);
}

interface MobileLinksProps {
	links: LinkItem[];
	ctaButtons: CTAButton[]; // Prop drilling CTA buttons for mobile view
}

function MobileLinks({ links, ctaButtons }: MobileLinksProps) {
	return (
		<motion.nav
			initial={false}
			animate={'open'}
			exit={'closed'}
			variants={menuVariants}
			className={cn('mt-10 flex flex-col items-center gap-5')}
		>
			<Links links={links} />
			<CTAButtons buttons={ctaButtons} />
			<ModeToggle />
		</motion.nav>
	);
}

interface CTAButtonsProps {
	buttons: CTAButton[];
}

function CTAButtons({ buttons }: CTAButtonsProps) {
	return (
		<div className={cn('flex gap-5')}>
			{buttons.map((button, index) => (
				<Link key={index} href={button.href}>
					<Button variant={button.variant} effect={button.effect}>
						{button.label}
					</Button>
				</Link>
			))}
		</div>
	);
}
