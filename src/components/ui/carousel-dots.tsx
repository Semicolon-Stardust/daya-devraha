'use client';

import * as React from 'react';
import { type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import { CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface CarouselDotsProps {
  numberOfSlides: number;
  api?: CarouselApi; // Pass the carousel API as a prop
}

export function CarouselDots({ numberOfSlides, api }: CarouselDotsProps) {
  const [current, setCurrent] = React.useState(0);

  // Update the current slide when the carousel API is available
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleDotClick = (index: number) => {
    api?.scrollTo(index); // Navigate to the selected slide
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {Array.from({ length: numberOfSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => handleDotClick(index)}
          className={cn(
            'h-3 w-3 rounded-full transition-colors',
            current === index ? 'bg-white' : 'bg-gray-500',
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
      <CarouselPrevious />
      <CarouselNext />
    </div>
  );
}
