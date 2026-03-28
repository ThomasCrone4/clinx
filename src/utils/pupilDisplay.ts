import type { DemoAccount, Pupil, UserRole } from '../types/domain';

export function canViewPupilNames(role?: UserRole | null): boolean {
  return role === 'schoolAdmin' || role === 'teacher';
}

export function getPupilPrimaryLabel(pupil: Pupil, viewer?: DemoAccount | null): string {
  return canViewPupilNames(viewer?.role) ? pupil.fullName : pupil.id;
}

export function getPupilSecondaryLabel(pupil: Pupil, viewer?: DemoAccount | null): string {
  return canViewPupilNames(viewer?.role) ? pupil.id : `Year ${pupil.year} · Form ${pupil.form}`;
}

export function matchesPupilSearch(pupil: Pupil, query: string, viewer?: DemoAccount | null): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  if (canViewPupilNames(viewer?.role)) {
    return (
      pupil.id.toLowerCase().includes(normalized) ||
      pupil.fullName.toLowerCase().includes(normalized) ||
      pupil.preferredName.toLowerCase().includes(normalized)
    );
  }

  return pupil.id.toLowerCase().includes(normalized);
}
