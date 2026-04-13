import { Link } from "react-router-dom";
import { Users, ShieldCheck, LayoutDashboard, Trophy, Code, GitBranch, MessageCircle, Calendar } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const features = [
  {
    title: "Member Registration",
    desc: "Allow new members to register and join the community in a structured way with automated workflows.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  },
  {
    title: "Admin Approval",
    desc: "Review and approve users before giving them access to the platform with role-based permissions.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
  },
  {
    title: "Project Dashboard",
    desc: "Track projects, tasks, teams, and performance from one intuitive dashboard with real-time updates.",
    icon: LayoutDashboard,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    title: "Leaderboard",
    desc: "Reward contribution and highlight top-performing members in the community with gamification.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
  },
];

const stats = [
  { label: "Active Members", value: "2,500+", icon: Users },
  { label: "Projects Completed", value: "180+", icon: Code },
  { label: "Weekly Events", value: "12", icon: Calendar },
  { label: "Mentorship Hours", value: "5,000+", icon: MessageCircle },
];

const teamMembers = [
  {
    name: "Aliu",
    role: "Transitional Director",
    image: "https://t3.ftcdn.net/jpg/17/76/10/70/360_F_1776107025_GBCtJtS1FoBU1gKHrdYJYPqRtjagwou9.jpg",
  },
  {
    name: "Marko",
    role: "Transitional Deputy Director",
    image: "https://t3.ftcdn.net/jpg/17/76/10/70/360_F_1776107025_GBCtJtS1FoBU1gKHrdYJYPqRtjagwou9.jpg"
  },
  {
    name: "Hamzoos",
    role: "Transitional Deputy Director",
    image: "https://t3.ftcdn.net/jpg/17/76/10/70/360_F_1776107025_GBCtJtS1FoBU1gKHrdYJYPqRtjagwou9.jpg",
  },
  
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <Navbar />

      {/* Hero Section */}
      <section className="containerX py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center rounded-full border soft-border card-bg px-4 py-1.5 text-sm text-muted">
              Tech Community Platform
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
             Learn, Grow, Develop skills & Earn professional certification together
            </h1>

            <p className="text-muted mt-5 max-w-xl text-base md:text-lg leading-7">
              VennTech Community is a non-profit technology organization focused on empowering individuals through
              digital skills development and innovation.
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
                <span className="text-2xl font-black text-[rgb(var(--fg))]">3</span>
                <p>dashboard based on Role</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] blur-3xl opacity-30 brand-gradient"></div>
            
            <Card className="p-2 md:p-3">
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop" 
                  alt="Dashboard Preview" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--bg))] via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="card-bg rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="text-sm font-semibold">Live Platform Activity</p>
                    </div>
                    {/* <p className="text-muted text-xs mt-1">2,500+ active members this week</p> */}
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Stats Cards */}
            <div className="absolute -left-4 top-10 card-bg rounded-xl border soft-border p-3 shadow-xl hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  {/* <p className="text-xs text-muted">New Members</p>
                  <p className="text-lg font-bold">+</p> */}
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-20 card-bg rounded-xl border soft-border p-3 shadow-xl hidden lg:block animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Trophy className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted">Top Contributor</p>
                  <p className="text-sm font-bold">Hamse Mohamed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="containerX pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl brand-gradient text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-black">{stat.value}</p>
                <p className="text-muted text-sm">{stat.label}</p>
              </Card>
            );
          })}
        </div>
      </section> */}

      {/* Features Section */}
      <section className="containerX pb-16 md:pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight">Core Features</h2>
          <p className="text-muted mt-2 max-w-2xl mx-auto">
            Everything needed to grow and manage a modern tech community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  index % 2 === 0 ? 'lg:grid lg:grid-cols-2' : 'lg:grid lg:grid-cols-2 lg:[&>div:first-child]:order-2'
                }`}
              >
                <div className="p-6 md:p-8">
                  <div className="stat-icon-wrap">
                    <Icon className="stat-icon" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-6">{feature.desc}</p>
                  <button className="mt-4 text-sm font-semibold text-[rgb(var(--primary))] hover:underline">
                    Learn more →
                  </button>
                </div>
                <div className="relative h-48 lg:h-auto">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--bg))] via-transparent to-transparent lg:bg-gradient-to-l"></div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="containerX pb-16 md:pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight">Meet Our Team</h2>
          <p className="text-muted mt-2">
            Dedicated professionals building the future of tech communities.
          </p>
        </div>

       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 place-items-center">
  {teamMembers.map((member) => (
    <Card key={member.name} className="overflow-hidden text-center">
      <div className="relative">
        <img 
          src={member.image} 
          alt={member.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--bg))] to-transparent opacity-60"></div>
      </div>
      <div className="-mt-12 relative p-4">
        <div className="card-bg rounded-xl border soft-border p-4">
          <h3 className="font-bold">{member.name}</h3>
          <p className="text-muted text-sm">{member.role}</p>
        </div>
      </div>
    </Card>
  ))}
</div>

      </section>

      {/* Community Activity Section */}
      <section className="containerX pb-16 md:pb-24">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-black tracking-tight">
                Join Our Active Community
              </h2>
              <p className="text-muted mt-4 leading-7">
              Connect with like-minded developers, participate in hackathons, attend workshops, 
                and grow your skills with mentorship from industry experts.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <GitBranch className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Open Source Projects</h4>
                    <p className="text-muted text-sm">Contribute to real-world projects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Weekly Meetups</h4>
                    <p className="text-muted text-sm">Learn and network with peers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <Code className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Skill Development</h4>
                    <p className="text-muted text-sm">Master in-demand technologies</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative min-h-[300px] lg:min-h-full">
              <img 
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop" 
                alt="Community Event"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[rgb(var(--bg))] lg:bg-gradient-to-r"></div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="containerX pb-20">
        <div className="relative overflow-hidden rounded-[2rem] border soft-border card-bg p-8 md:p-12">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=900&fit=crop" 
              alt="Background"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative max-w-2xl">
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