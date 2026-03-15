import { Link } from "react-router-dom";
import { Users, ShieldCheck, LayoutDashboard, Trophy } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const features = [
  {
    title: "Member Registration",
    desc: "Allow new members to register and join the community in a structured way.",
    icon: Users,
  },
  {
    title: "Admin Approval",
    desc: "Review and approve users before giving them access to the platform.",
    icon: ShieldCheck,
  },
  {
    title: "Project Dashboard",
    desc: "Track projects, tasks, teams, and performance from one dashboard.",
    icon: LayoutDashboard,
  },
  {
    title: "Leaderboard",
    desc: "Reward contribution and highlight top-performing members in the community.",
    icon: Trophy,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <Navbar />

      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center rounded-full border soft-border card-bg px-4 py-1.5 text-sm text-muted">
              Community Tech Platform
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              Build and manage your tech community with confidence
            </h1>

            <p className="text-muted mt-5 max-w-xl text-base md:text-lg leading-7">
              Venn Community Tech helps you manage registration, approvals,
              teams, projects, tasks, and member contribution in one modern platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>

              <Link to="/login">
                <button className="rounded-xl border soft-border card-bg px-4 py-2 font-semibold transition hover:bg-[rgb(var(--border))]/20">
                  Sign In
                </button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted">
              <div>
                <span className="text-2xl font-black text-[rgb(var(--fg))]">4+</span>
                <p>Core modules</p>
              </div>
              <div>
                <span className="text-2xl font-black text-[rgb(var(--fg))]">100%</span>
                <p>Role-based flow</p>
              </div>
              <div>
                <span className="text-2xl font-black text-[rgb(var(--fg))]">1</span>
                <p>Unified dashboard</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] blur-3xl opacity-30 brand-gradient"></div>

            <Card className="p-6 md:p-8">
              <div className="grid gap-4">
                <div className="rounded-2xl border soft-border p-4">
                  <p className="text-sm text-muted">Platform Overview</p>
                  <h3 className="mt-2 text-xl font-bold">Smart Community Control</h3>
                  <p className="text-muted mt-2 text-sm leading-6">
                    Centralize members, teams, tasks, and approvals with a clean dashboard experience.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border soft-border p-4">
                    <p className="text-sm text-muted">Members</p>
                    <p className="mt-2 text-3xl font-black">Active</p>
                  </div>

                  <div className="rounded-2xl border soft-border p-4">
                    <p className="text-sm text-muted">Projects</p>
                    <p className="mt-2 text-3xl font-black">Tracked</p>
                  </div>
                </div>

                <div className="rounded-2xl brand-gradient p-[1px]">
                  <div className="rounded-2xl card-bg p-4">
                    <p className="text-sm text-muted">Why this platform?</p>
                    <p className="mt-2 font-semibold">
                      It gives your community a professional system instead of scattered manual management.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="containerX pb-16 md:pb-24">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">Core Features</h2>
          <p className="text-muted mt-2">
            Everything needed to grow and manage a modern tech community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="stat-icon-wrap">
                  <Icon className="stat-icon" />
                </div>

                <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                <p className="text-muted mt-2 text-sm leading-6">{feature.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="containerX pb-20">
        <div className="rounded-[2rem] border soft-border card-bg p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight">
              Ready to organize your community professionally?
            </h2>
            <p className="text-muted mt-3 leading-7">
              Start with registration, approvals, and role-based access, then scale into projects,
              tasks, and contribution tracking.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Join Now</Button>
              </Link>

              <Link to="/login">
                <button className="rounded-xl border soft-border card-bg px-4 py-2 font-semibold transition hover:bg-[rgb(var(--border))]/20">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

