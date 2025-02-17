import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from '@/components/ui/locale-select';

export default function LocaleSwitcher() {
	const locale = useLocale();

	return (
		<div className="flex items-center gap-2">
			<Globe className="text-muted-foreground h-4 w-4" />
			<LocaleSwitcherSelect defaultValue={locale} label="Select a locale">
				{routing.locales.map((cur) => (
					<option key={cur} value={cur}>
						{cur}
					</option>
				))}
			</LocaleSwitcherSelect>
		</div>
	);
}
