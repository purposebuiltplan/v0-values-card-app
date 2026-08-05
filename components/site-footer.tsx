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
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs print:mt-2">
        <a
          href="https://purposefp.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Privacy Policy
        </a>
        <span aria-hidden="true">|</span>
        <a
          href="https://purposefp.com/?page_id=230"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Disclosures
        </a>
        <span aria-hidden="true">|</span>
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
