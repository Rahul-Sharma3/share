import React from 'react'
import constant from './_utils/constant'
import { ArrowRight, MoveRight, ChevronRight, Shield, Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'

function Hero() {
  return (
    <div>
      <section className="min-h-[100dvh] text-white relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-800 animate-gradient bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative mx-auto max-w-screen-xl px-4 min-h-screen flex items-center justify-center">
          <div className="mx-auto max-w-3xl text-center py-20 mt-4">
            <h1 className="bg-gradient-to-r from-blue-200 via-blue-400 to-purple-400 bg-clip-text text-3xl font-extrabold py-4 text-transparent sm:text-5xl">
              Upload, Save and easily Share your files in one place
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-gray-100">
              {constant.desc}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {/* Get Started Button */}
              <Link
                href="/upload"
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-500"
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <MoveRight className="h-5 w-5" />
                </span>

                <span className="text-sm font-medium transition-all group-hover:me-4">
                  Get Started
                </span>
              </Link>

              {/* Learn More Button */}
              <Link
                href="/about"
                className="group relative inline-flex items-center overflow-hidden rounded-full border-2 border-blue-600 px-8 py-3 focus:outline-none focus:ring"
              >
                <span className="absolute inset-y-0 left-0 w-[0px] bg-blue-600 transition-all group-hover:w-full"></span>

                <span className="relative text-sm font-medium text-blue-600 transition-colors group-hover:text-white">
                  Learn More
                </span>&nbsp;&nbsp;

                <span className="absolute -end-full transition-all group-hover:end-4">
                  <ChevronRight className="h-5 w-5" />
                </span>
              </Link>
            </div>

            {/* Optional: Add feature highlights */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                { 
                  title: 'Secure', 
                  desc: 'End-to-end encryption',
                  icon: Shield,
                  gradient: 'from-blue-500 to-cyan-500'
                },
                { 
                  title: 'Fast', 
                  desc: 'Quick file transfers',
                  icon: Zap,
                  gradient: 'from-purple-500 to-pink-500'
                },
                { 
                  title: 'Simple', 
                  desc: 'Easy to use interface',
                  icon: Sparkles,
                  gradient: 'from-emerald-500 to-teal-500'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl backdrop-blur-md bg-white/10 p-6 text-center 
                    border border-white/10 hover:border-white/20
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl bg-gradient-to-br ${feature.gradient}`} />
                  
                  {/* Icon */}
                  <div className="relative mb-4 mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/10">
                    <feature.icon className={`w-6 h-6 text-${feature.gradient.split('-')[2]}-500`} />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className={`text-lg font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent 
                      transform transition-all duration-300 group-hover:scale-110`}>
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-300 transition-colors duration-300 group-hover:text-white">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Animated border gradient */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
