import { Heading } from './Heading';
import type { HeadingContentProps } from './types/headingTypes';
export function SectionHeading(props: HeadingContentProps) {
  return <Heading {...props} level={2} />;
}
