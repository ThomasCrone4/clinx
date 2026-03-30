import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { GuidedTourStep, UserRole } from '../../types/domain';

type GuidedTourModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
};

const stepsByRole: Record<UserRole, GuidedTourStep[]> = {
  siteAdmin: [
    {
      path: '/admin',
      title: 'Site Dashboard',
      description: 'This is the internal Clinx view for platform health, model posture, and rollout oversight.',
    },
    {
      path: '/admin/schools',
      title: 'Schools',
      description: 'Use this page to review the live school portfolio and open school-specific support views.',
    },
    {
      path: '/admin/onboarding',
      title: 'Onboarding Hub',
      description: 'This is where Clinx coordinates rollout, integrations, training readiness, and school setup.',
    },
  ],
  schoolAdmin: [
    {
      path: '/dashboard',
      title: 'School Dashboard',
      description: 'Start here to see school-wide priorities, year groups to watch, and the pupils most likely to need support.',
    },
    {
      path: '/dashboard/pupils',
      title: 'All Pupils',
      description: 'Use the pupil list to explore individual profiles, likely concerns, and supporting context in more detail.',
    },
    {
      path: '/dashboard/alerts',
      title: 'Alerts',
      description: 'Use this page to review flagged pupils quickly, mark alerts as seen, and open the relevant pupil context.',
    },
    {
      path: '/dashboard/staff',
      title: 'Staff',
      description: 'This is where leaders can review teacher coverage, wellbeing summaries by class, and staff setup.',
    },
    {
      path: '/dashboard/data-sources',
      title: 'Your Data',
      description: 'This page explains what data Clinx uses, who can see what, and how the platform supports school judgement without extra data entry.',
    },
    {
      path: '/dashboard/settings',
      title: 'Settings',
      description: 'Manage school-wide alert defaults and leadership visibility here. Teachers still control their own personal alert delivery separately.',
    },
  ],
  teacher: [
    {
      path: '/teacher',
      title: 'My Classes',
      description: 'Start here to see your timetable for the selected week, the classes most worth watching, and the pupils most likely to need attention.',
    },
    {
      path: '/teacher/alerts',
      title: 'My Alerts',
      description: 'This page brings together the concerns relevant to you so you can review context, mark them as seen, or remind yourself later.',
    },
    {
      path: '/teacher/help',
      title: 'Help',
      description: 'Use this page for guidance on scores, alerts, and how Clinx fits around normal practice.',
    },
  ],
};

export default function GuidedTourModal({ isOpen, onClose }: GuidedTourModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<HighlightRect | null>(null);

  const steps = useMemo(() => (user ? stepsByRole[user.role] : []), [user]);
  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (!isOpen || !steps.length) {
      return;
    }

    const currentPath = location.pathname;
    const foundIndex = steps.findIndex((step) => step.path === currentPath);
    if (foundIndex >= 0) {
      setStepIndex(foundIndex);
    } else {
      setStepIndex(0);
      navigate(steps[0].path);
    }
  }, [isOpen, steps, location.pathname, navigate]);

  useEffect(() => {
    if (!isOpen || !currentStep) {
      setTargetRect(null);
      return;
    }

    function updateTargetRect() {
      const target = document.querySelector(`[data-tour-path="${currentStep.path}"]`) as HTMLElement | null;
      if (!target) {
        setTargetRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        right: rect.right,
      });
    }

    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    return () => window.removeEventListener('resize', updateTargetRect);
  }, [isOpen, currentStep, location.pathname]);

  if (!isOpen || !user || !currentStep) {
    return null;
  }

  function goToStep(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(steps.length - 1, nextIndex));
    setStepIndex(boundedIndex);
    navigate(steps[boundedIndex].path);
  }

  if (!targetRect) {
    return null;
  }

  const cardWidth = 460;
  const cardLeft = Math.min(targetRect.right + 44, window.innerWidth - cardWidth - 24);
  const cardTop = Math.max(88, Math.min(targetRect.top - 28, window.innerHeight - 320));
  const arrowLeft = targetRect.right + 10;
  const arrowTop = targetRect.top + targetRect.height / 2 - 12;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/35">
      <div
        className="fixed rounded-xl ring-4 ring-sky-400/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.35)] pointer-events-none"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      <div
        className="fixed text-sky-500 pointer-events-none"
        style={{ left: arrowLeft, top: arrowTop }}
      >
        <ArrowRight className="w-7 h-7" />
      </div>

      <div
        className="fixed w-full max-w-[460px] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
        style={{ top: cardTop, left: cardLeft }}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Guided Tour</p>
            <h2 className="text-xl font-semibold text-gray-900 mt-2">{currentStep.title}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Step {stepIndex + 1} of {steps.length}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm text-sky-900 leading-relaxed">{currentStep.description}</p>
          </div>

          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={step.path}
                onClick={() => goToStep(index)}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === stepIndex ? 'bg-sky-600' : index < stepIndex ? 'bg-sky-200' : 'bg-gray-200'
                }`}
                aria-label={`Go to ${step.title}`}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => goToStep(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Close Tour
            </button>
            <button
              onClick={() => (stepIndex === steps.length - 1 ? onClose() : goToStep(stepIndex + 1))}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700"
            >
              {stepIndex === steps.length - 1 ? 'Finish' : 'Next Page'}
              {stepIndex !== steps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
