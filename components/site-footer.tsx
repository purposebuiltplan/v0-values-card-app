export function SiteFooter() {
  return (
    <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t print:border-none print:py-2 print:text-xs">
      <p>Part of the Purpose Built OS&trade;</p>
      <p className="mt-2 print:mt-0">
        <a
          href="https://purposefp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          purposefp.com
        </a>
      </p>
      <div className="mx-auto mt-6 max-w-3xl space-y-3 text-xs leading-relaxed print:mt-2 print:space-y-1 print:text-[9px]">
        <p>
          PurposeFP, LLC (&ldquo;Purpose Financial Planning&rdquo;) is a registered investment advisor offering
          advisory services in the State of GA and in other jurisdictions where exempted. Registration does not imply a
          certain level of skill or training. This values exercise is for educational purposes only and is not
          investment, legal, or tax advice, nor an offer or solicitation for advisory services.
        </p>
        <p>
          Results pages are automatically deleted after 14 days. See our{" "}
          <a
            href="https://purposefp.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 underline hover:text-foreground"
          >
            Privacy Policy
          </a>{" "}
          for how we collect, use, and protect your information. Links to third-party sites are provided as a
          convenience; we are not responsible for their content.
        </p>
      </div>
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs print:mt-2">
        <a
          href="https://reports.adviserinfo.sec.gov/reports/ADV/331194/PDF/331194.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          ADV Part 1
        </a>
        <span aria-hidden="true">|</span>
        <a
          href="https://files.adviserinfo.sec.gov/IAPD/Content/Common/crd_iapd_Brochure.aspx?BRCHR_VRSN_ID=1011497"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          ADV Part 2
        </a>
      </p>
    </footer>
  )
}
