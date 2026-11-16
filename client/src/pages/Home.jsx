import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  LayoutDashboard,
  Trophy,
  GitBranch,
  MessageCircle,
  Calendar,
  ClipboardList,
  UsersRound,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Target,
  BookOpen,
  UserCheck,
  Briefcase,
  FolderGit2,
  Presentation,
  Network,
  Award,
  Building2,
  Scale,
  Settings2,
} from "lucide-react";

import Navbar from "../components/Navbar.jsx";

const keyScopes = [
  {
    title: "Learning & Development",
    desc: "Structured learning pathways, hands-on technical training, practical exercises, and curated study resources.",
    icon: BookOpen,
  },
  {
    title: "Mentorship Programme",
    desc: "Direct guidance from experienced professionals supporting fresh graduates and junior members as they grow.",
    icon: UserCheck,
  },
  {
    title: "Career Development",
    desc: "Practical CV reviews, mock interviews, career coaching, and job-readiness support to help you land your next role.",
    icon: Briefcase,
  },
  {
    title: "Technical Projects",
    desc: "Real-world collaborative builds that strengthen your GitHub portfolio and give you genuine production experience.",
    icon: FolderGit2,
  },
  {
    title: "Workshops & Events",
    desc: "Interactive technical workshops, webinars, seminars, hackathons, and regular community meetups.",
    icon: Presentation,
  },
  {
    title: "Professional Networking",
    desc: "Meaningful connections linking members with industry leaders, local companies, and partner tech communities.",
    icon: Network,
  },
  {
    title: "Certification & Recognition",
    desc: "Study support for professional certifications alongside formal recognition for member milestones and achievements.",
    icon: Award,
  },
  {
    title: "Internship & Job Opportunities",
    desc: "Curated access to internships, job openings, volunteering roles, and career-launching opportunities.",
    icon: Building2,
  },
  {
    title: "Community Governance",
    desc: "Clear membership standards, accountable leadership, fair participation guidelines, and transparent administration.",
    icon: Scale,
  },
  {
    title: "Digital Platform Management",
    desc: "Integrated member dashboards, smart notifications, activity tracking, project coordination, and role-based access.",
    icon: Settings2,
  },
];

const features = [
  {
    title: "Member Onboarding",
    desc: "Join a structured network of builders and learners with a simple, welcoming registration process.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=650&fit=crop",
  },
  {
    title: "Verified Membership",
    desc: "Every application is reviewed by our leadership team to ensure a safe, focused, and supportive space.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&h=650&fit=crop",
  },
  {
    title: "Project Workspaces",
    desc: "Kick off new initiatives, track real-world builds, and keep your team’s work moving forward in one hub.",
    icon: LayoutDashboard,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=650&fit=crop",
  },
  {
    title: "Task Tracking",
    desc: "Break big ideas into actionable steps, assign owners, and stay on top of what needs to get done next.",
    icon: ClipboardList,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=650&fit=crop",
  },
  {
    title: "Team Collaboration",
    desc: "Form cross-functional squads, share expertise, and build alongside peers who share your drive.",
    icon: UsersRound,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&h=650&fit=crop",
  },
  {
    title: "Milestones & Goals",
    desc: "Define clear targets, celebrate key launches, and keep everyone aligned from kickoff to delivery.",
    icon: Target,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=900&h=650&fit=crop",
  },
  {
    title: "Visual Timelines",
    desc: "Map out project schedules, spot dependencies early, and see how daily progress adds up over time.",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=900&h=650&fit=crop",
  },
  {
    title: "Community Discussions",
    desc: "Ask questions, swap feedback, and brainstorm solutions in real time with fellow members.",
    icon: MessageCircle,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&h=650&fit=crop",
  },
  {
    title: "Member Recognition",
    desc: "Highlight consistent contributors and celebrate the peers who help our community thrive.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&h=650&fit=crop",
  },
];

const teamMembers = [
  {
    name: "Abdirahman Yar",
    role: "Transitional Director",
  },
  {
    name: "Ina Khalil",
    role: "Transitional Deputy Director",
  },
  {
    name: "One Ten",
    role: "Transitional Deputy Director",
  },
];

const benefits = [
  "A curated, supportive network of learners and builders",
  "Hands-on experience through real collaborative projects",
  "1-on-1 mentorship, career guidance, and CV preparation",
  "Access to workshops, hackathons, and job opportunities",
  "Recognition and certification for your contributions",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <Navbar />

      {/* HERO */}
      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border soft-border px-4 py-2 text-xs font-semibold tracking-wide text-muted">
              Venn Tech Community
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Build Real Skills, Collaborate on Projects, and Grow Together.
            </h1>

            <p className="text-muted mt-6 max-w-xl text-base leading-8 md:text-lg">
              Venn Tech is a non-profit tech collective dedicated to helping
              aspiring and experienced builders sharpen their digital skills,
              ship meaningful work, and earn recognized credentials.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="primary-button">
                Join the Community <ArrowUpRight size={18} />
              </Link>

              <Link to="/login" className="secondary-button">
                Member Sign In
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t soft-border pt-7">
              <div>
                <p className="text-3xl font-bold">10</p>
                <p className="text-muted mt-2 text-xs sm:text-sm">
                  Core programmes
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-muted mt-2 text-xs sm:text-sm">
                  Community-driven
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">1</p>
                <p className="text-muted mt-2 text-xs sm:text-sm">
                  Unified workspace
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-2xl border soft-border">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=900&fit=crop"
                alt="Developers and designers collaborating around a table"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-xl border soft-border card-bg p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border soft-border">
                <LayoutDashboard size={21} />
              </div>

              <div>
                <p className="font-semibold">Everything in One Place</p>
                <p className="text-muted mt-1 text-sm">
                  From mentorship and workshops to project roadmaps—no more
                  juggling scattered tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY AREAS & SCOPE */}
      <section className="containerX py-16 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            What We Do
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Our Core Pillars & Programmes
          </h2>

          <p className="text-muted mt-4 leading-8">
            We support members at every stage of their tech journey—from
            writing their first lines of code to landing industry roles and
            leading community initiatives.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {keyScopes.map((scope, index) => {
            const Icon = scope.icon;

            return (
              <article
                key={scope.title}
                className="flex flex-col justify-between rounded-2xl border soft-border card-bg p-6 transition duration-300 hover:-translate-y-1 md:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border soft-border">
                      <Icon size={21} />
                    </div>
                    <span className="text-muted text-xs font-semibold tracking-wider">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold">{scope.title}</h3>

                  <p className="text-muted mt-3 text-sm leading-7">
                    {scope.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="containerX py-16 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            Inside the Workspace
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tools Built for Learning and Shipping
          </h2>

          <p className="text-muted mt-4 leading-8">
            Whether you are taking on your first tech project or leading a
            squad, our digital platform gives you the structure to turn ideas
            into completed work.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-2xl border soft-border card-bg transition duration-300 hover:-translate-y-1"
              >
                <div className="grid h-full sm:grid-cols-2">
                  <div className="flex flex-col justify-between p-6 md:p-7">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border soft-border">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-5 text-xl font-bold">
                        {feature.title}
                      </h3>

                      <p className="text-muted mt-3 text-sm leading-7">
                        {feature.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      Platform Tool
                    </div>
                  </div>

                  <div className="min-h-56 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                      className="h-full min-h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ABOUT THE PLATFORM */}
      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
              Our Mission
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Bridging the Gap Between Learning and Real-World Experience.
            </h2>

            <p className="text-muted mt-5 leading-8">
              Tutorials only take you so far. Real growth happens when you
              collaborate with others, solve messy problems, and see a project
              through from start to finish.
            </p>

            <p className="text-muted mt-4 leading-8">
              We built Venn Tech Community to give emerging talent a structured,
              encouraging environment to practice their craft, build a
              portfolio, and grow alongside peers.
            </p>

            <Link to="/register" className="primary-button mt-8">
              Apply for Membership <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border soft-border">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=900&fit=crop"
              alt="Modern collaborative workspace"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="containerX py-16 md:py-24">
        <div className="rounded-2xl border soft-border card-bg p-7 md:p-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
                Why Venn Tech?
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                A Place Where Your Effort Actually Counts.
              </h2>

              <p className="text-muted mt-5 leading-8">
                We believe in learning by doing. Instead of passive lectures, you
                get hands-on teamwork, honest feedback, and a community that
                celebrates your milestones.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 size={21} className="mt-1 shrink-0" />
                  <p className="leading-7">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="containerX py-16 md:py-24">
        <div className="mb-12 text-center">
          <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            Leadership
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Meet the People Guiding Venn
          </h2>

          <p className="text-muted mx-auto mt-4 max-w-xl">
            Our transitional leadership team is dedicated to building an open,
            impactful home for local and global tech talent.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border soft-border card-bg text-center"
            >
              <div className="flex h-48 items-center justify-center border-b soft-border bg-[rgb(var(--bg))]/40">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border soft-border card-bg">
                  <Users size={34} className="text-muted" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-muted mt-1.5 text-sm">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMMUNITY ACTIVITY */}
      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border soft-border">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=900&fit=crop"
              alt="Team members brainstorming together"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
              How We Work
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Great Software Is Built Together.
            </h2>

            <p className="text-muted mt-5 leading-8">
              Technology is better when knowledge is shared openly. Inside Venn
              Tech, members team up across different skill levels to tackle real
              challenges and help one another level up.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4">
                <Code2 size={22} className="shrink-0" />
                <span className="font-medium">
                  Practical, hands-on skill building
                </span>
              </div>

              <div className="flex items-center gap-4">
                <GitBranch size={22} className="shrink-0" />
                <span className="font-medium">
                  Team-driven projects and code reviews
                </span>
              </div>

              <div className="flex items-center gap-4">
                <MessageCircle size={22} className="shrink-0" />
                <span className="font-medium">
                  Peer mentorship and open discussions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="containerX pb-20 pt-10">
        <div className="rounded-2xl border soft-border card-bg p-8 md:p-14">
          <p className="text-muted mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
            Ready to Start?
          </p>

          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Take the Next Step in Your Tech Journey With Us.
          </h2>

          <p className="text-muted mt-5 max-w-2xl leading-8">
            Create your account today to connect with fellow builders, join
            active projects, and start growing your skills.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="primary-button">
              Create an Account <ArrowUpRight size={18} />
            </Link>

            <Link to="/login" className="secondary-button">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t soft-border">
        <div className="containerX flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/eee.svg"
              alt="Venn Tech Community Logo"
              className="h-12 w-12 object-contain"
            />

            <div>
              <p className="font-bold">Venn Tech Community</p>
              <p className="text-muted mt-1 text-sm">
                Empowering builders through collaboration and shared knowledge.
              </p>
            </div>
          </div>

          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Venn Tech Community. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
