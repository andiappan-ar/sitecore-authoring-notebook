import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        {/* Authoring Sections */}
        <div className="flex flex-col items-center sm:items-start w-full gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Sitecore Authoring Notebook</h1>
          <p className="text-sm text-muted-foreground max-w-prose">
            A unique content authoring experience using a notebook-style, spreadsheet interface.
            Designed for rapid editing, bulk updates, and intuitive content manipulation.
          </p>
        </div>

        {/* Authoring XP & XMC Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 w-full">
          {/* Authoring XP */}
          <div className="p-5 border rounded-xl bg-gray-50 dark:bg-gray-900 shadow-sm">
            <h3 className="text-lg font-medium mb-1">Authoring XP</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Author Sitecore XP content in a spreadsheet-style interface. Enables fast updates,
              multi-field editing, and content structure visibility at a glance.
            </p>
            <Link
              href="/xp/setup"
              className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
              Launch Authoring XP →
            </Link>
          </div>

          {/* Authoring XMC */}
          <div className="p-5 border rounded-xl bg-gray-50 dark:bg-gray-900 shadow-sm">
            <h3 className="text-lg font-medium mb-1">Authoring XMC</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Spreadsheet-driven content authoring for XM Cloud. Provides visual editing, bulk entry,
              and seamless publishing for headless environments.
            </p>
            <Link
              href="/authoring-xmc"
              className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
              Launch Authoring XMC →
            </Link>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <span>© {new Date().getFullYear()} Sitecore Authoring Notebook</span>
        <a href="/about" className="hover:underline">
          About
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </footer>
    </div>
  );
}
