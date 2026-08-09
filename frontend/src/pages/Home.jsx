import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-slate-950 text-white">
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Now Enrolling — 2026 Cohort
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Master the skills that{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                shape the future
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
              LearnHub delivers expert-led courses in programming, modern frameworks, 
              and professional skills — designed for ambitious learners who want real results.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                to="/courses"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Explore Courses
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                Create Free Account
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-sm text-slate-500">
              Trusted by 10,000+ students and professionals worldwide
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "10k+", label: "Active Learners" },
              { value: "200+", label: "Expert Instructors" },
              { value: "94%", label: "Completion Rate" },
              { value: "24/7", label: "Mentor Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold uppercase tracking-widest text-indigo-400">
              Why LearnHub
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for serious learners
            </p>
            <p className="mt-4 text-lg text-slate-400">
              Everything you need to go from beginner to job-ready — without the fluff.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: "Project-Based Learning",
                description:
                  "Build real applications and ship portfolio-ready work that employers actually care about.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                ),
              },
              {
                title: "Industry Experts",
                description:
                  "Learn directly from active engineers and tech leaders who work at top companies.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                ),
              },
              {
                title: "Lifetime Access",
                description:
                  "Learn at your own pace. Revisit any course anytime — your progress is always saved.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.04]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-t border-white/10 bg-white/[0.02] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold uppercase tracking-widest text-indigo-400">
              How it works
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start learning in minutes
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                description: "Sign up free and tell us your learning goals.",
              },
              {
                step: "02",
                title: "Choose your path",
                description: "Browse curated courses tailored to your career goals.",
              },
              {
                step: "03",
                title: "Build & grow",
                description: "Complete projects, earn certificates, and advance your career.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-bold text-indigo-400">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to level up your skills?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Join thousands of learners who are already building the future with LearnHub.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-100 hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
              >
                Browse all courses →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-black text-white">
                L
              </div>
              <span className="text-sm font-semibold text-white">LearnHub</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} LearnHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;