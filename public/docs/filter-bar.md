# FilterBar

Two composable filter components: FilterButton (trigger) and ActiveFilters (chips display).

```tsx
import { FilterButton, ActiveFilters } from "@/components/ui/filter-bar"

const fields = [
  {
    type: "option", key: "status", label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    multiple: true,
  },
  {
    type: "date", key: "joinDate", label: "Join Date",
  },
  {
    type: "text", key: "name", label: "Name",
    placeholder: "Search by name...",
  },
]

const [filters, setFilters] = useState([])
const activeKeys = new Set(filters.map(f => f.key))

<div className="flex items-center gap-2">
  <FilterButton
    fields={fields}
    activeKeys={activeKeys}
    onAdd={(key) => setFilters([...filters, { key, type: "pending" }])}
  />
  <ActiveFilters
    fields={fields}
    filters={filters}
    onChange={setFilters}
  />
</div>
```

Filter field types: `option`, `date`, `date-range`, `text`
Filter operators: `is`, `before`, `after` (date), `between` (date-range), `contains`, `equals`, `starts_with` (text)
