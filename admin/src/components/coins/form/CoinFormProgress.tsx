import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
}

interface CoinFormProgressProps {
  steps: Step[];
  currentStep: number;
}

export function CoinFormProgress({ steps, currentStep }: CoinFormProgressProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.id} className="flex-1 relative">
            <div className="flex items-center">
              <div
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  currentStep > step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep === step.id
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-muted-foreground/30 bg-background text-muted-foreground'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-300',
                    currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                'absolute -bottom-6 left-0 text-xs font-medium whitespace-nowrap',
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
