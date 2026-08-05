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
    </footer>
  )
}
