import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from '@/components/ui/accordion';

interface AccordionData {
	id: string;
	title: string;
	content: string;
}

interface DynamicAccordionProps {
	items: AccordionData[];
}

export default function DynamicAccordion({ items }: DynamicAccordionProps) {
	return (
		<Accordion type="single" collapsible>
			{items.map((item) => (
				<AccordionItem key={item.id} value={item.id}>
					<AccordionTrigger className="flex items-center justify-between py-4 text-lg font-medium text-gray-900 transition-colors duration-300 hover:text-gray-950">
						{item.title}
					</AccordionTrigger>
					<AccordionContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm">
						<div className="pt-0 pb-4">{item.content}</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
