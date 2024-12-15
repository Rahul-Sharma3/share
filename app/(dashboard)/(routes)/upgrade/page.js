"use client"
import { useState } from 'react'
import { Check, ArrowRight, Shield, Upload, Clock, Users, Database, Zap } from 'lucide-react'

export default function UpgradePage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'Upload up to 2MB files',
        '5 files per day',
        'Basic sharing features',
        'Email support',
      ],
      buttonText: 'Current Plan',
      disabled: true,
    },
    {
      name: 'Pro',
      price: billingPeriod === 'monthly' ? 799 : 7999,
      description: 'Best for professionals',
      features: [
        'Upload up to 8GB files',
        'Unlimited files',
        'Real-time file sharing',
        'Password protection',
        'Priority support',
        'No watermarks',
        'File analytics',
        'Custom link sharing'
      ],
      buttonText: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: billingPeriod === 'monthly' ? 2499 : 24999,
      description: 'For large teams and businesses',
      features: [
        'Upload up to 16GB files',
        'Unlimited files & storage',
        'Team collaboration',
        'Advanced security features',
        '24/7 priority support',
        'Custom branding',
        'API access',
        'Real-time collaboration',
        'Version control',
        'Audit logs'
      ],
      buttonText: 'Contact Sales',
    },
  ]

  const features = [
    {
      icon: Upload,
      title: 'Larger File Uploads',
      description: 'Upload files up to 10GB in size with our premium plans.'
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Get advanced security features including password protection and encryption.'
    },
    {
      icon: Clock,
      title: 'Longer Storage',
      description: 'Keep your files stored safely for longer periods.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team members seamlessly.'
    },
    {
      icon: Database,
      title: 'More Storage',
      description: 'Get increased storage capacity for all your needs.'
    },
    {
      icon: Zap,
      title: 'Faster Uploads',
      description: 'Experience faster upload speeds with premium plans.'
    },
  ]

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upgrade Your Plan
        </h1>
        <p className="text-xl text-gray-600">
          Choose the perfect plan for your needs
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center space-x-4 mb-12">
        <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-gray-200"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              billingPeriod === 'annual' ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-sm ${billingPeriod === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
          Annual <span className="text-green-500 font-medium">(Save 20%)</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border ${
              plan.popular ? 'border-blue-600 shadow-blue-100' : 'border-gray-200'
            } bg-white p-8 shadow-lg`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                Most Popular
              </span>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              <p className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                ₹{plan.price}
                </span>
                <span className="text-sm font-semibold text-gray-500">
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              </p>
            </div>

            <ul className="mb-6 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm text-gray-500">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : plan.disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
              disabled={plan.disabled}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-blue-100 p-3">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 