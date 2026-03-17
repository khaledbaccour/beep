'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localePath } from '@/lib/i18n-utils';
import type { Locale } from '@/i18n';
import {
  getOnboardingStatus,
  saveOnboardingStep1,
  saveOnboardingStep2,
  saveOnboardingStep3,
  saveOnboardingStep4,
  completeOnboarding,
} from '@/lib/api';
import { OnboardingProgress } from './OnboardingProgress';
import { StepBasicInfo, type StepBasicInfoData } from './StepBasicInfo';
import { StepExpertise, type StepExpertiseData } from './StepExpertise';
import { StepPricing, type StepPricingData } from './StepPricing';
import { StepPayout, type StepPayoutData } from './StepPayout';

const STEP_LABELS = ['Profile', 'Expertise', 'Pricing', 'Payout'];
const TOTAL_STEPS = 4;

interface OnboardingWizardProps {
  lang: Locale;
}

export function OnboardingWizard({ lang }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step data
  const [step1, setStep1] = useState<StepBasicInfoData>({
    slug: '',
    bio: '',
    headline: '',
    category: '',
  });

  const [step2, setStep2] = useState<StepExpertiseData>({
    tags: [],
    certifications: [],
    yearsOfExperience: 0,
    languages: [],
  });

  const [step3, setStep3] = useState<StepPricingData>({
    priceTND: '',
    sessionDurationMinutes: 30,
    timezone: 'Africa/Tunis',
  });

  const [step4, setStep4] = useState<StepPayoutData>({
    payoutMethod: 'BANK_TRANSFER',
    bankName: '',
    iban: '',
    accountHolderName: '',
    mobileProvider: '',
    mobilePhone: '',
  });

  // Load existing onboarding status on mount
  useEffect(() => {
    const token = localStorage.getItem('beep_token');
    if (!token) {
      router.push(localePath(lang, '/login'));
      return;
    }

    const userStr = localStorage.getItem('beep_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== 'EXPERT') {
        router.push(localePath(lang, '/marketplace'));
        return;
      }
    }

    async function loadStatus() {
      try {
        const res = await getOnboardingStatus();
        const status = res.data;

        if (status.completed) {
          router.push(localePath(lang, '/dashboard'));
          return;
        }

        // Restore saved data
        if (status.step1) {
          setStep1({
            slug: status.step1.slug || '',
            bio: status.step1.bio || '',
            headline: status.step1.headline || '',
            category: status.step1.category || '',
          });
        }
        if (status.step2) {
          setStep2({
            tags: status.step2.tags || [],
            certifications: status.step2.certifications || [],
            yearsOfExperience: status.step2.yearsOfExperience || 0,
            languages: status.step2.languages || [],
          });
        }
        if (status.step3) {
          setStep3({
            priceTND: status.step3.sessionPriceMillimes
              ? (status.step3.sessionPriceMillimes / 1000).toFixed(3)
              : '',
            sessionDurationMinutes: status.step3.sessionDurationMinutes || 30,
            timezone: status.step3.timezone || 'Africa/Tunis',
          });
        }
        if (status.step4) {
          setStep4({
            payoutMethod: status.step4.payoutMethod || 'BANK_TRANSFER',
            bankName: status.step4.bankName || '',
            iban: status.step4.iban || '',
            accountHolderName: status.step4.accountHolderName || '',
            mobileProvider: status.step4.mobileProvider || '',
            mobilePhone: status.step4.mobilePhone || '',
          });
        }

        // Resume from the furthest incomplete step
        setCurrentStep(Math.min(status.currentStep || 1, TOTAL_STEPS));
      } catch {
        // No existing onboarding - start fresh (step 1)
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [lang, router]);

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!step1.slug || step1.slug.length < 3) newErrors.slug = 'Slug must be at least 3 characters';
      if (step1.slug.length > 30) newErrors.slug = 'Slug must be at most 30 characters';
      if (step1.slug && step1.slug.length >= 2 && !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(step1.slug)) {
        newErrors.slug = 'Slug must start and end with a letter or number';
      }
      if (!step1.bio || step1.bio.length < 10) newErrors.bio = 'Bio must be at least 10 characters';
      if (!step1.category) newErrors.category = 'Please select a category';
    }

    if (step === 2) {
      if (step2.yearsOfExperience < 0) newErrors.yearsOfExperience = 'Must be 0 or more';
      if (step2.languages.length === 0) newErrors.languages = 'Add at least one language';
    }

    if (step === 3) {
      if (!step3.priceTND || parseFloat(step3.priceTND) <= 0) newErrors.priceTND = 'Price must be greater than 0';
      if (parseFloat(step3.priceTND) > 9999) newErrors.priceTND = 'Price cannot exceed 9999 TND';
      if (!step3.sessionDurationMinutes) newErrors.sessionDurationMinutes = 'Select a duration';
      if (!step3.timezone) newErrors.timezone = 'Select a timezone';
    }

    if (step === 4) {
      if (step4.payoutMethod === 'BANK_TRANSFER') {
        if (!step4.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        if (!step4.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!step4.iban.trim()) newErrors.iban = 'IBAN/RIB is required';
      } else {
        if (!step4.mobileProvider) newErrors.mobileProvider = 'Select a provider';
        if (!step4.mobilePhone.trim()) newErrors.mobilePhone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleNext() {
    if (!validateStep(currentStep)) return;

    setSaving(true);
    setError('');

    try {
      if (currentStep === 1) {
        await saveOnboardingStep1({
          slug: step1.slug,
          bio: step1.bio,
          headline: step1.headline || undefined,
          category: step1.category,
        });
      } else if (currentStep === 2) {
        await saveOnboardingStep2({
          tags: step2.tags,
          certifications: step2.certifications,
          yearsOfExperience: step2.yearsOfExperience,
          languages: step2.languages,
        });
      } else if (currentStep === 3) {
        await saveOnboardingStep3({
          sessionPriceMillimes: Math.round(parseFloat(step3.priceTND) * 1000),
          sessionDurationMinutes: step3.sessionDurationMinutes,
          timezone: step3.timezone,
        });
      } else if (currentStep === 4) {
        await saveOnboardingStep4({
          payoutMethod: step4.payoutMethod,
          ...(step4.payoutMethod === 'BANK_TRANSFER'
            ? {
                bankName: step4.bankName,
                iban: step4.iban,
                accountHolderName: step4.accountHolderName,
              }
            : {
                mobileProvider: step4.mobileProvider,
                mobilePhone: step4.mobilePhone,
              }),
        });
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    if (!validateStep(4)) return;

    setSaving(true);
    setError('');

    try {
      // Save step 4 first
      await saveOnboardingStep4({
        payoutMethod: step4.payoutMethod,
        ...(step4.payoutMethod === 'BANK_TRANSFER'
          ? {
              bankName: step4.bankName,
              iban: step4.iban,
              accountHolderName: step4.accountHolderName,
            }
          : {
              mobileProvider: step4.mobileProvider,
              mobilePhone: step4.mobilePhone,
            }),
      });

      // Then complete onboarding
      await completeOnboarding();
      router.push(localePath(lang, '/dashboard?onboarding=complete'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      setError('');
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
          <p className="text-sm text-ink-400">Loading...</p>
        </div>
      </div>
    );
  }

  const stepTitles = [
    'Your Profile',
    'Your Expertise',
    'Pricing & Availability',
    'Payout Setup',
  ];

  const stepDescriptions = [
    'Set up your public profile that clients will see',
    'Tell us about your skills and qualifications',
    'Set your session price and duration',
    'How would you like to receive payments?',
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-ink-900 mb-2">
            Become an Expert
          </h1>
          <p className="text-sm text-ink-500">
            Complete these steps to start receiving bookings on Beep
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={STEP_LABELS}
          />
        </div>

        {/* Card */}
        <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white shadow-retro-md overflow-hidden">
          {/* Step header */}
          <div className="px-6 py-5 border-b-2 border-ink-100">
            <h2 className="text-lg font-display font-bold text-ink-900">
              {stepTitles[currentStep - 1]}
            </h2>
            <p className="text-sm text-ink-500 mt-0.5">
              {stepDescriptions[currentStep - 1]}
            </p>
          </div>

          {/* Step content */}
          <div className="p-6">
            {currentStep === 1 && (
              <StepBasicInfo data={step1} onChange={setStep1} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepExpertise data={step2} onChange={setStep2} errors={errors} category={step1.category} />
            )}
            {currentStep === 3 && (
              <StepPricing data={step3} onChange={setStep3} errors={errors} />
            )}
            {currentStep === 4 && (
              <StepPayout data={step4} onChange={setStep4} errors={errors} />
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-6 mb-4 p-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Footer / Navigation */}
          <div className="px-6 py-4 border-t-2 border-ink-100 bg-cream-50 flex items-center justify-between gap-3">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={saving}
                  className="rounded-xl"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink-400 hidden sm:inline">
                {currentStep}/{TOTAL_STEPS}
              </span>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  variant="brand"
                  onClick={handleNext}
                  disabled={saving}
                  className="rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="brand"
                  onClick={handleComplete}
                  disabled={saving}
                  className="rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <Rocket size={16} />
                      Complete & Go Live
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom note + skip option */}
        <p className="text-center text-xs text-ink-400 mt-6">
          You can always update your profile details later from your dashboard.
        </p>
        <div className="text-center mt-3">
          <a
            href={localePath(lang, '/dashboard')}
            className="text-xs text-ink-400 hover:text-ink-600 underline underline-offset-2 transition-colors"
          >
            Skip for now — browse as a client
          </a>
        </div>
      </div>
    </div>
  );
}
