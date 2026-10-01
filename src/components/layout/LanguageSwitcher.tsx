import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <Button onClick={() => void i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en')}>
      {i18n.language === 'en' ? 'မြန်မာ' : 'English'}
    </Button>
  );
}
