'use client';

import { CheckCircle, Clock, AlertCircle, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InquiryStatusDisplayProps {
  bookingRef: string;
  firstName: string;
  email: string;
  whatsapp?: string;
  emailSent: boolean;
  status?: 'pending' | 'quotation_sent' | 'confirmed';
}

export default function InquiryStatusDisplay({
  bookingRef,
  firstName,
  email,
  whatsapp,
  emailSent,
  status = 'pending',
}: InquiryStatusDisplayProps) {
  const { t } = useLanguage();
  const is = t.inquiryStatus;
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-[#f97316]/10',
      title: is.receivedTitle,
      description: is.receivedDesc,
    },
    quotation_sent: {
      icon: Mail,
      color: 'text-primary',
      bgColor: 'bg-[#0e7490]/10',
      title: is.quoteSentTitle,
      description: is.quoteSentDesc,
    },
    confirmed: {
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-[#0e7490]/10',
      title: is.confirmedTitle,
      description: is.confirmedDesc,
    },
  };

  const current = statusConfig[status];
  const StatusIcon = current.icon;

  return (
    <div className={`${current.bgColor} rounded-2xl p-6 border border-border`}>
      <div className="flex items-start gap-4">
        <div className={`${current.color} mt-1`}>
          <StatusIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-poppins font-bold text-lg text-foreground mb-2">
            {current.title}
          </h3>
          <p className="font-inter text-sm text-foreground mb-4">
            {current.description}
          </p>

          <div className="bg-white rounded-lg p-4 space-y-2 text-sm mb-4">
            <div>
              <span className="font-medium text-foreground">{is.refLabel}:</span>
              <span className="ml-2 font-mono font-bold text-foreground">{bookingRef}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">{is.nameLabel}:</span>
              <span className="ml-2 text-foreground">{firstName}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">{is.emailLabel}:</span>
              <span className="ml-2 text-foreground">{email}</span>
            </div>
          </div>

          {emailSent && (
            <div className="flex items-start gap-2 p-3 bg-[#0e7490]/10 rounded-lg mb-4">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary">
                {is.emailSentSuccess}
              </p>
            </div>
          )}

          {!emailSent && (
            <div className="flex items-start gap-2 p-3 bg-[#f97316]/10 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-accent">
                {is.emailSentFail}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <a
              href={`https://wa.me/${whatsapp || '254101923355'}?text=Hi%2C%20I%20have%20an%20inquiry%20about%20reference%20${bookingRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors font-inter text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              {is.whatsAppBtn}
            </a>
            <button
              onClick={() => window.location.href = `mailto:bahariasilisafaris@gmail.com?subject=Re: Inquiry ${bookingRef}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors font-inter text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              {is.emailBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
