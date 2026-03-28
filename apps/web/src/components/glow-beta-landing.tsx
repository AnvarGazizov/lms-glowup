"use client"

import Image from "next/image"
import {
  type FormEvent,
  type ReactNode,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react"

import {
  type GlowLandingActionState,
  submitBetaSignUp,
  submitFeatureIdea,
} from "@/lib/actions/glow-landing"

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={
        `transition-[opacity,transform] duration-[700ms] ease-out ` +
        (visible ? "translate-y-0 opacity-100 " : "translate-y-7 opacity-0 ") +
        className
      }
    >
      {children}
    </div>
  )
}

function TeaserNum({
  target,
  suffix = "",
  className,
}: {
  target: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let v = 0
    const step = target / 55
    const id = window.setInterval(() => {
      v += step
      if (v >= target) {
        setValue(target)
        window.clearInterval(id)
      } else {
        setValue(Math.round(v))
      }
    }, 22)
    return () => window.clearInterval(id)
  }, [started, target])

  return (
    <div ref={ref} className={className}>
      {value}
      {suffix}
    </div>
  )
}

type GlowBetaLandingProps = {
  showInvalidLinkError?: boolean
  signedInEmail?: string | null
  signOut?: () => void | Promise<void>
}

export function GlowBetaLanding({
  showInvalidLinkError,
  signedInEmail,
  signOut,
}: GlowBetaLandingProps) {
  const [betaState, betaFormAction, betaPending] = useActionState<
    GlowLandingActionState,
    FormData
  >(submitBetaSignUp, null)

  const [ideaState, ideaFormAction, ideaPending] = useActionState<
    GlowLandingActionState,
    FormData
  >(submitFeatureIdea, null)

  const [signupEmail, setSignupEmail] = useState("")
  const [ideaEmailHint, setIdeaEmailHint] = useState<string | null>(null)

  useEffect(() => {
    if (signedInEmail) setSignupEmail(signedInEmail)
  }, [signedInEmail])

  useEffect(() => {
    if (signupEmail.trim()) setIdeaEmailHint(null)
  }, [signupEmail])

  function onIdeaFormSubmit(e: FormEvent<HTMLFormElement>) {
    if (!signupEmail.trim()) {
      e.preventDefault()
      setIdeaEmailHint(
        "Please enter your email in the beta sign-up form above first.",
      )
    }
  }

  const ideaErrorMessage =
    ideaEmailHint ??
    (ideaState?.ok === false ? ideaState.message : null)

  return (
    <div className="overflow-x-hidden bg-[#110C17] text-[#F0ECF7]">
      {showInvalidLinkError ? (
        <div
          role="alert"
          className="fixed top-[5.5rem] right-0 left-0 z-[190] border-b border-[rgba(249,76,175,0.3)] bg-[#241631] px-[5vw] py-2.5 text-center text-sm text-[#FF7FCA]"
        >
          That sign-in link is invalid or has expired. Try signing in again.
        </div>
      ) : null}

      {/* NAV */}
      <nav className="fixed top-0 z-[200] flex w-full items-center justify-between border-b border-[rgba(249,76,175,0.12)] bg-[rgba(17,12,23,0.9)] px-[5vw] py-4 backdrop-blur-[18px] md:px-[5vw]">
        <a href="/" className="block">
          <Image
            src="/images/logo.png"
            alt="Glow EdTech"
            width={200}
            height={56}
            className="h-[42px] w-auto md:h-14"
            priority
          />
        </a>
        <ul className="hidden list-none items-center gap-8 md:flex">
          <li>
            <a
              href="#beta-signup"
              className="text-sm font-medium text-[#DAD1E6] transition-colors hover:text-[#FF7FCA]"
            >
              Beta Access
            </a>
          </li>
          {signedInEmail ? (
            <li className="text-sm text-[#DAD1E6]">
              <span className="opacity-80">{signedInEmail}</span>
            </li>
          ) : null}
          {signOut ? (
            <li>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium text-[#FF7FCA] underline-offset-2 hover:underline"
                >
                  Sign out
                </button>
              </form>
            </li>
          ) : null}
        </ul>
        <a
          href="#beta-signup"
          className="rounded-full bg-gradient-to-br from-[#F94CAF] to-[#C0208A] px-6 py-[0.55rem] text-[0.85rem] font-bold text-white no-underline shadow-none transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(249,76,175,0.38)]"
        >
          Join the Beta →
        </a>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-[5vw] pt-36 pb-20 text-center md:px-[5vw] md:pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 55% at 50% 30%, rgba(249,76,175,.16) 0%, transparent 65%),
              radial-gradient(ellipse 40% 40% at 20% 70%, rgba(0,102,255,.1) 0%, transparent 60%),
              radial-gradient(ellipse 35% 35% at 80% 75%, rgba(249,76,175,.08) 0%, transparent 55%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(249,76,175,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,76,175,.04) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-[2] max-w-[820px]">
          <div
            className="mb-8 inline-flex animate-[glow-fade-up_0.7s_ease_both] items-center gap-2 rounded-full border border-[rgba(249,76,175,0.28)] bg-[rgba(249,76,175,0.1)] px-4 py-[0.38rem] text-[0.78rem] font-semibold tracking-[0.1em] text-[#FF7FCA] uppercase"
          >
            <span
              className="size-[7px] shrink-0 rounded-full bg-[#F94CAF] motion-safe:animate-[glow-pulse-dot_2s_infinite]"
            />
            Coming Soon to the Chrome Web Store
          </div>
          <h1 className="mb-6 text-[clamp(2.8rem,6.5vw,5.8rem)] leading-[1.03] font-black tracking-[-0.03em] [animation:glow-fade-up_0.7s_0.08s_ease_both]">
            Give Your
            <br />
            <span className="text-[#F94CAF]">LMS</span> a<br />
            <span className="text-[#4D94FF]">Glow</span>{" "}
            <span className="text-[#F94CAF]">Up</span>
          </h1>
          <p className="mx-auto mb-11 max-w-[580px] animate-[glow-fade-up_0.7s_0.16s_ease_both] text-[1.15rem] leading-[1.75] font-light text-[#DAD1E6]">
            A brand new Chrome Extension is coming to Brightspace. Be one of
            the first to experience a fully personalized LMS — built around how{" "}
            <em>you</em> learn.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-[glow-fade-up_0.7s_0.24s_ease_both]">
            <a
              href="#beta-signup"
              className="rounded-full bg-gradient-to-br from-[#F94CAF] to-[#C0208A] px-[2.2rem] py-[0.9rem] text-[0.95rem] font-bold text-white no-underline shadow-[0_4px_24px_rgba(249,76,175,0.32)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_36px_rgba(249,76,175,0.5)]"
            >
              🚀 Get Beta Access
            </a>
            <a
              href="#preview"
              className="rounded-full border border-[rgba(249,76,175,0.28)] bg-transparent px-[2.2rem] py-[0.9rem] text-[0.95rem] font-semibold text-[#F0ECF7] no-underline transition-all hover:-translate-y-0.5 hover:border-[#F94CAF] hover:text-[#FF7FCA]"
            >
              See the Preview ↓
            </a>
          </div>
        </div>
      </section>

      {/* TEASER STRIP */}
      <div
        id="preview"
        className="flex flex-wrap items-center justify-center gap-6 border-y border-[rgba(249,76,175,0.12)] px-[5vw] py-10 md:gap-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(249,76,175,.06), rgba(0,102,255,.06))",
        }}
      >
        <Reveal className="text-center">
          <div>
            <TeaserNum
              target={15}
              className="text-[2.6rem] leading-none font-black tracking-[-0.04em] text-[#F94CAF]"
            />
            <div className="mt-1 text-[0.72rem] font-semibold tracking-[0.08em] text-[#96607D] uppercase">
              Institutions Piloting
            </div>
          </div>
        </Reveal>
        <div className="hidden h-[50px] w-px bg-[rgba(249,76,175,0.18)] md:block" />
        <Reveal className="text-center">
          <div>
            <TeaserNum
              target={133}
              className="text-[2.6rem] leading-none font-black tracking-[-0.04em] text-[#F94CAF]"
            />
            <div className="mt-1 text-[0.72rem] font-semibold tracking-[0.08em] text-[#96607D] uppercase">
              Students Testing
            </div>
          </div>
        </Reveal>
        <div className="hidden h-[50px] w-px bg-[rgba(249,76,175,0.18)] md:block" />
        <Reveal className="text-center">
          <div>
            <TeaserNum
              target={20}
              className="text-[2.6rem] leading-none font-black tracking-[-0.04em] text-[#F94CAF]"
            />
            <div className="mt-1 text-[0.72rem] font-semibold tracking-[0.08em] text-[#96607D] uppercase">
              New Features Suggested
            </div>
          </div>
        </Reveal>
        <div className="hidden h-[50px] w-px bg-[rgba(249,76,175,0.18)] md:block" />
        <Reveal className="text-center">
          <div>
            <TeaserNum
              target={67}
              className="text-[2.6rem] leading-none font-black tracking-[-0.04em] text-[#F94CAF]"
            />
            <div className="mt-1 text-[0.72rem] font-semibold tracking-[0.08em] text-[#96607D] uppercase">
              Spots Remaining
            </div>
          </div>
        </Reveal>
      </div>

      {/* BETA SIGNUP */}
      <section
        id="beta-signup"
        className="relative overflow-hidden px-[5vw] py-24 md:px-[5vw]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,76,175,.09), transparent)",
          }}
        />
        <Reveal>
          <div className="relative z-[2] mx-auto max-w-[700px]">
            <div className="mb-4 flex items-center justify-center gap-[0.7rem] text-[0.72rem] font-bold tracking-[0.14em] text-[#FF7FCA] uppercase">
              Limited Beta Access
            </div>
            <div className="rounded-[24px] border border-[rgba(249,76,175,0.18)] bg-[rgba(249,76,175,0.04)] p-8 md:p-12 md:px-14">
              <h2 className="mb-2 text-center text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#F0ECF7]">
                Be the <span className="text-[#F94CAF]">First</span> to Glow Up
              </h2>
              <p className="mb-10 text-center text-[0.95rem] leading-[1.6] text-[#96607D]">
                Spots are limited. Sign up now and we&apos;ll notify you the
                moment the Glow Chrome Extension is ready for your institution.
              </p>

              {!betaState?.ok ? (
                <form
                  action={betaFormAction}
                  className="transition-opacity duration-300"
                >
                  {betaState?.ok === false ? (
                    <p
                      role="alert"
                      className="mb-4 rounded-[10px] border border-[rgba(255,100,100,0.35)] bg-[rgba(255,80,80,0.08)] px-3 py-2 text-center text-[0.85rem] text-[#FF9090]"
                    >
                      {betaState.message}
                    </p>
                  ) : null}
                  <div className="grid grid-cols-1 gap-[1.2rem] md:grid-cols-2">
                    <div className="flex flex-col gap-[0.45rem]">
                      <label
                        htmlFor="firstName"
                        className="text-[0.8rem] font-semibold tracking-[0.04em] text-[#DAD1E6] uppercase"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        placeholder="Jane"
                        required
                        className="rounded-[10px] border border-[rgba(249,76,175,0.18)] bg-[rgba(255,255,255,0.05)] px-[1.1rem] py-[0.85rem] text-[0.95rem] text-[#F0ECF7] outline-none transition-all placeholder:text-[rgba(218,209,230,0.3)] focus:border-[#F94CAF] focus:bg-[rgba(249,76,175,0.06)] focus:shadow-[0_0_0_3px_rgba(249,76,175,0.12)]"
                      />
                    </div>
                    <div className="flex flex-col gap-[0.45rem]">
                      <label
                        htmlFor="lastName"
                        className="text-[0.8rem] font-semibold tracking-[0.04em] text-[#DAD1E6] uppercase"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        placeholder="Smith"
                        required
                        className="rounded-[10px] border border-[rgba(249,76,175,0.18)] bg-[rgba(255,255,255,0.05)] px-[1.1rem] py-[0.85rem] text-[0.95rem] text-[#F0ECF7] outline-none transition-all placeholder:text-[rgba(218,209,230,0.3)] focus:border-[#F94CAF] focus:bg-[rgba(249,76,175,0.06)] focus:shadow-[0_0_0_3px_rgba(249,76,175,0.12)]"
                      />
                    </div>
                    <div className="flex flex-col gap-[0.45rem] md:col-span-2">
                      <label
                        htmlFor="email"
                        className="text-[0.8rem] font-semibold tracking-[0.04em] text-[#DAD1E6] uppercase"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        placeholder="jane.smith@university.edu"
                        autoComplete="email"
                        required
                        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                        title="Enter a valid email address (example: name@school.edu)"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="rounded-[10px] border border-[rgba(249,76,175,0.18)] bg-[rgba(255,255,255,0.05)] px-[1.1rem] py-[0.85rem] text-[0.95rem] text-[#F0ECF7] outline-none transition-all placeholder:text-[rgba(218,209,230,0.3)] focus:border-[#F94CAF] focus:bg-[rgba(249,76,175,0.06)] focus:shadow-[0_0_0_3px_rgba(249,76,175,0.12)]"
                      />
                    </div>
                    <div className="flex flex-col gap-[0.45rem] md:col-span-2">
                      <label
                        htmlFor="institution"
                        className="text-[0.8rem] font-semibold tracking-[0.04em] text-[#DAD1E6] uppercase"
                      >
                        Institution{" "}
                        <span className="font-normal opacity-60">
                          (Optional)
                        </span>
                      </label>
                      <input
                        id="institution"
                        name="institution"
                        placeholder="University of Waterloo"
                        className="rounded-[10px] border border-[rgba(249,76,175,0.18)] bg-[rgba(255,255,255,0.05)] px-[1.1rem] py-[0.85rem] text-[0.95rem] text-[#F0ECF7] outline-none transition-all placeholder:text-[rgba(218,209,230,0.3)] focus:border-[#F94CAF] focus:bg-[rgba(249,76,175,0.06)] focus:shadow-[0_0_0_3px_rgba(249,76,175,0.12)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={betaPending}
                    className="mt-6 w-full cursor-pointer rounded-full border-none bg-gradient-to-br from-[#F94CAF] to-[#C0208A] py-[1.1rem] text-[1rem] font-extrabold tracking-[0.02em] text-white shadow-[0_4px_24px_rgba(249,76,175,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_36px_rgba(249,76,175,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {betaPending ? "Submitting…" : "🚀 Request Beta Access"}
                  </button>
                  <p className="mt-4 text-center text-[0.75rem] leading-[1.6] text-[#96607D]">
                    We respect your privacy. No spam, ever. We&apos;ll only
                    reach out about your beta access.
                  </p>
                  <p className="mt-[0.6rem] text-center text-[0.75rem] leading-[1.6] italic text-[rgba(218,209,230,0.4)]">
                    Oh....and we promise we won&apos;t do that thing where
                    we&apos;ll email you everyday to the point where you want to
                    &apos;unsubscribe&apos; and report us because the emails are
                    so self fulfilling ;)
                  </p>
                </form>
              ) : (
                <div className="animate-[glow-fade-up_0.5s_ease_both] px-2 py-8 text-center">
                  <span className="mb-4 block text-5xl">🎉</span>
                  <h3 className="mb-2 text-[1.4rem] font-extrabold text-[#FF7FCA]">
                    You&apos;re on the list!
                  </h3>
                  <p className="text-[0.95rem] leading-[1.7] text-[#DAD1E6]">
                    Thanks for signing up. We&apos;ll be in touch as soon as your
                    beta access is ready. Keep an eye on your inbox!
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#110C17] px-[5vw] py-16 md:px-[5vw]">
        <div className="mx-auto max-w-[1140px]">
          <Reveal>
            <p className="mx-auto mt-12 max-w-[680px] px-8 py-[1.8rem] text-center text-[1.05rem] leading-[1.7] text-[#DAD1E6] italic" 
              style={{
                background:
                  "linear-gradient(135deg, rgba(249,76,175,.05), rgba(0,102,255,.05))",
                border: "1px solid rgba(249,76,175,.15)",
                borderRadius: "16px",
              }}
            >
              ✨ This is just the beginning — imagine what we have in the future
              to make your LMS even more personalized, intuitive, and built
              around <em className="font-semibold not-italic text-[#FF7FCA]">you</em>
              .<br />
              <br />
              But, we need your help, too! Give us feedback on what would be
              helpful — whether it&apos;s improving the UX, features to make
              using the LMS fun, or new tools to make your student life easier.
              We want to hear them in this beta.
            </p>
          </Reveal>

          <Reveal>
            <div
              className="mx-auto mt-10 max-w-[680px] rounded-[20px] border border-[rgba(0,102,255,0.18)] bg-[rgba(0,102,255,0.04)] px-8 py-8 text-center md:mt-10 md:px-10"
            >
              <h3 className="mb-1 text-[1.15rem] font-extrabold text-white">
                💡 Submit an Idea
              </h3>
              <p className="mb-5 text-[0.88rem] leading-[1.6] text-[#DAD1E6]">
                Got a feature in mind? Tell us — we&apos;re building this for you.
                We&apos;ll use the email from the{" "}
                <a
                  href="#beta-signup"
                  className="font-semibold text-[#FF7FCA] underline-offset-2 hover:underline"
                >
                  beta sign-up
                </a>{" "}
                form.
              </p>
              {!ideaState?.ok ? (
                <form
                  action={ideaFormAction}
                  onSubmit={onIdeaFormSubmit}
                  className="transition-opacity duration-300"
                >
                  <input type="hidden" name="ideaEmail" value={signupEmail} />
                  {ideaErrorMessage ? (
                    <p
                      role="alert"
                      className="mb-3 rounded-[10px] border border-[rgba(255,100,100,0.35)] bg-[rgba(255,80,80,0.08)] px-3 py-2 text-center text-[0.85rem] text-[#FF9090]"
                    >
                      {ideaErrorMessage}
                    </p>
                  ) : null}
                  <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-[0.7rem]">
                    <input
                      id="ideaInput"
                      name="idea"
                      placeholder="e.g. a way to visualize and predict grades across a whole semester"
                      required
                      className="w-full flex-1 rounded-full border border-[rgba(0,102,255,0.22)] bg-[rgba(255,255,255,0.05)] px-[1.1rem] py-[0.82rem] text-[0.92rem] text-[#F0ECF7] outline-none transition-all placeholder:text-[rgba(218,209,230,0.3)] focus:border-[#4D94FF] focus:bg-[rgba(0,102,255,0.07)] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.12)]"
                    />
                    <button
                      type="submit"
                      disabled={ideaPending}
                      className="shrink-0 cursor-pointer rounded-full border-none bg-gradient-to-br from-[#0066FF] to-[#0044CC] px-6 py-[0.82rem] text-[0.9rem] font-bold whitespace-nowrap text-white shadow-[0_4px_18px_rgba(0,102,255,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,102,255,0.45)] disabled:cursor-not-allowed disabled:opacity-60 md:px-[1.6rem]"
                    >
                      {ideaPending ? "Submitting…" : "Submit →"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="animate-[glow-fade-up_0.4s_ease_both] text-[0.92rem] font-semibold text-[#4D94FF]">
                  🙌 Thanks! We&apos;ve got your idea and we love it already.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col items-center border-t border-[rgba(249,76,175,0.1)] bg-[#110C17] px-[5vw] py-8 text-center">
        <Image
          src="/images/logo.png"
          alt="Glow EdTech"
          width={180}
          height={50}
          className="mb-6 h-[50px] w-auto"
        />
        <div className="max-w-xl text-[0.82rem] leading-normal text-[#96607D]">
          <div className="mb-1 text-[0.85rem] font-semibold text-[#F0ECF7]">
            Brightspace Personalizer: Your LMS, Your Way
          </div>
          <div>
            © 2025 Glow EdTech ·{" "}
            <a
              href="mailto:ideas@glowedtech.ai"
              className="text-[#FF7FCA] no-underline hover:underline"
            >
              ideas@glowedtech.ai
            </a>
          </div>
          <div className="mx-auto mt-2 max-w-[420px] text-[0.7rem] leading-[1.5] text-[rgba(150,96,125,0.6)]">
            Glow EdTech is an independent entity and is not affiliated with,
            endorsed by, sponsored by, or otherwise associated with D2L
            Corporation or its Brightspace platform. Any references to D2L or
            Brightspace are for descriptive purposes only and do not imply any
            relationship, authorization, or approval.
          </div>
        </div>
      </footer>
    </div>
  )
}
