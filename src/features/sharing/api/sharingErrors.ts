export class PublicShareError extends Error {
  constructor(public readonly status: number) {
    super(
      status === 403
        ? 'This shared page is unavailable.'
        : 'The shared class could not be loaded. Please try again.',
    );
    this.name = 'PublicShareError';
  }
}
