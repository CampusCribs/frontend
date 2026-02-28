import HatHouseBlack from "@/components/ui/HatHouseBlack";
import { useNavigate } from "react-router";
import { ResidenceCard } from "../cribs/CribsPage";
import {
  Check,
  Lock,
  Mail,
  MessageCircle,
  Search,
  ShieldUser,
} from "lucide-react";
import { useGetAppCribsInfinite } from "@/gen";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { data: curatedData } = useGetAppCribsInfinite();
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState<
    "Feature" | "Bug" | "Safety" | "Design" | "Other"
  >("Feature");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const onSubmit = async () => {
    console.log("submit");
  };
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

          <a href="#trust" className="hover:text-slate-900">
            Trust
          </a>

          <a href="#how" className="hover:text-slate-900">
            How it Works
          </a>

          <a href="#feedback" className="hover:text-slate-900">
            Feedback
          </a>
        </nav>
      </header>
      <section
        id="mission"
        className="relative flex min-h-[75vh] items-center bg-cover bg-center px-6 py-10
    bg-[url('https://cdn.shopify.com/s/files/1/0336/3763/0092/files/zac-gudakov-qnYbBALP4dA-unsplash_1024x1024.jpg?v=1660602329')]"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />

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

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur border border-white/15">
              Verified student email
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur border border-white/15">
              Report + block
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur border border-white/15">
              In-app chat
            </span>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold hover:bg-blue-700 transition"
              onClick={() => navigate("/cribs")}
            >
              Explore Cribs
            </button>

            <button
              className="rounded-2xl bg-white/10 px-6 py-3 text-base font-semibold text-white border border-white/20 hover:bg-white/15 transition"
              onClick={() => navigate("/cribs/post")}
            >
              Post a Sublease
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
                  {curatedData?.pages[0]?.data.items.map((crib) => (
                    <>
                      <ResidenceCard key={crib.id} data={crib} />
                      <ResidenceCard key={crib.id} data={crib} />
                      <ResidenceCard key={crib.id} data={crib} />
                      <ResidenceCard key={crib.id} data={crib} />
                    </>
                  ))}
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
      <section id="how" className="w-full bg-slate-50 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              How it works
            </div>

            <h2 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
              Safer student subleasing in minutes.
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Verify your student email, browse or post listings, stay in
              control of privacy, and chat to lock in your next sublease —
              without the chaos.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex  p-2 items-center justify-center rounded-full bg-blue-600 text-white">
                  {/* Mail */}
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-500">Step 1</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Sign up with your student email
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Your email is automatically checked for student association
                    and verified before you enter the app.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Student-only access
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Campus association
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Verified login
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex p-2 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Search size={18} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-500">Step 2</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Browse listings or post yours
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Explore real student subleases near your campus, or post a
                    listing in minutes to find someone to take over your lease.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Filters that matter
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Less noise
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Verified-first browsing
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/cribs")}
                      className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Browse Cribs
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/cribs/post")}
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                    >
                      Post a Sublease
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex p-2 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Lock size={18} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-500">Step 3</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Privacy is built in
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Share the general area, not your exact address. Decide what
                    you show and when you share details — with reporting &
                    blocking tools if anything feels off.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      No exact address required
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Student visibility controls
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Report + block
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex p-2 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <MessageCircle size={18} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-500">Step 4</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Chat and find your next sublease
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Message other students (and users) directly to coordinate
                    tours, ask questions, and lease your next sublease — without
                    digging through random group chats.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      In-app chat
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Faster coordination
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Safer outreach
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">Tip:</span>{" "}
                    Don’t send deposits before touring. Keep communication
                    in-app.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-10 text-center text-xs text-slate-500">
            Exact addresses should only be shared after you feel comfortable
            connecting.
          </div>
        </div>
      </section>
      <section id="feedback" className="w-full bg-white text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Student feedback
              </div>

              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
                Help shape the student housing experience.
              </h2>

              <p className="mt-4 text-lg text-slate-600">
                Campus Cribs is built around how students actually find housing.
                Your feedback helps us improve safety, usability, and the tools
                that matter most when searching for your next place.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Suggest features that would make subleasing or roommate search
                  easier
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Point out friction, confusion, or things that feel unnecessary
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  Share ideas that improve trust, privacy, or safety
                </li>
              </ul>

              <div className="mt-6 text-xs text-slate-500">
                Student input directly influences what we prioritize next.
              </div>
            </div>

            {/* Right card */}
            <div className="relative">
              <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-blue-100 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-slate-100 blur-2xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Share feedback
                    </div>
                    <div className="text-xs text-slate-500">
                      Short, specific ideas are the most helpful
                    </div>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    Community-driven
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      Category
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        ["Feature", "Bug", "Safety", "Design", "Other"] as const
                      ).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(c)}
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold border transition",
                            category === c
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      Your feedback
                    </div>
                    <textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="What could make Campus Cribs better for students?"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                    <div className="mt-2 text-[11px] text-slate-500">
                      If relevant, include your campus or what you were trying
                      to do.
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={sending || !idea.trim()}
                    onClick={async () => {
                      if (!idea.trim()) return;
                      try {
                        setSending(true);
                        // TODO: replace with API call
                        await new Promise((r) => setTimeout(r, 450));
                        setSent(true);
                        setIdea("");
                        window.setTimeout(() => setSent(false), 1800);
                      } finally {
                        setSending(false);
                      }
                    }}
                    className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-40"
                  >
                    {sending
                      ? "Submitting..."
                      : sent
                        ? "Thanks for the feedback!"
                        : "Submit feedback"}
                  </button>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                    Prefer email? Reach us at{" "}
                    <a
                      href="mailto:support@campuscribs.org"
                      className="font-semibold text-slate-900 underline"
                    >
                      support@campuscribs.org
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
