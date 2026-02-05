'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  MapPin,
  CreditCard,
  ClipboardCheck,
  Check,
  ChevronRight,
  Shield,
  Lock,
  Truck,
  Clock,
  Home,
  Building2,
  Phone,
  User,
  X,
  Sparkles,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

// Mock Order Data (from cart)
const ORDER_ITEMS = [
  { id: 1, name: 'Wireless Bluetooth Earbuds Pro X3', price: 299, quantity: 1, image: '🎧', variant: 'Black' },
  { id: 2, name: 'Premium Cotton T-Shirt Pack', price: 89, quantity: 2, image: '👕', variant: 'Medium / White' },
  { id: 3, name: 'Smart Home Security Camera', price: 459, quantity: 1, image: '📹', variant: 'Standard' },
];

const SAVED_ADDRESSES = [
  { id: 1, type: 'home', name: '张伟', phone: '+86 138 0000 1234', address: '上海市浦东新区陆家嘴环路1000号', isDefault: true },
  { id: 2, type: 'office', name: '张伟', phone: '+86 138 0000 1234', address: '上海市黄浦区南京西路1266号', isDefault: false },
];

const PAYMENT_METHODS = [
  { id: 'alipay', name: 'Alipay', icon: '💳', lastFour: '****8901' },
  { id: 'wechat', name: 'WeChat Pay', icon: '💚', lastFour: '****5678' },
  { id: 'card', name: 'Bank Card', icon: '💎', lastFour: '****1234' },
];

const STEPS = [
  { id: 1, name: 'Address', icon: MapPin },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: ClipboardCheck },
];

export default function CheckoutPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // AI Hungry Hippo
  const [showAIHippo, setShowAIHippo] = useState(false);
  const [aiDismissed, setAiDismissed] = useState(false);

  // Calculate totals
  const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 12;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // AI Hungry Hippo appears when user hesitates at payment step
  useEffect(() => {
    if (currentStep === 2 && !aiDismissed) {
      const timer = setTimeout(() => {
        setShowAIHippo(true);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, aiDismissed]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push(`/${locale}/checkout/success`);
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Cart', href: `/${locale}/cart` },
    { label: 'Checkout', href: `/${locale}/checkout` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ===== STEP INDICATOR ===== */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      currentStep === step.id 
                        ? 'bg-panda-500 text-white' 
                        : currentStep > step.id
                          ? 'bg-jade-500/20 text-jade-400'
                          : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                    <span className="font-medium">{step.name}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? 'bg-jade-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== MAIN CONTENT ===== */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: ADDRESS */}
                {currentStep === 1 && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                    
                    {/* Saved Addresses */}
                    <div className="space-y-4">
                      {SAVED_ADDRESSES.map(addr => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr.id)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedAddress === addr.id
                              ? 'bg-panda-500/10 border-panda-500'
                              : 'bg-ink-850 border-border hover:border-border-strong'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedAddress === addr.id ? 'bg-panda-500' : 'bg-ink-800'
                            }`}>
                              {addr.type === 'home' ? <Home className="h-5 w-5 text-white" /> : <Building2 className="h-5 w-5 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-slate-200 font-semibold">{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="text-xs bg-jade-500/20 text-jade-400 px-2 py-0.5 rounded-full">Default</span>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm">{addr.phone}</p>
                              <p className="text-slate-300 text-sm mt-1">{addr.address}</p>
                            </div>
                            {selectedAddress === addr.id && (
                              <Check className="h-6 w-6 text-panda-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Address */}
                    <button className="w-full p-4 border-2 border-dashed border-border rounded-2xl text-slate-400 hover:text-slate-200 hover:border-border-strong transition-colors flex items-center justify-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Add New Address
                    </button>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                      <Link href={`/${locale}/cart`}>
                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Cart
                        </Button>
                      </Link>
                      <Button onClick={handleNext} className="bg-panda-500 hover:bg-panda-600">
                        Continue to Payment
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PAYMENT */}
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                    
                    {/* Payment Methods */}
                    <div className="space-y-4">
                      {PAYMENT_METHODS.map(method => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedPayment === method.id
                              ? 'bg-panda-500/10 border-panda-500'
                              : 'bg-ink-850 border-border hover:border-border-strong'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedPayment === method.id ? 'bg-panda-500/20' : 'bg-ink-800'
                            }`}>
                              <span className="text-2xl">{method.icon}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-slate-200 font-semibold">{method.name}</span>
                              <p className="text-slate-400 text-sm">{method.lastFour}</p>
                            </div>
                            {selectedPayment === method.id && (
                              <Check className="h-6 w-6 text-panda-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center gap-3 p-4 bg-jade-500/10 border border-jade-500/30 rounded-xl">
                      <Lock className="h-5 w-5 text-jade-400" />
                      <span className="text-sm text-jade-300">Your payment is secured with 256-bit encryption</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                      <Button onClick={handleBack} variant="ghost" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={handleNext} className="bg-panda-500 hover:bg-panda-600">
                        Review Order
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: REVIEW */}
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Review Your Order</h2>
                    
                    {/* Order Items */}
                    <div className="bg-ink-850 border border-border rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">Items ({ORDER_ITEMS.length})</h3>
                      <div className="space-y-4">
                        {ORDER_ITEMS.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-ink-800 rounded-xl flex items-center justify-center">
                              <span className="text-3xl">{item.image}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-slate-200 font-medium">{item.name}</h4>
                              <p className="text-sm text-slate-400">{item.variant} × {item.quantity}</p>
                            </div>
                            <span className="text-slate-200 font-bold">¥{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address Summary */}
                    <div className="bg-ink-850 border border-border rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-200">Shipping Address</h3>
                        <button onClick={() => setCurrentStep(1)} className="text-panda-400 text-sm hover:underline">Edit</button>
                      </div>
                      {SAVED_ADDRESSES.filter(a => a.id === selectedAddress).map(addr => (
                        <div key={addr.id} className="text-slate-300">
                          <p className="font-medium">{addr.name} • {addr.phone}</p>
                          <p className="text-sm text-slate-400">{addr.address}</p>
                        </div>
                      ))}
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-ink-850 border border-border rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-200">Payment Method</h3>
                        <button onClick={() => setCurrentStep(2)} className="text-panda-400 text-sm hover:underline">Edit</button>
                      </div>
                      {PAYMENT_METHODS.filter(p => p.id === selectedPayment).map(method => (
                        <div key={method.id} className="flex items-center gap-3">
                          <span className="text-2xl">{method.icon}</span>
                          <span className="text-slate-300">{method.name} {method.lastFour}</span>
                        </div>
                      ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                      <Button onClick={handleBack} variant="ghost" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={handlePlaceOrder} 
                        disabled={isProcessing}
                        className="bg-jade-500 hover:bg-jade-600 px-8"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-5 w-5" />
                            Place Order • ¥{total}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ===== ORDER SUMMARY SIDEBAR ===== */}
            <div className="lg:col-span-1">
              <div className="bg-ink-850 border border-border rounded-2xl p-6 sticky top-32">
                <h3 className="text-lg font-bold text-slate-200 mb-4">Order Summary</h3>
                
                {/* Mini Items */}
                <div className="space-y-3 mb-6">
                  {ORDER_ITEMS.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ink-800 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{item.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">×{item.quantity}</p>
                      </div>
                      <span className="text-sm text-slate-200 font-medium">¥{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-200">¥{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span className="text-slate-200">¥{shipping}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-200 pt-2 border-t border-border">
                    <span>Total</span>
                    <span>¥{total}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield className="h-4 w-4 text-jade-400" />
                    Escrow Protection
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Truck className="h-4 w-4 text-sky-400" />
                    Est. delivery: 3-5 days
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-4 w-4 text-silk-400" />
                    24/7 Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== AI HUNGRY HIPPO ===== */}
        <AnimatePresence>
          {showAIHippo && !aiDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 50 }}
              className="fixed bottom-6 right-6 z-40 max-w-sm"
            >
              <div className="bg-gradient-to-br from-panda-600/90 to-jade-600/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🦛</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold text-sm">Hungry Hippo</h4>
                      <button 
                        onClick={() => {
                          setShowAIHippo(false);
                          setAiDismissed(true);
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      🔒 Need help completing your order? I can answer any questions about payment or shipping!
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Ask a Question
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/70 hover:text-white text-xs"
                        onClick={() => setShowAIHippo(false)}
                      >
                        I'm good
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BuyerShell>
  );
}
