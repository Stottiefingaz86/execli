import Navigation from '@/components/Navigation'

export default function Demo() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-semibold text-text">
              See <span className="text-accent">Execli</span> in Action
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of our platform through interactive demos and real-world use cases.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Dashboard */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Demo Video */}
              <div className="lg:col-span-2">
                <div className="aspect-video bg-card border border-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-gray-300">Interactive Demo Video</p>
                    <button className="btn-primary">Play Demo</button>
                  </div>
                </div>
              </div>

              {/* Demo Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-text">Key Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Real-time Analytics</h4>
                      <p className="text-sm text-gray-300">Live dashboard with performance metrics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Workflow Automation</h4>
                      <p className="text-sm text-gray-300">Visual builder for custom workflows</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Team Collaboration</h4>
                      <p className="text-sm text-gray-300">Built-in chat and project management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Elements */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Demo */}
            <div className="card p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-text">Try Our Form Builder</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Message</label>
                  <textarea 
                    placeholder="Enter your message"
                    rows={4}
                    className="input-field w-full resize-none"
                  ></textarea>
                </div>
                <button className="btn-primary w-full">Submit Demo</button>
              </div>
            </div>

            {/* Chart Demo */}
            <div className="card p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-text">Analytics Preview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text">Monthly Growth</span>
                  <span className="text-accent font-semibold">+24%</span>
                </div>
                <div className="h-32 bg-card border border-white/10 rounded-lg flex items-end justify-around p-4">
                  <div className="w-8 bg-accent rounded-t" style={{height: '60%'}}></div>
                  <div className="w-8 bg-accent rounded-t" style={{height: '80%'}}></div>
                  <div className="w-8 bg-accent rounded-t" style={{height: '45%'}}></div>
                  <div className="w-8 bg-accent rounded-t" style={{height: '90%'}}></div>
                  <div className="w-8 bg-accent rounded-t" style={{height: '75%'}}></div>
                  <div className="w-8 bg-accent rounded-t" style={{height: '95%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-accent font-semibold">1,234</div>
                    <div className="text-gray-300">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-accent font-semibold">89%</div>
                    <div className="text-gray-300">Satisfaction</div>
                  </div>
                </div>
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
              Ready to Experience the Full Platform?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start your free trial today and see how Execli can transform your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 