'use client';

import { motion } from 'framer-motion';

export default function SettingsPage() {
	return (
		<motion.div
			className=""
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className="mt-4 text-lg text-black dark:text-white">
				Welcome to your settings. Use the sidebar to navigate between
				sections.
			</p>
		</motion.div>
	);
}
