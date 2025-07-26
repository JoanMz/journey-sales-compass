
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call the Supabase function to save the demo request
      const { error } = await supabase.rpc('request_demo', {
        p_name: formData.name,
        p_email: formData.email,
        p_company: formData.company || null,
        p_message: formData.message || null
      });
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Form submitted",
        description: "We'll get back to you as soon as possible!"
      });
      
      // Clear the form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-container bg-gray-50">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('contact.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="reveal-animation">
          <h3 className="text-2xl font-bold mb-4">{t('contact.info.title')}</h3>
          <p className="mb-8 text-secondary">
            {t('contact.info.description')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-1">{t('contact.info.email.label')}</h4>
              <p className="text-secondary">{t('contact.info.email.value')}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">{t('contact.info.whatsapp.label')}</h4>
              <p className="text-secondary">{t('contact.info.whatsapp.value')}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">{t('contact.info.hours.label')}</h4>
              <p className="text-secondary">{t('contact.info.hours.value')}</p>
            </div>
          </div>
        </div>

        <div className="reveal-animation" id="contact-form">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">{t('contact.form.name.label')}</label>
              <Input 
                id="name" 
                placeholder={t('contact.form.name.placeholder')}
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2">{t('contact.form.email.label')}</label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('contact.form.email.placeholder')}
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block mb-2">{t('contact.form.company.label')}</label>
              <Input 
                id="company" 
                placeholder={t('contact.form.company.placeholder')}
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-2">{t('contact.form.message.label')}</label>
              <Textarea 
                id="message" 
                placeholder={t('contact.form.message.placeholder')}
                required 
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-secondary text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('contact.form.submitting')}
                </>
              ) : (
                t('contact.form.submit')
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
