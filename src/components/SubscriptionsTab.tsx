import { useState, FormEvent } from 'react';
import { 
  Check, 
  Sparkles, 
  Award, 
  Zap, 
  Crown, 
  HelpCircle, 
  Percent, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone,
  Flame,
  Info 
} from 'lucide-react';

interface SubscriptionsTabProps {
  currentTier: string;
  onSetTier: (tier: string) => void;
}

export function SubscriptionsTab({ currentTier, onSetTier }: SubscriptionsTabProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [discountMultiplier, setDiscountMultiplier] = useState(1.0);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
  
  // Checkout Modal State
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: string; price: number; id: string } | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [successUpgraded, setSuccessUpgraded] = useState(false);

  // Active FAQ index tracking
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const basePrices = {
    starter: 0,
    pro: 19,
    agency: 49,
  };

  const getPrice = (planKey: 'starter' | 'pro' | 'agency') => {
    let price = basePrices[planKey];
    if (billingCycle === 'annual') {
      price = Math.round(price * 0.8 * 12); // 20% off, show as annual charge or equivalent
    }
    // Apply coupon discount multiplier
    return parseFloat((price * discountMultiplier).toFixed(1));
  };

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    const cleanCoupon = couponCode.trim().toUpperCase();
    if (cleanCoupon === 'VIRAL20') {
      setDiscountMultiplier(0.8);
      setCouponMessage({ text: 'Coupon "VIRAL20" applied! Extra 20% off all options.', type: 'success' });
    } else if (cleanCoupon === 'CREATOR50') {
      setDiscountMultiplier(0.5);
      setCouponMessage({ text: 'Incredible! "CREATOR50" half-price coupon activated.', type: 'success' });
    } else if (cleanCoupon === 'YT100') {
      setDiscountMultiplier(0.0);
      setCouponMessage({ text: 'Special "YT100" 100% off scholarship key validated!', type: 'success' });
    } else if (cleanCoupon) {
      setCouponMessage({ text: 'Invalid or expired coupon key. Try using "CREATOR50" or "VIRAL20".', type: 'error' });
    }
  };

  const handleOpenCheckout = (planId: string, name: string) => {
    let price = 0;
    if (planId === 'starter') {
      onSetTier('Starter');
      return;
    }
    if (planId === 'pro') price = getPrice('pro');
    if (planId === 'agency') price = getPrice('agency');

    setCheckoutPlan({ id: planId, name, price });
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setIsProcessing(false);
    setProcessingStep(0);
    setSuccessUpgraded(false);
  };

  const handleSimulatePayment = (e: FormEvent) => {
    e.preventDefault();
    if (!cardName.trim() || !cardNumber.trim()) {
      alert("Please fill out your card details to complete the simulation.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1); // Connecting

    setTimeout(() => {
      setProcessingStep(2); // Auth
    }, 1000);

    setTimeout(() => {
      setProcessingStep(3); // Success
      onSetTier(checkoutPlan?.name || 'Creator Pro Level');
      setSuccessUpgraded(true);
      setIsProcessing(false);
    }, 2500);
  };

  const faqs = [
    {
      q: "Can I upgrade or downgrade my tier at any time?",
      a: "Absolutely. All simulation upgrades here are immediate. When you mock-upgrade to Pro or Agency, your universal top dashboard header badge changes live to reflect your active master tier and features instantly unlock."
    },
    {
      q: "What coupon codes can I test in this Sandbox?",
      a: "To test our responsive coupon algorithms, enter \"CREATOR50\" in the box for exactly 50% off all layouts, or \"YT100\" to completely reduce the prices to $0.0 for an absolute free test!"
    },
    {
      q: "Are these real charges?",
      a: "No, this is a fully client-side Sandbox playground for YouTube creators built under professional specifications. No real charges are made. You can test workflows and custom tier setups for free!"
    },
    {
      q: "What does Priority Scoring Telemetry mean?",
      a: "Pro and Agency tier members bypass standard queues and get custom prompt weighting. The script-generator adapts to emotional Hook levels faster and outputs custom short-form structures suited for YouTube shorts algorithms."
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      
      {/* Header Promo Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/20 px-3 py-1 text-xs font-semibold text-red-400">
          <Award className="h-4.5 w-4.5 text-red-500 animate-spin-slow" />
          <span>Flexible Creator Tiers</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
          Premium Plan <span className="text-gradient-red-purple">Selections</span>
        </h2>
        <p className="text-slate-400 text-sm">
          Unleash maximum AI growth models. Choose a dynamic plan designed to propel your content, reach, audience CTR, and digital creation workflows.
        </p>

        {/* Current Active Plan Alert box */}
        <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 inline-flex items-center gap-3 text-xs text-gray-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Your Active Plan: <strong className="text-white text-sm bg-gradient-red-purple px-2.5 py-0.5 rounded-full ml-1">{currentTier}</strong></span>
        </div>
      </div>

      {/* Pricing Switcher + Coupon field */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#0c0c11] border border-white/5 shadow-xl">
        
        {/* Toggle Controls */}
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Billing Frequency</span>
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                billingCycle === 'annual'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Yearly billing</span>
              <span className="text-[9px] bg-red-950 font-mono font-black text-red-400 px-1 py-0.5 rounded uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Promo Coupons box */}
        <div className="w-full md:w-auto">
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block text-center md:text-left">
              Have Sandbox coupon code? (Try: <span className="text-yellow-400 font-bold">CREATOR50</span> or <span className="text-yellow-400 font-bold">VIRAL20</span>)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. CREATOR50"
                className="bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500 w-full md:w-44"
              />
              <button
                type="submit"
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 text-xs font-black tracking-wide border border-white/10 transition-colors"
              >
                Apply
              </button>
            </div>
            {couponMessage.text && (
              <p className={`text-[11px] font-medium leading-tight ${couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {couponMessage.text}
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Main pricing grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* plan 1: Starter */}
        <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all border ${
          currentTier === 'Starter'
            ? 'bg-[#0f0f13] border-red-500/40 ring-4 ring-red-500/10'
            : 'bg-[#09090c] border-white/5 hover:border-white/10'
        }`}>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase">Tier 01</span>
                <h3 className="text-xl font-bold text-slate-300 font-display mt-0.5">Starter Level</h3>
              </div>
              <span className="p-1 px-2.5 rounded-full bg-white/5 text-gray-400 font-mono text-[9px] uppercase tracking-wider">
                Basic
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">$0</span>
                <span className="text-sm font-mono text-gray-500 ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-xs text-gray-500 italic">Standard access sandbox mode</p>
            </div>

            <hr className="border-white/5" />

            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>3 daily video idea generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Basic Youtube description tags</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Standard script layouts</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-red-500 mr-1">✕</span>
                <span className="line-through">Custom emotional voice modes</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-red-500 mr-1">✕</span>
                <span className="line-through">Unlimited metadata storage</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-auto">
            <button
              onClick={() => handleOpenCheckout('starter', 'Starter')}
              disabled={currentTier === 'Starter'}
              className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all text-center ${
                currentTier === 'Starter'
                  ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 cursor-default'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {currentTier === 'Starter' ? 'Current Active Tier' : 'Choose Starter'}
            </button>
          </div>
        </div>

        {/* plan 2: Pro (Featured) */}
        <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all border ${
          currentTier === 'Creator Pro Level'
            ? 'bg-gradient-to-b from-[#110c1f] to-[#07050d] border-purple-500/60 ring-4 ring-purple-500/20'
            : 'bg-gradient-to-b from-[#110f13] to-[#07050d] border-red-500/40 hover:border-red-500/50'
        }`}>
          {/* Most popular indicator badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-r from-red-650 to-purple-650 px-4 py-1.5 rounded-bl-xl text-[9px] uppercase tracking-black font-black text-white flex items-center gap-1 shadow-lg">
            <Sparkles className="h-3 w-3 animate-spin-slow" />
            <span>Recommended Choice</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-black">Tier 02 (Best Sellers)</span>
                <h3 className="text-xl font-black text-white font-display mt-0.5 flex items-center gap-1.5">
                  Creator Pro
                  <Crown className="h-4.5 w-4.5 text-yellow-500" />
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline text-white">
                <span className="text-[11px] text-gray-400 font-mono mr-1">USD</span>
                <span className="text-5xl font-black tracking-tight text-gradient-red-purple">${getPrice('pro')}</span>
                <span className="text-sm font-mono text-gray-500 ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-xs text-purple-300">Our absolute best-selling roadmap key</p>
            </div>

            <hr className="border-white/5" />

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                <span><strong className="text-white">Unlimited</strong> dynamic video ideas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                <span>Unlimited tags, copy-friendly models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                <span>Advanced AI hook outlines & timing guides</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                <span>Emotional engagement sliders</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                <span>Dedicated performance scoring tools</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-auto">
            <button
              onClick={() => handleOpenCheckout('pro', 'Creator Pro Level')}
              className={`w-full py-3.5 rounded-xl text-xs font-black tracking-wide transition-all text-center glow-button ${
                currentTier === 'Creator Pro Level'
                  ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30 cursor-default'
                  : 'bg-gradient-red-purple hover:opacity-90 text-white shadow-lg'
              }`}
            >
              {currentTier === 'Creator Pro Level' ? 'Active Pro Account' : 'Upgrade to Creator Pro'}
            </button>
          </div>
        </div>

        {/* plan 3: Agency Authority */}
        <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all border ${
          currentTier === 'Agency Authority'
            ? 'bg-[#120a16] border-amber-500 ring-4 ring-amber-500/20'
            : 'bg-[#09090c] border-white/5 hover:border-white/10'
        }`}>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase">Tier 03</span>
                <h3 className="text-xl font-bold text-slate-300 font-display mt-0.5">Agency Authority</h3>
              </div>
              <span className="p-1 px-2.5 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-500 font-mono text-[9px] uppercase tracking-wider">
                Max Scale
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">${getPrice('agency')}</span>
                <span className="text-sm font-mono text-gray-500 ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-xs text-amber-500 italic">For large production studios</p>
            </div>

            <hr className="border-white/5" />

            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span><strong className="text-white">Up to 5 synchronized channels</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>Custom demographic parameters</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>Telemetry performance database sync</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>Fine-tuned voice models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>24/7 slack channel with growth advisors</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-auto">
            <button
              onClick={() => handleOpenCheckout('agency', 'Agency Authority')}
              className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all text-center ${
                currentTier === 'Agency Authority'
                  ? 'bg-amber-950/20 text-amber-400 border border-amber-500/20 cursor-default'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {currentTier === 'Agency Authority' ? 'Active Agency Control' : 'Acquire Agency'}
            </button>
          </div>
        </div>

      </div>

      {/* Feature Checklist Table Component */}
      <div className="max-w-5xl mx-auto glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white font-display">Comparative Features Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="py-3 font-mono">CORE SYSTEM FEATS</th>
                <th className="py-3 text-center">STARTER</th>
                <th className="py-3 text-center text-purple-400">CREATOR PRO</th>
                <th className="py-3 text-center text-amber-400 font-bold">AGENCY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr>
                <td className="py-4 font-semibold">Video Idea generation limit</td>
                <td className="py-4 text-center text-gray-500">3 per day</td>
                <td className="py-4 text-center text-white bg-purple-950/10">Unlimited</td>
                <td className="py-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Metadata Title / Tag optimization</td>
                <td className="py-4 text-center">Standard</td>
                <td className="py-4 text-center text-white bg-purple-950/10">Deep SEO Grounding</td>
                <td className="py-4 text-center">Grounding + Historical Stats</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Script durations formats</td>
                <td className="py-4 text-center">Shorts only</td>
                <td className="py-4 text-center text-white bg-purple-950/10">Short & Long Forms</td>
                <td className="py-4 text-center">Short, Long & Course outlines</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Simultaneous YouTube slots</td>
                <td className="py-4 text-center">1 channel</td>
                <td className="py-4 text-center text-white bg-purple-950/10">1 channel</td>
                <td className="py-4 text-center text-amber-400 font-bold">Up to 5 synchronized channels</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Fine-tuned demographic filters</td>
                <td className="py-4 text-center text-gray-600">✕</td>
                <td className="py-4 text-center text-emerald-400 bg-purple-950/10">✔</td>
                <td className="py-4 text-center text-emerald-400">✔</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Secure API integration access</td>
                <td className="py-4 text-center text-gray-600">✕</td>
                <td className="py-4 text-center text-gray-650 bg-purple-950/10">✕</td>
                <td className="py-4 text-center text-emerald-400">✔ (Developer Key)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl font-extrabold text-white font-display text-center">Plan Selections & Sandbox FAQ</h3>
        
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-white/5 bg-[#0c0c11]/80 hover:border-white/10 transition-colors overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center bg-transparent focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-bold text-white pr-4">{faq.q}</span>
                <span className="text-xs text-gray-500 shrink-0">
                  {openFaqIdx === idx ? 'Collapse ▲' : 'Expand ▼'}
                </span>
              </button>

              {openFaqIdx === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-400 leading-relaxed border-t border-white/5 bg-black/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Drawer/Modal Overlay */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0d0d12] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal close */}
            <button
              onClick={() => setCheckoutPlan(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg text-xs"
            >
              Cancel ✕
            </button>

            {/* Title / Header */}
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">Simulator Sandbox Checkout</span>
              <h4 className="text-lg font-black text-white font-display mt-1">Upgrade Creator Portal</h4>
              <p className="text-xs text-gray-400 mt-1">Simulating upgrade to <strong className="text-white">{checkoutPlan.name}</strong></p>
            </div>

            {/* Coupon Application reminder inside checkout */}
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 text-xs text-purple-300 flex items-center gap-2">
              <Percent className="h-4.5 w-4.5 shrink-0 text-purple-400" />
              <span>Checking out at: <strong className="text-white text-sm">${checkoutPlan.price}</strong> {billingCycle === 'monthly' ? '/ month' : '/ year billed annually'}</span>
            </div>

            {successUpgraded ? (
              <div className="text-center py-6 space-y-4 animate-scale-up">
                <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-base font-bold text-white">Upgrade Active!</h5>
                  <p className="text-xs text-gray-400">Sandbox parameters updated successfully.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-left text-gray-300 leading-normal">
                  🟢 Your workspace dashboard is now operating at <strong className="text-white">&ldquo;{checkoutPlan.name}&rdquo;</strong> levels. You will live-review locked metrics!
                </div>
                <button
                  onClick={() => setCheckoutPlan(null)}
                  className="w-full bg-gradient-red-purple py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                >
                  Return to Creation Hub
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold block">Simulated Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Casey Neistat"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold block">Simulated Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 pl-10 text-white focus:outline-none focus:border-red-500 font-mono tracking-wider"
                    />
                    <div className="absolute left-3.5 top-3 text-gray-500">
                      💳
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-semibold block">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-red-500 font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-semibold block">CVV Code</label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-red-500 font-mono text-center"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-3">
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      100% Sandbox Mock Secure
                    </span>
                    <span>Direct Simulation</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-red-purple py-3 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        {processingStep === 1 ? 'Routing via AI...' : processingStep === 2 ? 'Authorizing Mock Tiers...' : 'Applying Upgrade...'}
                      </div>
                    ) : (
                      <>
                        <span>Validate Secure Simulation Payment</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
