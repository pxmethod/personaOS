import { ListboxSelect, type ListboxOption } from '@/components/ui/ListboxSelect'
import {
  DEFAULT_ORGANIZATION_ID,
  ORGANIZATIONS,
  type OrganizationId,
} from '@/lib/organizations'

const ORG_OPTIONS: ListboxOption<OrganizationId>[] = ORGANIZATIONS.map((org) => ({
  value: org.id,
  label: org.name,
  leading: (
    <img
      src={org.logoSrc}
      alt=""
      width={28}
      height={28}
      className="size-7 shrink-0 rounded-md border border-edge/60 bg-[#FBEC2A]/15 object-contain p-0.5"
    />
  ),
}))

export function OrganizationSwitcher({
  value = DEFAULT_ORGANIZATION_ID,
  onChange,
}: {
  value?: OrganizationId
  onChange: (id: OrganizationId) => void
}) {
  return (
    <ListboxSelect
      label="Organization"
      value={value}
      options={ORG_OPTIONS}
      onChange={onChange}
    />
  )
}
