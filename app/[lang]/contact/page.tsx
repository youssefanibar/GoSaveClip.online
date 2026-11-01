'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import enDict from '@/lib/i18n/dictionaries/en.json';
import arDict from '@/lib/i18n/dictionaries/ar.json';

export default function ContactPage() {
  const params = useParams();
  const lang = (params?.lang === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const dict = lang === 'ar' ? arDict : enDict;
  const contact = dict.pages.contact;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
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
            {/* Info Cards */}
            <div className="md:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-400">
                  {contact.emailLabel}
                </h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-1 block text-base font-bold text-white hover:text-rose-400 transition-colors"
                >
                  {contact.email}
                </a>
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
                  <span>{lang === 'ar' ? 'حماية البيانات' : 'Data Privacy'}</span>
                </div>
                <p>
                  {lang === 'ar'
                    ? 'نحن لا نشارك رسائلك أو بريدك الإلكتروني مع أي أطراف خارجية مطلقاً.'
                    : 'We never sell or share your contact details or inquiries with any third parties.'}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {lang === 'ar' ? 'تم استلام رسالتك!' : 'Message Received!'}
                    </h3>
                    <p className="text-slate-300 text-sm max-w-md mx-auto">
                      {contact.form.successMessage}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="mt-6 px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
                    >
                      {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          {contact.form.nameLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                          placeholder={lang === 'ar' ? 'الاسم الكريم' : 'Your name'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          {contact.form.emailLabel}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {contact.form.subjectLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                        placeholder={
                          lang === 'ar'
                            ? 'استفسار أو بلاغ عن رابط'
                            : 'Bug report, feature request, or feedback'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {contact.form.messageLabel}
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors resize-none"
                        placeholder={
                          lang === 'ar'
                            ? 'اكتب رسالتك بالتفصيل هنا...'
                            : 'Describe your question or issue in detail...'
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                    >
                      <span>{contact.form.submitBtn}</span>
                      <Send className="w-4 h-4 rtl:rotate-180" />
                    </button>
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
