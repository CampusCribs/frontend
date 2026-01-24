import HatHouseBlack from "@/components/ui/HatHouseBlack";
import { useNavigate } from "react-router";
import { ResidenceCard } from "../cribs/CribsPage";
import { Check, Lock, ShieldUser } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden ">
      {" "}
      <header className="flex justify-between items-center p-4 sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 z-50">
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

          <a href="#cribs" className="hover:text-slate-900">
            Cribs
          </a>

          <a href="#community" className="hover:text-slate-900">
            Community
          </a>

          <a href="#trust" className="hover:text-slate-900">
            Trust
          </a>
        </nav>
      </header>
      <section
        id="mission"
        className="relative flex min-h-[75vh] items-center bg-cover bg-center px-6 py-10
    bg-[url('https://cdn.shopify.com/s/files/1/0336/3763/0092/files/zac-gudakov-qnYbBALP4dA-unsplash_1024x1024.jpg?v=1660602329')]"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto max-w-3xl text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Subleasing, made safer.
          </h1>

          <p className="mt-5 text-lg md:text-xl text-white/90">
            We make student subleasing and housing safer and easier, with real
            student listings and fewer scams.
          </p>

          <ul className="mt-6 text-base text-white/90">
            <li>Student-only posts · Verified listings · Less noise</li>
          </ul>

          <div className="mt-10 flex justify-center">
            <button
              className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold
          hover:bg-blue-700 transition"
              onClick={() => navigate("/cribs")}
            >
              Explore Cribs
            </button>
          </div>
        </div>
      </section>
      <section id="cribs" className="w-full bg-white text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Copy + CTA */}
            <div>
              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
                Browse Cribs near your campus.
              </h2>

              <p className="mt-4 text-lg text-slate-600">
                Search student subleases and housing with filters that actually
                matter — price, dates, roommates, and distance — with fewer
                scams and less noise.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Filter by campus, price, move-in date, and lease length
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Verified badges help you trust what you’re clicking
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Message listings without digging through random DMs
                </li>
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/cribs")}
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition"
                >
                  Explore Cribs
                </button>

                <button
                  onClick={() => navigate("/cribs/post")}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                  Post a Sublease
                </button>
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Tip: student-only visibility keeps listings cleaner and
                responses real.
              </div>
            </div>

            {/* Right: Product preview using your actual ResidenceCard look */}
            <div className="relative overflow-hidden">
              {/* subtle background accents */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-blue-100 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-slate-100 blur-2xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between px-2 py-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Cribs preview
                    </div>
                    <div className="text-xs text-slate-500">
                      What students see when browsing
                    </div>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    Verified first
                  </span>
                </div>

                {/* Cards grid (use your ResidenceCard or a lightweight preview) */}
                <div className="mt-3 grid gap-4 grid-cols-2">
                  {/* If you can reuse ResidenceCard here, pass placeholder props */}
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <span>Student-only access keeps spam down.</span>
                  <span className="font-semibold text-slate-900">Browse →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="community" className="w-full bg-slate-50 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Community
              </div>

              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
                Find roommates. Get answers. Post what you need.
              </h2>

              <p className="mt-4 text-lg text-slate-600">
                The Community feed is where students post blog-style updates —
                quick text, small photos, and real questions — so you can find
                the right roommate or get advice without yelling into random
                group chats.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Post a “Looking for a Roommate” card with your vibe, budget,
                  and move-in dates
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Search roommate posts by campus, price range, and timing
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Ask for advice (leases, landlords, neighborhoods) and learn
                  from students who’ve been there
                </li>
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/community")}
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition"
                >
                  Explore Community
                </button>

                <button
                  onClick={() => navigate("/community/post")}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                  Post in Community
                </button>
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Pro tip: A good roommate post includes your budget, move-in
                window, and what you’re looking for (quiet, social, pets, etc.).
              </div>
            </div>

            {/* Right: How the Community Works */}
            <div className="relative">
              {/* subtle background accents */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-blue-100 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-slate-100 blur-2xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <div className="text-sm font-semibold text-slate-900">
                    How the Community works
                  </div>
                  <div className="text-xs text-slate-500">
                    Built for real student coordination
                  </div>
                </div>

                <ol className="space-y-5 text-sm text-slate-700">
                  <li className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Post what you’re looking for
                      </div>
                      <div className="text-slate-600">
                        Write a short, blog-style post — roommate search,
                        housing questions, or advice you need.
                      </div>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Students respond, not landlords
                      </div>
                      <div className="text-slate-600">
                        Community posts are student-only, keeping spam and cold
                        outreach out.
                      </div>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Search & filter posts
                      </div>
                      <div className="text-slate-600">
                        Find roommate posts by campus, budget, move-in window,
                        and timing.
                      </div>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Connect privately
                      </div>
                      <div className="text-slate-600">
                        Take the conversation off the feed once it’s a good fit.
                      </div>
                    </div>
                  </li>
                </ol>

                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  Designed to replace chaotic group chats and random housing
                  posts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="trust" className="w-full bg-white text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Built for trust, not chaos.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Campus Cribs is designed to reduce scams, spam, and uncomfortable
              outreach — so students can focus on finding real housing and real
              roommates.
            </p>
          </div>

          {/* 3 Trust Pillars */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Block 1: Student-only */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white text-sm font-bold">
                <Check />
              </div>

              <h3 className="mt-5 text-lg font-semibold">Student-only posts</h3>

              <p className="mt-2 text-sm text-slate-600">
                Only verified students can create posts or listings. No
                landlords, brokers, or anonymous accounts flooding your feed.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Verified student access</li>
                <li>• Fewer fake listings</li>
                <li>• Cleaner conversations</li>
              </ul>
            </div>

            {/* Block 2: Reporting & moderation */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white text-sm font-bold">
                <ShieldUser />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Reporting & moderation
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                If something feels off, report it. Our moderation tools help
                surface suspicious behavior quickly and keep the platform safe.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• One-tap reporting</li>
                <li>• Pattern-based moderation</li>
                <li>• Community accountability</li>
              </ul>
            </div>

            {/* Block 3: Privacy controls */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white text-sm font-bold">
                <Lock />
              </div>

              <h3 className="mt-5 text-lg font-semibold">Privacy by choice</h3>

              <p className="mt-2 text-sm text-slate-600">
                You decide who sees your posts. Keep them visible to students
                only, or hide them from non-students entirely.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Optional student-only visibility</li>
                <li>• No public scraping</li>
                <li>• Control over outreach</li>
              </ul>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-10 text-center text-xs text-slate-500">
            Trust isn’t a feature — it’s the foundation of student housing.
          </div>
        </div>
      </section>
      <footer className="w-full border-t border-slate-200 bg-white text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand / Mission */}
            <div>
              <div className="flex items-center gap-2 text-xl font-bold">
                <HatHouseBlack />
                Campus Cribs
              </div>

              <p className="mt-4 max-w-sm text-sm text-slate-600">
                Campus Cribs helps students find safer housing, real roommates,
                and fewer scams — all in one place, built specifically for
                student life.
              </p>

              <div className="mt-4 text-xs text-slate-500">
                Built by students, for students.
              </div>
            </div>

            {/* Primary actions */}
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Get started
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  <button
                    onClick={() => navigate("/cribs")}
                    className="hover:text-slate-900 transition"
                  >
                    Browse cribs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/cribs/post")}
                    className="hover:text-slate-900 transition"
                  >
                    Post a sublease
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/community")}
                    className="hover:text-slate-900 transition"
                  >
                    Explore community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/community/post")}
                    className="hover:text-slate-900 transition"
                  >
                    Find a roommate
                  </button>
                </li>
              </ul>
            </div>

            {/* Trust & support */}
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Trust & support
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#trust" className="hover:text-slate-900 transition">
                    Trust & safety
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/report")}
                    className="hover:text-slate-900 transition"
                  >
                    Report a listing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/privacy")}
                    className="hover:text-slate-900 transition"
                  >
                    Privacy controls
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="hover:text-slate-900 transition"
                  >
                    Contact us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              © {new Date().getFullYear()} Campus Cribs. All rights reserved.
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/terms")}
                className="hover:text-slate-700 transition"
              >
                Terms
              </button>
              <button
                onClick={() => navigate("/privacy")}
                className="hover:text-slate-700 transition"
              >
                Privacy
              </button>
              <button
                onClick={() => navigate("/guidelines")}
                className="hover:text-slate-700 transition"
              >
                Community guidelines
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
