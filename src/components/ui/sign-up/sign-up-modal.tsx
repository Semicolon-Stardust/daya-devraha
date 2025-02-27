'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SignUpForm from '@/components/ui/sign-up/sign-up-form';
import { useTranslations } from 'next-intl';

interface SignUpModalProps {
  buttonVariant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  buttonEffect:
    | 'expandIcon'
    | 'ringHover'
    | 'shine'
    | 'shineHover'
    | 'gooeyRight'
    | 'gooeyLeft'
    | 'underline'
    | 'hoverUnderline'
    | null
    | undefined;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  buttonVariant,
  buttonEffect,
}) => {
  const t = useTranslations('SignUp');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} effect={buttonEffect}>
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <SignUpForm />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
