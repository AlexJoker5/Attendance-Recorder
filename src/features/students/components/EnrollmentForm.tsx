import { RecordForm } from '@/components/ui/RecordForm';
import { useEnrollmentForm } from '../hooks/useEnrollmentForm';
import { enrollmentSchema } from '../schemas/enrollmentSchema';
export function EnrollmentForm(props: Parameters<typeof useEnrollmentForm>[0]) {
  const model = useEnrollmentForm(props);
  if (!model) return null;
  const { t, studentId, groupId, groups, semester, students, saveStudent } = model;
  return (
    <>
      <p className="callout mb-5">
        {t(
          'Enrollment includes all group classes. Earlier finalized regular sessions receive Present credit.',
        )}
      </p>
      <RecordForm
        schema={enrollmentSchema}
        defaults={{
          studentId: studentId || '',
          groupId: groupId || groups[0]?.id || '',
          joined: semester.start,
        }}
        fields={[
          {
            name: 'studentId',
            label: 'Registered student',
            type: 'select',
            options: [
              { value: '', label: 'Choose student' },
              ...students.map((student) => ({
                value: student.id,
                label: student.name + ' · ' + student.email,
              })),
            ],
          },
          {
            name: 'groupId',
            label: 'Group',
            type: 'select',
            options: groups.map((group) => ({ value: group.id, label: group.name })),
          },
          {
            name: 'joined',
            label: 'Enrollment date',
            type: 'date',
            min: semester.start,
            max: semester.end,
          },
        ]}
        label="Enroll student"
        onSave={saveStudent}
      />
    </>
  );
}
