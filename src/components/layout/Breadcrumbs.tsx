import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { BreadcrumbItem } from './types/layoutTypes';
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('Breadcrumb')} className="breadcrumbs">
      {items.map((item, index) => (
        <span key={item.path}>
          {index > 0 && <ChevronRight size={13} />}
          <Link to={item.path} aria-current={index === items.length - 1 ? 'page' : undefined}>
            {t(item.name)}
          </Link>
        </span>
      ))}
    </nav>
  );
}
