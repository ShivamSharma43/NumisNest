import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CoinFormProgress } from './CoinFormProgress';
import { BasicInfoStep } from './BasicInfoStep';
import { SpecificationsStep } from './SpecificationsStep';
import { MediaStep } from './MediaStep';
import { DescriptionStep } from './DescriptionStep';
import {
  coinFormSchema,
  type CoinFormData,
  FORM_STEPS,
  defaultFormValues,
} from '@/lib/coinFormSchema';
import { toast } from 'sonner';
import type { Coin } from '@/types/admin';

interface CoinFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CoinFormData, status: 'draft' | 'published') => void;
  coin?: Coin | null;
}

export function CoinFormDialog({ open, onClose, onSubmit, coin }: CoinFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const isEditing = !!coin;

  const form = useForm<CoinFormData>({
    resolver: zodResolver(coinFormSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  // Pre-populate form when editing — map backend field names to form field names
  useEffect(() => {
    if (coin && open) {
      form.reset({
        name: coin.name || '',
        year: coin.year || new Date().getFullYear(),
        denomination: (coin.denomination as any) || 'old_coin',
        leader: coin.leader || coin.ruler || '',
        rarity: (coin.rarity as 1|2|3|4|5) || 3,
        dynasty: coin.dynasty || '',
        material: coin.material
          ? coin.material.charAt(0).toUpperCase() + coin.material.slice(1)  // 'gold' → 'Gold'
          : '',
        weight: coin.weight,
        diameter: coin.diameter,
        mint: coin.mint || coin.mintLocation || '',
        imageUrl: coin.imageUrl || (coin.images?.[0] ?? ''),
        description: coin.description || '',
        historicalContext: coin.historicalContext || '',
      });
    } else if (!coin && open) {
      form.reset(defaultFormValues);
    }
  }, [coin, open]);

  const handleNext = async () => {
    const currentFields = FORM_STEPS[currentStep - 1].fields;
    const isValid = await form.trigger(currentFields as any);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    if (!data.name) {
      toast.error('Please enter at least a coin name to save as draft');
      return;
    }
    onSubmit(data, 'draft');
    handleClose();
  };

  const handlePublish = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onSubmit(form.getValues(), 'published');
      handleClose();
    } else {
      toast.error('Please fill in all required fields before publishing');
    }
  };

  const handleClose = () => {
    form.reset(defaultFormValues);
    setCurrentStep(1);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <SpecificationsStep form={form} />;
      case 3:
        return <MediaStep form={form} />;
      case 4:
        return <DescriptionStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isEditing ? 'Edit Coin' : 'Add New Coin'}</DialogTitle>
          <DialogDescription>Fill in the details below to {isEditing ? 'update this' : 'add a new'} coin.</DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <CoinFormProgress steps={FORM_STEPS} currentStep={currentStep} />

          <Form {...form}>
            <form className="mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="ghost" onClick={handlePrevious}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>

                  {currentStep < FORM_STEPS.length ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={handlePublish} className="bg-primary hover:bg-primary/90">
                      <Send className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
