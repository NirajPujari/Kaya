import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-20">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by Kaya Fitness. Tracking your path to strength.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
