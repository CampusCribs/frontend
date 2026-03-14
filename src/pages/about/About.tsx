import {
  GraduationCap,
  ShieldCheck,
  Map,
  Users,
  Star,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import HatHouseBlack from "@/components/ui/HatHouseBlack";
import { useNavigate } from "react-router";
import Footer from "@/components/layout/Footer";

// Static "About Us" page for a student subleasing finder app (CampusCribs-like)
// TailwindCSS is assumed.

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  from-slate-50 via-white to-white text-slate-900 w-full">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 z-10">
        <div
          className="flex items-center text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="mr-2 flex items-center">
            <HatHouseBlack />
          </span>
          Campus Cribs
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
          <a href="#mission" className="hover:text-slate-900">
            Mission
          </a>
          <a href="#story" className="hover:text-slate-900">
            Our Story
          </a>
          <a href="#how" className="hover:text-slate-900">
            How it works
          </a>
          <a href="#trust" className="hover:text-slate-900">
            Trust & Safety
          </a>
          <a href="#difference" className="hover:text-slate-900">
            Why us
          </a>
          <a href="#community" className="hover:text-slate-900">
            Community
          </a>
          <a href="#cta" className="hover:text-slate-900">
            Join us
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <GraduationCap className="h-4 w-4" aria-hidden />
              Built by students, for students
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              Subleasing made simple, safe, and student-first
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              We help students find and post short-term housing around
              campus—perfect for co-ops, study abroad, and off-cycle semesters.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/browse")}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition shadow-md"
              >
                Browse listings <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
              <button
                onClick={() => navigate("/post")}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-slate-900 border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition"
              >
                Post a sublease
              </button>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-600" id="mission">
              <li className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 text-emerald-600"
                  aria-hidden
                />
                Reduce housing stress with fast, transparent matching
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 text-emerald-600"
                  aria-hidden
                />
                Empower campus communities with verified student accounts
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 text-emerald-600"
                  aria-hidden
                />
                Keep affordability and safety at the center of every interaction
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200 bg-white shadow-xl p-6">
              <div className="flex items-center gap-3">
                <Map className="h-6 w-6 text-indigo-600" aria-hidden />
                <p className="text-sm font-medium text-slate-700">
                  Neighborhood heatmaps & campus filters
                </p>
              </div>
              <div className="mt-4 aspect-video rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center"></div>
              <ul className="mt-5 text-sm text-slate-600 space-y-2">
                <li className="flex gap-2">
                  <CheckCircle2
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden
                  />
                  Filter by distance to campus & transit
                </li>
                <li className="flex gap-2">
                  <CheckCircle2
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden
                  />
                  Roommate matching signals
                </li>
                <li className="flex gap-2">
                  <CheckCircle2
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden
                  />
                  Flexible dates & budgets
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-12 md:py-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Who we are
            </h2>
            <p className="mt-2 text-slate-600">
              Why we started and what drives us.
            </p>
          </div>
          <div className="md:col-span-2 text-slate-700 leading-relaxed">
            <p>
              Campus Cribs was founded by students who kept running into the
              same problem: leases don’t match the academic calendar. Between
              co-ops, internships, and study abroad, students need short-term
              options that are safe, affordable, and easy to arrange.
            </p>
            <p className="mt-4">
              We’re building a student-first marketplace that respects your time
              and budget—rooted in campus communities and designed with real
              student feedback.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="py-12 md:py-16 bg-slate-50 border-y border-slate-200"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Step 1</div>
              <p className="mt-1 text-lg font-semibold">Post in minutes</p>
              <p className="mt-2 text-slate-600">
                Create a verified account with your student email and publish
                your sublease with photos, dates, and price.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Step 2</div>
              <p className="mt-1 text-lg font-semibold">Browse & filter</p>
              <p className="mt-2 text-slate-600">
                Use campus-aware filters, neighborhood heatmaps, and amenities
                to find the right fit fast.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Step 3</div>
              <p className="mt-1 text-lg font-semibold">Connect safely</p>
              <p className="mt-2 text-slate-600">
                Message verified students and close the loop with clear
                expectations and optional templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section id="trust" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Trust & Safety
            </h2>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="font-semibold">Verified student accounts</p>
              <p className="mt-2 text-slate-600">
                University email verification and quick flag/report tools.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="font-semibold">Content moderation</p>
              <p className="mt-2 text-slate-600">
                Automated filters + human review for listings and images.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="font-semibold">Privacy & security</p>
              <p className="mt-2 text-slate-600">
                We respect your data and implement modern security best
                practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section
        id="difference"
        className="py-12 md:py-16 bg-slate-50 border-y border-slate-200"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-indigo-600" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              What makes us different
            </h2>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="font-semibold">Student-first features</p>
              <ul className="mt-2 text-slate-600 space-y-2">
                <li>Flexible dates & durations aligned to co-op cycles</li>
                <li>Neighborhood heatmaps and campus-centric filters</li>
                <li>Roommate matching signals & amenities search</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="font-semibold">Clarity & affordability</p>
              <ul className="mt-2 text-slate-600 space-y-2">
                <li>Transparent listing expectations</li>
                <li>Guides, checklists, and templates for fast handoffs</li>
                <li>No surprise fees for basic use</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Impact */}
      <section id="community" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-emerald-600" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Community & Impact
            </h2>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">500+</p>
              <p className="mt-1 text-slate-600">
                Students connected across campuses
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">48 hrs</p>
              <p className="mt-1 text-slate-600">Median time to first match</p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">4.9/5</p>
              <p className="mt-1 text-slate-600">User satisfaction rating</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            *These are illustrative placeholders. Replace with your real metrics
            or testimonials when available.
          </p>
        </div>
      </section>

      {/* Join Us / CTA */}
      <section id="cta" className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Join the campus housing movement
            </h2>
            <p className="mt-4 text-slate-300 text-lg">
              List a sublease, find a short-term stay, or partner with us to
              support student housing access.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/post")}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition"
              >
                List your sublease{" "}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
              <button
                onClick={() => navigate("/partners")}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-slate-500 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition"
              >
                Partner with us
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
            <p className="font-semibold">Ways to get involved</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>• Join our student ambassador program</li>
              <li>• Collaborate with student orgs or housing offices</li>
              <li>• Share feedback—help shape features you need</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} CampusCribs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="/campus-cribs-privacy-policy.pdf"
              className="hover:text-slate-900"
            >
              Privacy
            </a>
            <a
              href="/campus-cribs-terms-and-conditions.pdf"
              className="hover:text-slate-900"
            >
              Terms
            </a>
            <a
              href="mailto:support@campuscribs.org"
              className="hover:text-slate-900"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="sticky left-0 bottom-5 w-10">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
