import { useState, useEffect } from "react";
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
  X,
  MapPin,
  Mail,
  Globe,
} from "lucide-react";

import Navbar from "../components/Navbar.jsx";

const keyScopes = [
  {
    title: "Learning & Development",
    shortDesc:
      "Structured learning pathways, hands-on technical training, practical exercises, and curated study resources.",
    fullDesc:
      "Our Learning & Development track provides members in Hargeisa and beyond with clear, step-by-step roadmaps across web development, mobile engineering, cloud fundamentals, and UI/UX design. Members learn through guided cohorts, weekly coding challenges, and peer study groups.",
    highlights: [
      "Beginner-to-advanced technical learning tracks",
      "Hands-on coding exercises and weekly code labs",
      "Curated open-source documentation and study guides",
    ],
    icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=650&fit=crop",
  },
  {
    title: "Mentorship Programme",
    shortDesc:
      "Direct guidance from experienced professionals supporting fresh graduates and junior members as they grow.",
    fullDesc:
      "We pair university graduates and early-career developers with seasoned engineers and product builders from across the Somali tech ecosystem and diaspora. Mentors provide code reviews, architectural feedback, and personal growth check-ins.",
    highlights: [
      "1-on-1 and small-group mentorship pairings",
      "Bi-weekly code reviews and technical feedback",
      "Support transitioning from university to industry",
    ],
    icon: UserCheck,
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&h=650&fit=crop",
  },
  {
    title: "Career Development",
    shortDesc:
      "Practical CV reviews, mock interviews, career coaching, and job-readiness support to help you land your next role.",
    fullDesc:
      "Technical skills are only half the equation. Our Career Development sessions prepare members to compete for local and remote tech roles through tailored CV clinics, technical mock interviews, LinkedIn optimization, and freelance readiness.",
    highlights: [
      "Personalized tech CV and portfolio audits",
      "Live technical and behavioral mock interviews",
      "Guidance on remote work and local tech hiring",
    ],
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=650&fit=crop",
  },
  {
    title: "Technical Projects",
    shortDesc:
      "Real-world collaborative builds that strengthen your GitHub portfolio and give you genuine production experience.",
    fullDesc:
      "Members team up to design, build, and deploy open-source tools and community solutions addressing real local needs. Every participant gains practical experience with Git workflows, pull requests, issue tracking, and team delivery.",
    highlights: [
      "End-to-end team software development",
      "Public GitHub repositories to showcase your work",
      "Agile sprints, code reviews, and deployment practice",
    ],
    icon: FolderGit2,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=650&fit=crop",
  },
  {
    title: "Workshops & Events",
    shortDesc:
      "Interactive technical workshops, webinars, seminars, hackathons, and regular community meetups.",
    fullDesc:
      "From weekend hackathons in Hargeisa to live virtual tech talks, our events bring builders together to explore emerging tools, share lessons learned, and solve problems under friendly deadlines.",
    highlights: [
      "Hands-on technical bootcamps and weekend hackathons",
      "Guest seminars with local and diaspora tech founders",
      "In-person Hargeisa meetups and online webinars",
    ],
    icon: Presentation,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=650&fit=crop",
  },
  {
    title: "Professional Networking",
    shortDesc:
      "Meaningful connections linking members with industry leaders, local companies, and partner tech communities.",
    fullDesc:
      "We bridge the gap between emerging talent and the broader technology ecosystem by hosting demo days, partner roundtables, and cross-community collaborations across Somaliland and the Horn of Africa.",
    highlights: [
      "Direct introductions to local tech hubs and startups",
      "Project demo days for founders and hiring leads",
      "Collaborations with regional developer groups",
    ],
    icon: Network,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=650&fit=crop",
  },
  {
    title: "Certification & Recognition",
    shortDesc:
      "Study support for professional certifications alongside formal recognition for member milestones and achievements.",
    fullDesc:
      "We help members prepare for globally recognized cloud, networking, and software certifications while awarding verified Venn Tech community certificates to members who complete tracks and contribute to shipped projects.",
    highlights: [
      "Study groups for industry-recognized certifications",
      "Verified completion certificates for active builders",
      "Public recognition for top community contributors",
    ],
    icon: Award,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=650&fit=crop",
  },
  {
    title: "Internship & Job Opportunities",
    shortDesc:
      "Curated access to internships, job openings, volunteering roles, and career-launching opportunities.",
    fullDesc:
      "Through our partner network in Hargeisa and remote employer channels, we share vetted internships, entry-level developer roles, and paid project fellowships directly with active community members.",
    highlights: [
      "Vetted local internships and junior tech vacancies",
      "Volunteering placements to build early experience",
      "Early referrals for high-performing project members",
    ],
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&h=650&fit=crop",
  },
  {
    title: "Community Governance",
    shortDesc:
      "Clear membership standards, accountable leadership, fair participation guidelines, and transparent administration.",
    fullDesc:
      "As a non-profit organization, Venn Tech operates on transparency, inclusivity, and shared accountability. Clear bylaws, role definitions, and a community code of conduct ensure every member has a voice and a safe space to learn.",
    highlights: [
      "Transparent non-profit leadership and reporting",
      "Clear code of conduct and participation standards",
      "Structured pathways for members to step into leadership",
    ],
    icon: Scale,
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=650&fit=crop",
  },
  {
    title: "Digital Platform Management",
    shortDesc:
      "Integrated member dashboards, smart notifications, activity tracking, project coordination, and role-based access.",
    fullDesc:
      "Our custom-built community platform powers everything behind the scenes—from onboarding approvals and role-based dashboards to task boards, timelines, and contributor leaderboards.",
    highlights: [
      "Role-based access for members, leads, and admins",
      "Unified project, task, and milestone coordination",
      "Automated activity tracking and engagement insights",
    ],
    icon: Settings2,
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&h=650&fit=crop",
  },
];

const features = [
  {
    title: "Member Onboarding",
    desc: "Join a structured network of builders and learners with a simple, welcoming registration process.",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=900&h=650&fit=crop",
  },
  {
    title: "Verified Membership",
    desc: "Every application is reviewed by our leadership team to ensure a safe, focused, and supportive space.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&h=650&fit=crop",
  },
  {
    title: "Project Workspaces",
    desc: "Kick off new initiatives, track real-world builds, and keep your team’s work moving forward in one hub.",
    icon: LayoutDashboard,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=650&fit=crop",
  },
  {
    title: "Task Tracking",
    desc: "Break big ideas into actionable steps, assign owners, and stay on top of what needs to get done next.",
    icon: ClipboardList,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=650&fit=crop",
  },
  {
    title: "Team Collaboration",
    desc: "Form cross-functional squads, share expertise, and build alongside peers who share your drive.",
    icon: UsersRound,
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&h=650&fit=crop",
  },
  {
    title: "Milestones & Goals",
    desc: "Define clear targets, celebrate key launches, and keep everyone aligned from kickoff to delivery.",
    icon: Target,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&h=650&fit=crop",
  },
  {
    title: "Visual Timelines",
    desc: "Map out project schedules, spot dependencies early, and see how daily progress adds up over time.",
    icon: Calendar,
    image:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=900&h=650&fit=crop",
  },
  {
    title: "Community Discussions",
    desc: "Ask questions, swap feedback, and brainstorm solutions in real time with fellow members.",
    icon: MessageCircle,
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&h=650&fit=crop",
  },
  {
    title: "Member Recognition",
    desc: "Highlight consistent contributors and celebrate the peers who help our community thrive.",
    icon: Trophy,
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&h=650&fit=crop",
  },
];

const teamMembers = [
  {
    name: "Abdirahman Ali",
    role: "Transitional Director",
  },
  {
    name: "Marwaan Khaliil",
    role: "Transitional Deputy Director",
  },
  {
    name: "Hamse Mohamed",
    role: "Transitional Deputy Director",
  },
];

const benefits = [
  "A curated, supportive network of learners and builders in Hargeisa and beyond",
  "Hands-on experience through real collaborative software projects",
  "1-on-1 mentorship, career guidance, and CV preparation",
  "Access to workshops, hackathons, and local or remote job opportunities",
  "Verified recognition and certification for your contributions",
];

export default function Home() {
  const [selectedScope, setSelectedScope] = useState(null);

  // Close dialog on Escape key and lock background scroll while open
  useEffect(() => {
    if (!selectedScope) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedScope(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedScope]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-wide text-slate-600">
              <MapPin size={14} className="text-slate-900" />
              Venn Tech Community • Hargeisa, Somaliland
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Build Real Skills, Collaborate on Projects, and Grow Together.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              Venn Tech is a non-profit technology community based in Hargeisa,
              dedicated to empowering builders through digital skills training,
              mentorship, collaborative projects, and professional certification.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="primary-button">
                Join the Community <ArrowUpRight size={18} />
              </Link>

              <Link to="/login" className="secondary-button">
                Member Sign In
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-200 pt-7">
              <div>
                <p className="text-3xl font-bold text-slate-900">10</p>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  Core programmes
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">100%</p>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  Community-driven
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">1</p>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  Unified workspace
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=900&fit=crop"
                alt="East African tech builders collaborating on laptops"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900">
                <LayoutDashboard size={21} />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Everything in One Place
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  From mentorship and workshops to project roadmaps—no more
                  juggling scattered tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY AREAS & SCOPE (WITH IMAGES + CLICKABLE DIALOG) */}
      <section
        id="programmes"
        className="border-y border-slate-200 bg-slate-50/60 py-16 md:py-24"
      >
        <div className="containerX">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Scope & Programmes
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              10 Pillars Empowering Our Tech Community
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Click on any programme card below to explore how we support
              members from their first lines of code to industry employment and
              leadership.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keyScopes.map((scope, index) => {
              const Icon = scope.icon;

              return (
                <button
                  key={scope.title}
                  type="button"
                  onClick={() => setSelectedScope(scope)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={scope.image}
                      alt={scope.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                        <Icon size={20} />
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-slate-700">
                        {scope.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-7 text-slate-600">
                        {scope.shortDesc}
                      </p>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                      Read details
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCOPE DETAILS DIALOG */}
      {selectedScope && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedScope(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="scope-dialog-title"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedScope(null)}
              aria-label="Close dialog"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={18} />
            </button>

            {/* Dialog Banner Image */}
            <div className="h-56 w-full overflow-hidden bg-slate-100 sm:h-64">
              <img
                src={selectedScope.image}
                alt={selectedScope.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Dialog Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                  {(() => {
                    const DialogIcon = selectedScope.icon;
                    return <DialogIcon size={22} />;
                  })()}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Programme Scope
                  </p>
                  <h3
                    id="scope-dialog-title"
                    className="text-2xl font-bold text-slate-900"
                  >
                    {selectedScope.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-base leading-8 text-slate-600">
                {selectedScope.fullDesc}
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  What This Includes
                </p>
                <ul className="mt-3 space-y-2.5">
                  {selectedScope.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-900"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setSelectedScope(null)}
                  className="secondary-button"
                >
                  Close
                </button>
                <Link
                  to="/register"
                  onClick={() => setSelectedScope(null)}
                  className="primary-button"
                >
                  Join This Programme <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM FEATURES */}
      <section id="features" className="containerX py-16 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Inside the Workspace
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Tools Built for Learning and Shipping
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
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
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="grid h-full sm:grid-cols-2">
                  <div className="flex flex-col justify-between p-6 md:p-7">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-slate-900">
                        {feature.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {feature.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Platform Tool
                    </div>
                  </div>

                  <div className="min-h-56 overflow-hidden bg-slate-100">
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
      <section id="about" className="containerX py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Mission
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Bridging the Gap Between Learning and Real-World Experience.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Tutorials only take you so far. Real growth happens when you
              collaborate with others, solve messy problems, and see a project
              through from start to finish.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Rooted in Hargeisa, Somaliland, Venn Tech Community gives emerging
              talent a structured, encouraging environment to practice their
              craft, build a strong portfolio, and grow alongside peers.
            </p>

            <Link to="/register" className="primary-button mt-8">
              Apply for Membership <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop"
              alt="Young African developers working together"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="containerX py-16 md:py-24">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 md:p-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Why Venn Tech?
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                A Place Where Your Effort Actually Counts.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                We believe in learning by doing. Instead of passive lectures, you
                get hands-on teamwork, honest feedback, and a community that
                celebrates your milestones.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    size={21}
                    className="mt-1 shrink-0 text-slate-900"
                  />
                  <p className="leading-7 text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="containerX py-16 md:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Leadership
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Meet the People Guiding Venn
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Our transitional leadership team in Hargeisa is dedicated to
            building an open, impactful home for local and regional tech talent.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm"
            >
              <div className="flex h-48 items-center justify-center border-b border-slate-200 bg-slate-50">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <Users size={34} className="text-slate-500" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">
                  {member.name}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMMUNITY ACTIVITY */}
      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=900&fit=crop"
              alt="African tech team collaborating in a modern workspace"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              How We Work
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Great Software Is Built Together.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Technology is better when knowledge is shared openly. Inside Venn
              Tech, members team up across different skill levels to tackle real
              challenges and help one another level up.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4">
                <Code2 size={22} className="shrink-0 text-slate-900" />
                <span className="font-medium text-slate-800">
                  Practical, hands-on skill building
                </span>
              </div>

              <div className="flex items-center gap-4">
                <GitBranch size={22} className="shrink-0 text-slate-900" />
                <span className="font-medium text-slate-800">
                  Team-driven projects and code reviews
                </span>
              </div>

              <div className="flex items-center gap-4">
                <MessageCircle size={22} className="shrink-0 text-slate-900" />
                <span className="font-medium text-slate-800">
                  Peer mentorship and open discussions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="containerX pb-20 pt-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Ready to Start?
          </p>

          <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Take the Next Step in Your Tech Journey With Us.
          </h2>

          <p className="mt-5 max-w-2xl leading-8 text-slate-600">
            Create your account today to connect with fellow builders in
            Hargeisa, join active projects, and start growing your skills.
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
      <footer className="border-t border-slate-200 bg-slate-50/70">
        <div className="containerX py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand & Mission */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/eee.svg"
                  alt="Venn Tech Community Logo"
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    Venn Tech Community
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Non-Profit Technology Organization
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                Empowering individuals in Somaliland and beyond through digital
                skills development, mentorship, real-world software projects,
                and professional certification.
              </p>

              <div className="mt-5 space-y-2.5 text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="shrink-0 text-slate-900" />
                  <span>Hargeisa, Maroodi Jeex, Somaliland</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="shrink-0 text-slate-900" />
                  <a
                    href="mailto:info@venntech.org"
                    className="transition hover:text-slate-900"
                  >
                    info@venntech.org
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe size={16} className="shrink-0 text-slate-900" />
                  <span>Open to students, graduates & tech professionals</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Navigation
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>
                  <a href="#programmes" className="hover:text-slate-900">
                    Core Programmes
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Workspace Tools
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-slate-900">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover:text-slate-900">
                    Leadership Team
                  </a>
                </li>
              </ul>
            </div>

            {/* Member Portal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Get Involved
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>
                  <Link to="/register" className="hover:text-slate-900">
                    Apply for Membership
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-slate-900">
                    Member Sign In
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedScope(keyScopes[1])}
                    className="text-left hover:text-slate-900"
                  >
                    Mentorship Programme
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedScope(keyScopes[7])}
                    className="text-left hover:text-slate-900"
                  >
                    Internships & Opportunities
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Venn Tech Community. All rights
              reserved.
            </p>
            <p>Hargeisa, Somaliland • Built for Community Growth</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
