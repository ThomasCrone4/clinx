import { useMemo } from 'react';
import PupilTable from '../pupils/PupilTable';
import { useAuth } from '../../context/AuthContext';
import { getClassesForTeacher, getPupilsByIds } from '../../services/dataService';

export default function MyPupilsPage() {
  const { user } = useAuth();
  const teacherClasses = getClassesForTeacher(user?.teacherId || '');

  const pupils = useMemo(() => {
    const pupilIds = new Set<string>();
    teacherClasses.forEach((schoolClass) => {
      schoolClass.pupils.forEach((pupilId) => pupilIds.add(pupilId));
    });
    return getPupilsByIds([...pupilIds]);
  }, [teacherClasses]);

  return (
    <PupilTable
      basePath="/teacher"
      pupils={pupils}
      title="My Pupils"
      description="Pupils across all of your classes"
      classFilterOptions={teacherClasses.map((schoolClass) => ({
        id: schoolClass.id,
        name: schoolClass.name,
      }))}
      classFilterLabel="All Classes"
    />
  );
}
