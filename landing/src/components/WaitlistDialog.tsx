import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Phone, Building2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WaitlistDialog: React.FC<WaitlistDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email) {
      toast({
        title: t('waitlist.error'),
        description: t('waitlist.errorRequired'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Call the Supabase function to add to demo_requests table
      const { error } = await supabase.rpc('request_demo', {
        p_name: formData.name,
        p_email: formData.email,
        p_company: formData.interest || null, // Map interest field to company
        p_message: formData.phone || null // Map phone number to message
      });
      
      if (error) throw error;
      
      // Enviar datos al webhook
      await fetch('https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/136cbd2c-c7fb-4e0b-962b-2725306f098a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone_number: formData.phone,
          interest: formData.interest || 'Im Interested In Buy this Solution'
        })
      });
      
      toast({
        title: t('waitlist.success'),
        description: t('waitlist.successMessage')
      });

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t('waitlist.error'),
        description: t('waitlist.errorMessage'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side: Contact Info - Only shown on desktop */}
          {!isMobile && (
            <div className="bg-primary text-white p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h2>
                <p className="text-gray-200 mb-8">
                  {t('contact.info.description')}
                </p>
              </div>
              
              {/* Contact Information Section */}
              <div className="mt-auto py-px">
                <h3 className="font-bold text-xl mb-3">{t('contact.info.title')}</h3>
                <p className="text-sm text-gray-200 mb-6">
                  {t('contact.info.description')}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{t('contact.info.email.label')}</h4>
                    <p className="text-gray-200">{t('contact.info.email.value')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{t('contact.info.whatsapp.label')}</h4>
                    <p className="text-gray-200">{t('contact.info.whatsapp.value')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{t('contact.info.hours.label')}</h4>
                    <p className="text-gray-200">{t('contact.info.hours.value')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Right side: Form */}
          <div className="p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t('waitlist.formTitle')}</DialogTitle>
              <DialogDescription>
                {t('waitlist.formDescription')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">{t('waitlist.nameLabel')}</label>
                <div className="relative">
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder={t('waitlist.namePlaceholder')} 
                    className="pl-10" 
                    required 
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">{t('waitlist.emailLabel')}</label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder={t('waitlist.emailPlaceholder')} 
                    className="pl-10" 
                    required 
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="interest" className="block text-sm font-medium">{t('waitlist.interestLabel')}</label>
                <div className="relative">
                  <Input 
                    id="interest" 
                    value={formData.interest} 
                    onChange={handleChange} 
                    placeholder={t('waitlist.interestPlaceholder')} 
                    className="pl-10" 
                  />
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">{t('waitlist.phoneLabel')}</label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder={t('waitlist.phonePlaceholder')} 
                    className="pl-10" 
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('waitlist.submitting')}
                  </>
                ) : t('waitlist.submit')}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;
