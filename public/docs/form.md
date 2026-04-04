# Form

Form components with react-hook-form integration, field context, validation, and accessible labels.

```tsx
import { useForm } from "react-hook-form"
import {
  Form, FormField, FormItem,
  FormLabel, FormControl, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const form = useForm({ defaultValues: { name: "" } })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```
