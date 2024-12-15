import React from 'react'
import { Shield, Target, Heart, Users } from 'lucide-react'

function Aboutus() {
  const cards = [
    {
      title: 'Our Mission',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      content: 'We aim to be leaders in our industry by focusing on quality, innovation, and sustainability. Our mission is to deliver exceptional products while maintaining ethical business practices and environmental responsibility.'
    },
    {
      title: 'Our Vision',
      icon: Target,
      gradient: 'from-purple-500 to-pink-500',
      content: 'We envision a world where technology and people work hand in hand to create a sustainable, inclusive, and prosperous future. We are dedicated to staying at the forefront of our industry, constantly evolving and improving.'
    },
    {
      title: 'Our Values',
      icon: Heart,
      gradient: 'from-red-500 to-orange-500',
      content: 'Integrity, transparency, and customer focus are at the heart of everything we do. We believe in creating long-lasting relationships built on trust, and we strive to exceed expectations every day.'
    },
    {
      title: 'Our Team',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      content: 'Our team is made up of talented, passionate individuals who bring unique skills and perspectives to our company. Together, we work hard to achieve our goals and support each other in creating a positive and dynamic workplace.'
    }
  ]

  return (
    <section className="min-h-[100dvh] bg-gray-900 relative overflow-y-auto">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-800 animate-gradient bg-[length:200%_200%] opacity-50" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto max-w-screen-xl px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-4xl 
            font-extrabold text-transparent sm:text-6xl text-center mb-8 animate-title">
            About Us
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-white/80 text-center mb-12
            animate-fade-in">
            Welcome to ShareVault! We are passionate about bringing you the best products and services, and
            we are committed to making a positive impact on our community.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group relative rounded-xl backdrop-blur-md bg-white/5 p-6
                  border border-white/10 hover:border-white/20
                  transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]
                  overflow-hidden animate-cards"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Icon */}
                <div className="relative mb-4 w-12 h-12 flex items-center justify-center rounded-full 
                  bg-white/10 group-hover:scale-110 transition-transform duration-500">
                  <card.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h2 className={`text-2xl font-semibold text-white mb-4 transform transition-all duration-500 
                  group-hover:scale-110 group-hover:bg-gradient-to-r ${card.gradient}`}>
                  {card.title}
                </h2>
                <p className="text-gray-300 transition-colors duration-500 group-hover:text-white relative z-10">
                  {card.content}
                </p>

                {/* Gradient overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 
                  transition-opacity duration-500 bg-gradient-to-br ${card.gradient}`} />

                {/* Animated border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent 
                  via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl 
                  transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutus