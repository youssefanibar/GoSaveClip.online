'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import enDict from '@/lib/i18n/dictionaries/en.json';
import arDict from '@/lib/i18n/dictionaries/ar.json';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '5175c12f-4b2c-47f4-afce-2d75efed0e5a';

export default function ContactPage() {
  const params = useParams();
  const lang = (params?.lang === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const dict = lang === 'ar' ? arDict : enDict;
  const contact = dict.pages.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 80) {
      newErrors.name = contact.form.errors.name;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      newErrors.email = contact.form.errors.email;
    }

    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 3000) {
      newErrors.message = contact.form.errors.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Honeypot bot protection: if bot filled it, silently show success
    if (botcheck) {
      setStatusMessage({
        type: 'success',
        text: contact.form.successMessage,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'GoSaveClip Contact Form Submission',
        message: formData.message.trim(),
        from_name: 'GoSaveClip Contact Form',
        page_language: lang,
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: contact.form.successMessage,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        setStatusMessage({
          type: 'error',
          text: contact.form.errorMessage,
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: contact.form.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar lang={lang} dict={dict.common} />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lang={lang}
            items={[{ label: contact.title }]}
            homeLabel={dict.common.breadcrumbs.home}
          />

          <header className="mt-8 mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {contact.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
              {contact.subtitle}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info Cards (No Raw Email Address Displayed) */}
            <div className="md:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-400">
                  {contact.channelLabel}
                </h2>
                <div className="mt-1 block text-base font-bold text-white">
                  {contact.channelValue}
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {contact.channelDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-400">
                  {contact.hoursLabel}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {contact.hours}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{contact.privacyCardTitle}</span>
                </div>
                <p className="leading-relaxed">
                  {contact.privacyCardText}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
                {statusMessage?.type === 'success' ? (
                  <div
                    className="text-center py-10"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {statusMessage.text}
                    </h3>
                    <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
                      {lang === 'ar'
                        ? 'سنقوم بمراجعة رسالتك وموافاتك بالرد في أقرب وقت.'
                        : 'We appreciate your patience while our team reviews your message.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatusMessage(null)}
                      className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      {contact.form.sendAnotherBtn}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Accessible Live Alert for submission errors */}
                    {statusMessage?.type === 'error' && (
                      <div
                        role="alert"
                        aria-live="assertive"
                        className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{statusMessage.text}</p>
                        </div>
                      </div>
                    )}

                    {/* Hidden Honeypot Field */}
                    <input
                      type="checkbox"
                      name="botcheck"
                      id="botcheck"
                      className="hidden"
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      aria-hidden="true"
                      autoComplete="off"
                      checked={botcheck}
                      onChange={(e) => setBotcheck(e.target.checked)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-slate-300 mb-1.5"
                        >
                          {contact.form.nameLabel} <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) {
                              setErrors({ ...errors, name: undefined });
                            }
                          }}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
                            errors.name
                              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                              : 'border-slate-800 focus:border-rose-500 focus:ring-rose-500'
                          }`}
                          placeholder={contact.form.namePlaceholder}
                        />
                        {errors.name && (
                          <p
                            id="contact-name-error"
                            role="alert"
                            className="mt-1 text-xs text-rose-400 font-medium"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-slate-300 mb-1.5"
                        >
                          {contact.form.emailLabel} <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) {
                              setErrors({ ...errors, email: undefined });
                            }
                          }}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
                            errors.email
                              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                              : 'border-slate-800 focus:border-rose-500 focus:ring-rose-500'
                          }`}
                          placeholder={contact.form.emailPlaceholder}
                        />
                        {errors.email && (
                          <p
                            id="contact-email-error"
                            role="alert"
                            className="mt-1 text-xs text-rose-400 font-medium"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        {contact.form.subjectLabel}
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                        placeholder={contact.form.subjectPlaceholder}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        {contact.form.messageLabel} <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) {
                            setErrors({ ...errors, message: undefined });
                          }
                        }}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${
                          errors.message
                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                            : 'border-slate-800 focus:border-rose-500 focus:ring-rose-500'
                        }`}
                        placeholder={contact.form.messagePlaceholder}
                      />
                      {errors.message && (
                        <p
                          id="contact-message-error"
                          role="alert"
                          className="mt-1 text-xs text-rose-400 font-medium"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-sm transition-all shadow-lg ${
                          isSubmitting
                            ? 'bg-rose-700/60 cursor-not-allowed opacity-80'
                            : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-500/25 cursor-pointer active:scale-95'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{contact.form.sendingBtn}</span>
                          </>
                        ) : (
                          <>
                            <span>{contact.form.submitBtn}</span>
                            <Send className="w-4 h-4 rtl:rotate-180" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Short Privacy Note with Link to Privacy Policy */}
                    <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                      <span>{contact.form.privacyNote} </span>
                      <Link
                        href={`/${lang}/privacy`}
                        className="text-rose-400 hover:text-rose-300 underline font-medium transition-colors"
                      >
                        {contact.form.privacyLink}
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
