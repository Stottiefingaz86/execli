import Navigation from '@/components/Navigation'

export default function Agency() {
  const services = [
    {
      title: "White-Label Solutions",
      description: "Customize Execli with your branding and offer it as your own platform to clients.",
      features: ["Custom branding", "Dedicated support", "Revenue sharing", "API access"],
      icon: "🏢"
    },
    {
      title: "Implementation Services",
      description: "Our expert team helps you set up and optimize Execli for your specific use cases.",
      features: ["Custom workflows", "Data migration", "Training sessions", "Ongoing support"],
      icon: "⚙️"
    },
    {
      title: "Consulting & Strategy",
      description: "Strategic guidance to maximize the value of Execli for your organization.",
      features: ["Process optimization", "ROI analysis", "Best practices", "Change management"],
      icon: "📊"
    }
  ]

  const benefits = [
    {
      title: "Increased Revenue",
      description: "Add Execli to your service portfolio and unlock new revenue streams.",
      metric: "+40%"
    },
    {
      title: "Faster Delivery",
      description: "Reduce project timelines by leveraging our pre-built automation tools.",
      metric: "-60%"
    },
    {
      title: "Client Satisfaction",
      description: "Deliver better results and improve client retention with powerful automation.",
      metric: "+85%"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#f3f4f6] relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117] via-[#1a1b23] to-[#0f1117]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#3b82f6]/20 via-[#8b5cf6]/15 to-transparent blur-3xl opacity-60" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#8b5cf6]/15 to-transparent blur-2xl opacity-50" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/10 to-transparent blur-2xl opacity-40" />
      </div>

      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              For <span className="text-[#3b82f6]">Agencies</span>
            </h1>
            <p className="text-xl text-[#B0B0C0] max-w-3xl mx-auto">
              Partner with Execli to deliver exceptional results for your clients. Our platform is designed to scale with your agency's growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg">
                Become a Partner
              </button>
              <button className="btn-secondary text-lg">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-text mb-6">
              Why Agencies Choose Execli
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join hundreds of agencies that have transformed their service delivery with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card p-8 text-center space-y-4">
                <div className="text-4xl font-bold text-accent">{benefit.metric}</div>
                <h3 className="text-xl font-semibold text-text">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-text mb-6">
              Our Agency Services
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive solutions designed specifically for agencies and consultancies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card p-8 space-y-6">
                <div className="text-4xl">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-text">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-text mb-6">
              Partnership Tiers
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the partnership level that best fits your agency's needs and goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="card p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-text">Starter</h3>
                <div className="text-4xl font-bold text-accent mt-4">$0</div>
                <p className="text-gray-300">Perfect for small agencies</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Basic white-label</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Email support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Standard integrations</span>
                </li>
              </ul>
              <button className="btn-secondary w-full">Get Started</button>
            </div>

            {/* Professional */}
            <div className="card p-8 space-y-6 border-2 border-accent relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-text">Professional</h3>
                <div className="text-4xl font-bold text-accent mt-4">$299</div>
                <p className="text-gray-300">For growing agencies</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Advanced white-label</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Revenue sharing</span>
                </li>
              </ul>
              <button className="btn-primary w-full">Choose Professional</button>
            </div>

            {/* Enterprise */}
            <div className="card p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-text">Enterprise</h3>
                <div className="text-4xl font-bold text-accent mt-4">Custom</div>
                <p className="text-gray-300">For large agencies</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Full customization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">Custom development</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-gray-300">SLA guarantees</span>
                </li>
              </ul>
              <button className="btn-secondary w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-text">
              Ready to Partner with Execli?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join our partner network and start delivering exceptional results to your clients today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Apply for Partnership
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Download Partner Kit
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 