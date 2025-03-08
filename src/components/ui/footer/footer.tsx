import React from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Instagram from '@/assets/instagram-logo.svg';
import Linkedin from '@/assets/linkedin-logo.svg';
import Github from '@/assets/github-logo.svg';
import Discord from '@/assets/discord-logo.svg';
import X from '@/assets/x-logo.svg';
import Notion from '@/assets/notion-logo.svg';
import { useTranslations } from 'next-intl';
import LocaleToggle from '@/components/utils/locale-toggle';

export default function Footer() {
	const t = useTranslations('Footer');

	const footerData = {
		logo: {
			name: t('logo'),
			href: '/',
		},
		p: {
			text: t('description'),
		},
		sections: [
			{
				title: t('sections.company.title'),
				links: [
					{
						name: t('sections.company.links.aboutUs'),
						href: '/about',
					},
					{
						name: t('sections.company.links.careers'),
						href: '/careers',
					},
					{ name: t('sections.company.links.press'), href: '/press' },
				],
			},
			{
				title: t('sections.resources.title'),
				links: [
					{ name: t('sections.resources.links.blog'), href: '/blog' },
					{
						name: t('sections.resources.links.helpCenter'),
						href: '/help',
					},
					{
						name: t('sections.resources.links.contactSupport'),
						href: '/support',
					},
				],
			},
			{
				title: t('sections.legal.title'),
				links: [
					{
						name: t('sections.legal.links.privacyPolicy'),
						href: '/privacy',
					},
					{
						name: t('sections.legal.links.termsOfService'),
						href: '/terms',
					},
					{
						name: t('sections.legal.links.cookiePolicy'),
						href: '/cookies',
					},
				],
			},
		],
		socials: [
			{
				icons: Github,
				name: t('socials.github'),
				href: '',
				color: 'bg-black dark:bg-white',
				textColor: 'text-white dark:text-black',
			},
			{
				icons: Linkedin,
				name: t('socials.linkedin'),
				href: '',
				color: 'bg-blue-600 dark:bg-blue-300',
				textColor: 'text-white dark:text-black',
			},
			{
				icons: Instagram,
				name: t('socials.instagram'),
				href: '',
				color: 'bg-pink-500 dark:bg-pink-300',
				textColor: 'text-white dark:text-black',
			},
			{
				icons: Discord,
				name: t('socials.discord'),
				href: '',
				color: 'bg-[#5865F2] dark:bg-[#7289da]',
				textColor: 'text-white dark:text-black',
			},
			{
				icons: X,
				name: t('socials.x'),
				href: '',
				color: 'bg-black dark:bg-white',
				textColor: 'text-white dark:text-black',
			},
			{
				icons: Notion,
				name: t('socials.notion'),
				href: '',
				color: 'bg-black dark:bg-white',
				textColor: 'text-white dark:text-black',
			},
		],
		madeBy: [
			{
				name: t('madeBy.aryanGulati'),
				href: '',
			},
			{
				name: t('madeBy.neelanjanMukherji'),
				href: '',
			},
		],
	};

	return (
		<footer
			className={cn(
				'px-4 py-8 md:px-10',
				'bg-white/30 backdrop-blur-md dark:bg-gray-950',
				'border-t border-gray-200 dark:border-gray-700',
				'shadow-[0_-35px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-35px_60px_-15px_rgba(255,255,255,0.1)]',
				'grid grid-cols-1 items-start justify-center gap-8 md:grid-cols-4'
			)}
		>
			<div className="col-span-1 text-center md:col-span-4 md:text-left">
				<Link href={footerData.logo.href}>
					<h1
						className={cn(
							'text-2xl font-bold text-gray-950 dark:text-white'
						)}
					>
						{footerData.logo.name}
					</h1>
				</Link>
				<p className="mx-6 mt-2 text-gray-950 md:mx-0 dark:text-gray-300">
					{footerData.p.text}
				</p>
			</div>
			{footerData.sections.map((section, index) => (
				<div
					key={index}
					className="col-span-1 flex flex-col items-center text-center md:items-start md:text-left"
				>
					<h2
						className={cn(
							'font-mono text-xl font-bold text-black dark:text-white'
						)}
					>
						{section.title}
					</h2>
					<div
						className={cn(
							'bg-black dark:bg-white',
							'h-0.5',
							'w-10'
						)}
					></div>
					<ul className={cn('mt-2 space-y-2')}>
						{section.links.map((link, index) => (
							<li key={index}>
								<Button
									variant="link"
									effect="hoverUnderline"
									className={cn('text-black dark:text-white')}
								>
									<Link href={link.href}>{link.name}</Link>
								</Button>
							</li>
						))}
					</ul>
				</div>
			))}

			<div>
				<h2
					className={cn(
						'flex flex-col items-center text-center font-mono text-xl font-bold text-black md:items-start md:text-left dark:text-white'
					)}
				>
					{t('socials.title')}
				</h2>
				<div
					className={cn(
						'mx-auto h-0.5 w-10 bg-black md:mx-0 dark:bg-white'
					)}
				></div>

				<ul
					className={cn(
						'mt-4 grid grid-cols-3 items-center justify-center gap-4 md:grid-cols-3'
					)}
				>
					{footerData.socials.map((social, index) => (
						<li
							key={index}
							className="col-span-1 flex flex-col items-center justify-center gap-3"
						>
							<Link
								href={social.href}
								className={cn('block')}
								target="_blank"
							>
								<Button
									className={cn(
										'flex h-10 w-10 items-center justify-center rounded-full p-2 md:h-12 md:w-12',
										social.color,
										social.textColor
									)}
									variant="link"
									effect="ringHover"
								>
									<social.icons className="h-6 w-6 md:h-8 md:w-8" />
								</Button>
							</Link>
							<span className="text-center text-sm md:hidden">
								{social.name}
							</span>
						</li>
					))}
				</ul>
			</div>
			<div className="col-span-1 mt-4 flex flex-col items-center justify-center space-y-2 border-t border-gray-200 pt-4 md:col-span-4 md:flex-row md:justify-between md:space-y-0 dark:border-gray-700">
				<p
					className={cn(
						'text-center text-gray-500 md:text-left dark:text-gray-400'
					)}
				>
					&copy; {new Date().getFullYear()} {footerData.logo.name}.
					{t('allRightsReserved')}
				</p>
				<p
					className={cn(
						'text-center text-gray-500 md:text-right dark:text-gray-400'
					)}
				>
					{t('designedAndDevelopedBy')}{' '}
					{footerData.madeBy.map((madeBy, index) => (
						<React.Fragment key={index}>
							<Button variant="link" effect="hoverUnderline">
								<Link href={madeBy.href}>{madeBy.name}</Link>
							</Button>
							{index < footerData.madeBy.length - 1 && (
								<span className="hidden md:inline">
									&nbsp;&amp;&nbsp;
								</span>
							)}
							{index < footerData.madeBy.length - 1 && (
								<span className="inline md:hidden">
									&nbsp;/&nbsp;
								</span>
							)}
						</React.Fragment>
					))}
				</p>
				<LocaleToggle />
			</div>
		</footer>
	);
}
