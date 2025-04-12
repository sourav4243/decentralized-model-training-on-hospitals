import Link from 'next/link';
import { ArrowRight, BarChart3, Building2, Server, Database, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function Card({ className, title, description, icon, href, color }: CardProps) {
  return (
    <div className={cn(
      "relative group overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <div className={cn(
        "absolute inset-x-0 top-0 h-1",
        color
      )} />
      <div className="flex flex-col space-y-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          `bg-${color.split('-')[0]}-100`
        )}>
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Link
          href={href}
          className={cn(
            "inline-flex items-center text-sm font-medium",
            `text-${color.split('-')[0]}-600 hover:text-${color.split('-')[0]}-700`
          )}
        >
          Explore <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, color }: { number: number, title: string, description: string, color: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full",
        `bg-${color}-100`
      )}>
        <span className={`font-bold text-${color}-600`}>{number}</span>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

function Button({ children, href, variant = 'default' }: { children: React.ReactNode, href: string, variant?: 'default' | 'outline' }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white",
        variant === 'default' ?
          "bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4" :
          "border border-blue-600 text-blue-600 hover:bg-blue-50 h-10 py-2 px-4"
      )}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="pt-24 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-white shadow-sm mb-2">
            <span className="text-blue-600 font-medium">Machine Learning</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-gray-500">Privacy Preserving</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Federated Learning Simulation
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A demonstration of collaborative machine learning across 10 hospitals while preserving data privacy and security
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/hospital">Get Started</Button>
            <Button href="/all-hospitals" variant="outline">View Demo</Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card
            title="Hospital View"
            description="Train and manage individual hospital models with real-time accuracy metrics"
            icon={<Building2 className="h-6 w-6 text-blue-600" />}
            href="/hospital"
            color="blue-500"
          />

          <Card
            title="Server View"
            description="Monitor central model aggregation and distribution across the network"
            icon={<Server className="h-6 w-6 text-purple-600" />}
            href="/server"
            color="purple-500"
          />

          <Card
            title="Overview"
            description="Compare performance metrics across all hospitals with interactive charts"
            icon={<BarChart3 className="h-6 w-6 text-green-600" />}
            href="/all-hospitals"
            color="green-500"
          />
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-gray-500 mt-2">The federated learning process in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Local Training"
              description="Each hospital trains its own model on local data, preserving patient privacy"
              color="blue"
            />

            <StepCard
              number={2}
              title="Model Aggregation"
              description="The central server aggregates model weights without accessing raw data"
              color="purple"
            />

            <StepCard
              number={3}
              title="Global Distribution"
              description="Improved global model is distributed back to all hospitals"
              color="green"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Key Benefits</h2>
            <p className="text-gray-500 mt-2">Why federated learning is revolutionizing healthcare ML</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Privacy Preservation</h3>
              <p className="text-sm text-gray-500">Patient data never leaves the hospital, ensuring privacy compliance</p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Diverse Data Access</h3>
              <p className="text-sm text-gray-500">Models learn from diverse datasets across multiple institutions</p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Global Improvement</h3>
              <p className="text-sm text-gray-500">All participants benefit from the collective intelligence</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-8 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 font-medium">Federated Learning Simulation</p>
              <p className="text-gray-500 text-sm">Using real XGBoost models trained on the smoking dataset</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/hospital" className="text-gray-500 hover:text-gray-700 text-sm">Hospital</Link>
              <Link href="/server" className="text-gray-500 hover:text-gray-700 text-sm">Server</Link>
              <Link href="/all-hospitals" className="text-gray-500 hover:text-gray-700 text-sm">Overview</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

