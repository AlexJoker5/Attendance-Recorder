import { ENROLLMENT_STATUSES } from '../const/enrollmentStatus';
export type Lifecycle = (typeof ENROLLMENT_STATUSES)[number];
export interface Enrollment {
  id: string;
  createdAt?: string;
  studentId: string;
  groupId: string;
  semesterId: string;
  joined: string;
  status: Lifecycle;
  history: { at: string; status: Lifecycle; reason: string }[];
}
