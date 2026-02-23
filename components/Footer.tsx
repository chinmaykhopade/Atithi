import Link from "next/link";

const CITIES = [
  { name: "Jaipur", emoji: "🏰", tag: "Pink City" },
  { name: "Mumbai", emoji: "🌆", tag: "City of Dreams" },
  { name: "Goa", emoji: "🏖️", tag: "Beach Paradise" },
  { name: "Kerala", emoji: "🌴", tag: "God's Own Country" },
  { name: "Delhi", emoji: "🕌", tag: "Capital City" },
  { name: "Varanasi", emoji: "🕉️", tag: "City of Light" },
];

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, #0c0a09 0%, #1c1917 60%, #0c0a09 100%)" }}>
      <div className="india-stripe" />

      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ── Brand ── */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-11 h-11 flex-shrink-0">
                <img
                  src="/atithi-logo.svg"
                  alt="Atithi Logo"
                  className="w-full h-full rounded-xl shadow-gold"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-semibold gradient-gold tracking-wide">Atithi</span>
                <p className="text-[9px] text-gold-500 tracking-[0.2em] uppercase font-medium mt-0">अतिथि देवो भव</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-500 mb-5">
              India's premier hotel management platform, built on the timeless wisdom of <em className="text-gold-500 not-italic">Atithi Devo Bhava</em> — The Guest is God.
            </p>
            <div className="text-xs text-stone-600">
              <p>Developed by <span className="text-gold-400 font-semibold">Chinmay Khopade</span></p>
              <p className="mt-0.5">📞 +91 93732 35696</p>
            </div>
          </div>

          {/* ── Cities ── */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-[0.18em] mb-5">Popular Destinations</h4>
            <ul className="space-y-3">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <Link href={`/hotels?city=${c.name}`}
                    className="group flex items-center gap-2.5 text-sm text-stone-500 hover:text-gold-400 transition-colors">
                    <span className="text-base">{c.emoji}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{c.name}</span>
                    <span className="text-stone-700 text-xs ml-auto hidden group-hover:block">{c.tag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Links ── */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-[0.18em] mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: "/hotels", label: "Browse Hotels" },
                { href: "/register", label: "List Your Hotel" },
                { href: "/login", label: "Sign In" },
                { href: "#", label: "About Atithi" },
                { href: "#", label: "Refund Policy" },
                { href: "#", label: "Privacy Policy" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-stone-500 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-[0.18em] mb-5">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span>📧</span>
                <div>
                  <p className="text-stone-300 font-medium text-xs uppercase tracking-wide mb-0.5">Email</p>
                  <a href="mailto:support@atithi.in" className="text-stone-500 hover:text-gold-400 transition-colors">support@atithi.in</a>
                </div>
              </li>
              <li className="flex gap-3">
                <span>📞</span>
                <div>
                  <p className="text-stone-300 font-medium text-xs uppercase tracking-wide mb-0.5">24/7 Helpline</p>
                  <p className="text-stone-500">+91 1800-123-4567</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span>📍</span>
                <div>
                  <p className="text-stone-300 font-medium text-xs uppercase tracking-wide mb-0.5">Headquarters</p>
                  <p className="text-stone-500">Mumbai, Maharashtra</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom ── */}
        <div className="border-t border-white/5 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Atithi. All rights reserved. Designed & developed by{" "}
            <span className="text-gold-500 font-semibold">Chinmay Khopade</span>.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-saffron-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-india-green" />
            <span className="text-xs text-stone-600 ml-2">Made with 🙏 in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}