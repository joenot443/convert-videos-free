'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Shield, Globe, Download, Settings, FileVideo } from 'lucide-react';
import { useDictionary } from '@/components/providers/DictionaryProvider';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors px-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-1">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function SEOContent() {
  const { dictionary } = useDictionary();
  const d = dictionary.seo;

  const faqs = [
    { question: d.faq1Q, answer: d.faq1A },
    { question: d.faq2Q, answer: d.faq2A },
    { question: d.faq3Q, answer: d.faq3A },
    { question: d.faq4Q, answer: d.faq4A },
  ];

  const features = [
    {
      icon: Shield,
      title: d.feature1Title,
      description: d.feature1Desc,
    },
    {
      icon: Zap,
      title: d.feature2Title,
      description: d.feature2Desc,
    },
    {
      icon: Globe,
      title: d.feature3Title,
      description: d.feature3Desc,
    },
    {
      icon: Download,
      title: d.feature4Title,
      description: d.feature4Desc,
    },
  ];

  return (
    <div className="mt-12 space-y-12">
      {/* How It Works Section */}
      <section className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {d.howItWorks}
        </h2>
        <p className="text-gray-600 text-center mb-6">{d.howItWorksDesc}</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{d.step1Title}</h3>
            <p className="text-sm text-gray-600">{d.step1Desc}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{d.step2Title}</h3>
            <p className="text-sm text-gray-600">{d.step2Desc}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{d.step3Title}</h3>
            <p className="text-sm text-gray-600">{d.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {d.whyChoose}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {d.faqTitle}
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </div>
  );
}
