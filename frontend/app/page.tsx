import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Shield, Code } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Development",
    description: "Start building your SaaS in minutes, not months.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "JWT authentication, session management, and security best practices.",
  },
  {
    icon: Code,
    title: "Production Ready",
    description:
      "Clean code, TypeScript, tests, and deployment configs included.",
  },
];

const techStack = [
  "Next.js 14",
  "NestJS",
  "MongoDB",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "JWT Auth",
  "Docker",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">MR Starter</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Production-Ready
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              SaaS Template
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Build your next SaaS application with a modern, scalable stack.
            Authentication, dashboard, and API included out of the box.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Building Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href="https://github.com/matheusregis/mr-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Everything You Need
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Modern Tech Stack
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech}
                className="flex items-center justify-center rounded-lg border bg-card p-4 text-center font-medium"
              >
                <Check className="mr-2 h-4 w-4 text-green-600" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Build?</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Start building your SaaS application today with MR Starter.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MR Starter. Built with ❤️ by Matheus Regis.</p>
        </div>
      </footer>
    </div>
  );
}
