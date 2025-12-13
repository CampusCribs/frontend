import HatHouseBlack from "@/components/ui/HatHouseBlack";
import { useNavigate } from "react-router";
import { ResidenceCard } from "../cribs/CribsPage";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      {" "}
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

          <a href="#cribs" className="hover:text-slate-900">
            Cribs
          </a>

          <a href="#community" className="hover:text-slate-900">
            Community
          </a>

          <a href="#what-we-do" className="hover:text-slate-900">
            What We Do
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
            <div className="relative">
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
                    thumbnail="fc7d5b8b-fc38-44db-af6b-726307cc8a96"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="fc7d5b8b-fc38-44db-af6b-726307cc8a96"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="fc7d5b8b-fc38-44db-af6b-726307cc8a96"
                    id="485da7d5-54f8-4c82-9f56-6ffbe9240657"
                    price={650}
                    location="CUF"
                    name="University of Cincinnati"
                    iconKey="asdf"
                    ableToUse={false}
                  />
                  <ResidenceCard
                    userId="1d919121-a8f1-4990-bd6c-c7d10ad131fd"
                    thumbnail="fc7d5b8b-fc38-44db-af6b-726307cc8a96"
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
      <section id="community"></section>
      <section id="what-we-do"></section>
    </div>
  );
};

export default Home;
