import { Header } from "@/components/header"
import { ProfileSettings, NotificationSettings, SecuritySettings, DataSettings } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Ajustes" subtitle="Configura tu cuenta y preferencias" />

      <div className="p-8 space-y-8 max-w-4xl">
        <ProfileSettings />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotificationSettings />
          <SecuritySettings />
        </div>
        <DataSettings />
      </div>
    </div>
  )
}
