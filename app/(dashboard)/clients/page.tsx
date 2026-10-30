import { getCurrentSessionContext } from '@/lib/auth/session'
import { query } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ClientsList, ClientRecord } from '@/components/clients/ClientsList'

export const metadata = {
  title: 'Clients Directory | INNOVENTIX Hub',
  description: 'Manage agency client records, communication modes, and platform channels.',
}

export default async function ClientsPage() {
  const session = await getCurrentSessionContext()

  if (!session || !session.user) {
    redirect('/auth/signin')
  }

  if (!session.organization) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 p-8 text-center text-muted-foreground">
        No active organization selected. Please choose or create an organization first.
      </div>
    )
  }

  let clientsDataRaw: any[] = []
  try {
    const clientsData = await query<any>(
      `SELECT * FROM clients
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [session.organization.id]
    )
    clientsDataRaw = clientsData || []
  } catch (err) {
    console.error('Error in clients query:', err)
  }

  let organizationTags: string[] = []
  try {
    const tagsRes = await query<{ name: string }>(
      `SELECT name FROM tags WHERE organization_id = $1 ORDER BY name ASC`,
      [session.organization.id]
    )
    organizationTags = (tagsRes || []).map((t: any) => t.name)
  } catch (err) {
    console.error('Error fetching organization tags:', err)
  }

  const clients: ClientRecord[] = (clientsDataRaw || []).map((c: any) => {
    let parsedTags: string[] = []
    if (Array.isArray(c.tags)) {
      parsedTags = c.tags
    } else if (typeof c.tags === 'string' && c.tags.trim()) {
      try {
        const parsed = JSON.parse(c.tags)
        if (Array.isArray(parsed)) parsedTags = parsed
      } catch {
        if (c.tags.startsWith('{') && c.tags.endsWith('}')) {
          parsedTags = c.tags.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^"|"$/g, ''))
        } else {
          parsedTags = [c.tags.trim()]
        }
      }
    }

    return {
      id: c.id,
      organization_id: c.organization_id,
      name: c.name,
      company: c.company,
      email: c.email,
      phone: c.phone,
      platform: c.platform,
      country: c.country,
      currency: c.currency,
      payment_schedule: c.payment_schedule,
      status: c.status,
      communication_mode: c.communication_mode,
      notes: c.notes,
      tags: parsedTags,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }
  })

  return (
    <div className="space-y-6">
      <ClientsList
        initialClients={clients}
        userRole={session.role}
        isSuperAdmin={session.isSuperAdmin}
        organizationTags={organizationTags}
      />
    </div>
  )
}
