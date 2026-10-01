import { z } from 'zod';

// Optional while older local records / workspace RPC versions remain readable.
export const createdAtSchema = z.iso.datetime({ offset: true }).optional();
