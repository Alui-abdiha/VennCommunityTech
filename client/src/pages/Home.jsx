
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
} from "lucide-react";

import Navbar from "../components/Navbar.jsx";

const features = [
  {
    title: "Member Registration",
    desc: "Allow new members to register and join the community in a structured way with organized registration workflows.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=650&fit=crop",
  },
  {
    title: "Admin Approval",
    desc: "Review and approve new members before granting access, with role-based permissions and account management.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&h=650&fit=crop",
  },
  {
    title: "Project Management",
    desc: "Organize projects, monitor progress, and keep your community's work structured in one place.",
    icon: LayoutDashboard,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=650&fit=crop",
  },
  {
    title: "Task Management",
    desc: "Create tasks, assign responsibilities, track progress, and help members stay focused on their work.",
    icon: ClipboardList,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=650&fit=crop",
  },
  {
    title: "Team Collaboration",
    desc: "Bring members together, organize teams, share responsibilities, and work toward common goals.",
    icon: UsersRound,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&h=650&fit=crop",
  },
  {
    title: "Project Milestones",
    desc: "Set project goals, monitor important deadlines, and follow progress from beginning to completion.",
    icon: Target,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=900&h=650&fit=crop",
  },
  {
    title: "Project Timeline",
    desc: "Visualize project schedules, follow task dependencies, and understand how work progresses over time.",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=900&h=650&fit=crop",
  },
  {
    title: "Community Chat",
    desc: "Communicate with team members, exchange ideas, and stay connected while working on projects.",
    icon: MessageCircle,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&h=650&fit=crop",
  },
  {
    title: "Leaderboard",
    desc: "Recognize contributions and highlight active members through community performance rankings.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&h=650&fit=crop",
  },
];

const teamMembers = [
  {
    name: "Abdiraham yar ",
    role: "Transitional Director",
  },
  {
    name: "Ina khalil",
    role: "Transitional Deputy Director",
  },
  {
    name: "One ten",
    role: "Transitional Deputy Director",
  },
];

const benefits = [
  "Organized member registration and approval",
  "Role-based access and dashboards",
  "Project and task management",
  "Team collaboration and communication",
  "Progress tracking and performance recognition",
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
              Venn Tech Community Platform
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Learn, Grow, Develop Skills & Earn Professional Certification Together.
            </h1>

            <p className="text-muted mt-6 max-w-xl text-base leading-8 md:text-lg">
              Venn Tech Community is a non-profit technology organization
              focused on empowering individuals through digital skills
              development, collaboration, and innovation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="primary-button">
                Get Started <ArrowUpRight size={18} />
              </Link>

              <Link to="/login" className="secondary-button">
                Sign In
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t soft-border pt-7">
              <div>
                <p className="text-3xl font-bold">8+</p>
                <p className="text-muted mt-2 text-xs sm:text-sm">
                  Key Capabilities
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-muted mt-2 text-xs sm:text-sm">
                  Role-based flow
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">1</p>
                <p className="text-muted mt-2 text-xs sm:text-sm">
                  Connected platform
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-2xl border soft-border">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=900&fit=crop"
                alt="People collaborating in a professional workspace"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-xl border soft-border card-bg p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border soft-border">
                <LayoutDashboard size={21} />
              </div>

              <div>
                <p className="font-semibold">One Connected Workspace</p>
                <p className="text-muted mt-1 text-sm">
                  Projects, teams, tasks and community activities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="containerX py-16 md:py-24">

        <div className="mb-12 max-w-2xl">
          <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            What the platform offers
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything Your Community Needs
          </h2>

          <p className="text-muted mt-4 leading-8">
            From member registration to project management, Venn Tech
            Community brings essential community tools together in one
            organized platform.
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
                <div className="grid sm:grid-cols-2">

                  <div className="flex flex-col justify-center p-6 md:p-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border soft-border">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {feature.title}
                    </h3>

                    <p className="text-muted mt-3 text-sm leading-7">
                      {feature.desc}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                      Platform feature
                      <ArrowUpRight size={16} />
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
              About Venn Tech Community
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Building Skills, Connections and Opportunities.
            </h2>

            <p className="text-muted mt-5 leading-8">
              We aim to create an environment where individuals can
              develop their technical abilities, work together on
              meaningful projects, and grow through shared knowledge
              and experience.
            </p>

            <p className="text-muted mt-4 leading-8">
              Our platform provides tools to organize members, manage
              projects, coordinate teams, and recognize contributions.
            </p>

            <Link
              to="/register"
              className="primary-button mt-8"
            >
              Become a Member <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border soft-border">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=900&fit=crop"
              alt="Collaborative working environment"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* WHY JOIN */}
      <section className="containerX py-16 md:py-24">
        <div className="rounded-2xl border soft-border card-bg p-7 md:p-12">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
                Why join us?
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                More Than Just a Technology Community.
              </h2>

              <p className="text-muted mt-5 leading-8">
                Be part of a community that encourages learning,
                teamwork, knowledge sharing, and professional growth.
                Connect with others and take part in meaningful work.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={21}
                    className="mt-1 shrink-0"
                  />

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
            The people behind Venn
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Meet Our Team
          </h2>

          <p className="text-muted mt-4">
            Dedicated professionals building the future of tech communities.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border soft-border card-bg"
            >
              <div className="flex h-56 items-center justify-center bg-[rgb(var(--card))]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border soft-border">
                  <Users size={42} className="text-muted" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">
                  {member.name}
                </h3>

                <p className="text-muted mt-2 text-sm">
                  {member.role}
                </p>
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
              alt="Community members working together"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
              Learn and collaborate
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Grow Together Through Collaboration.
            </h2>

            <p className="text-muted mt-5 leading-8">
              Technology becomes more meaningful when people share
              knowledge, exchange ideas, and work together. Venn Tech
              Community provides an organized space for members to
              participate in projects and community activities.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4">
                <Code2 size={22} />
                <span className="font-medium">Technical skill development</span>
              </div>

              <div className="flex items-center gap-4">
                <GitBranch size={22} />
                <span className="font-medium">Collaborative projects</span>
              </div>

              <div className="flex items-center gap-4">
                <MessageCircle size={22} />
                <span className="font-medium">Community communication</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="containerX pb-20 pt-10">
        <div className="rounded-2xl border soft-border card-bg p-8 md:p-14">

          <p className="text-muted mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
            Get started today
          </p>

          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Your Next Opportunity Starts With Being Part of a Community.
          </h2>

          <p className="text-muted mt-5 max-w-2xl leading-8">
            Join Venn Tech Community, connect with other members,
            develop your skills, and take part in collaborative
            technology projects.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="primary-button">
              Join Now <ArrowUpRight size={18} />
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

    {/* Logo and Community Name */}
    <div className="flex items-center gap-3">
      <img
        src="/eee.svg"
        alt="Venn Tech Community Logo"
        className="h-12 w-12 object-contain"
      />

      <div>
        <p className="font-bold">Venn Tech Community</p>
        <p className="text-muted mt-1 text-sm">
          Learning, collaboration and innovation.
        </p>
      </div>
    </div>

    {/* Copyright */}
    <p className="text-muted text-sm">
      © {new Date().getFullYear()} Venn Tech Community. All rights reserved.
    </p>

  </div>
</footer>
</main>
  );
}
