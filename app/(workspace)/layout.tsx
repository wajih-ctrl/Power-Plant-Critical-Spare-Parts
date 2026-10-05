import { AppSidebar } from '@/components/app-shell/sidebar'
import { AppTopbar } from '@/components/app-shell/topbar'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1480px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
