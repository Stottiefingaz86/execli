import Navigation from '@/components/Navigation'

export default function HowItWorks() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-semibold text-text">
              How <span className="text-accent">Execli</span> Works
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our platform transforms your workflow and boosts team productivity through intelligent automation and seamless collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="card p-8 space-y-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-text">Connect & Integrate</h3>
                <p className="text-gray-300 leading-relaxed">
                  Seamlessly connect your existing tools and workflows. Our platform integrates with over 100+ popular services out of the box.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>One-click integrations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Custom API connections</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Real-time synchronization</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card p-8 space-y-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-text">Automate & Optimize</h3>
                <p className="text-gray-300 leading-relaxed">
                  Set up intelligent workflows that automatically handle repetitive tasks, reducing manual work by up to 80%.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Visual workflow builder</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>AI-powered suggestions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Conditional logic</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="card p-8 space-y-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-text">Scale & Grow</h3>
                <p className="text-gray-300 leading-relaxed">
                  Watch your team's productivity soar as you scale operations without the complexity. Focus on what matters most.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Performance analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Team collaboration tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Enterprise scaling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-text">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of teams who have already streamlined their operations with Execli.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 