import { Heading } from './Heading';
import type { HeadingContentProps } from './types/headingTypes';
export function PageHeading(props: HeadingContentProps) {
  return <Heading {...props} level={1} />;
}
