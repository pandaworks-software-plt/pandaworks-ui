import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DemoSection } from "@/showcase/component-page";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(200, "Bio must be 200 characters or less.").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const overviewCode = `import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: "" },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="name@company.com" {...field} />
          </FormControl>
          <FormDescription>We will never share your email.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>`;

function EmailFormExample() {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          form.reset();
        })}
        className="max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@company.com" {...field} />
              </FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

const fieldsCode = `const schema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(200).optional(),
})

<FormField
  control={form.control}
  name="displayName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Display name</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="bio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Bio</FormLabel>
      <FormControl>
        <Textarea rows={3} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

function ProfileFormExample() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", bio: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => form.reset())} className="max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Jordan Lee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="A short introduction…" rows={3} {...field} />
              </FormControl>
              <FormDescription>Optional. Shown on your profile card.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save profile</Button>
      </form>
    </Form>
  );
}

export default function FormDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Overview" code={overviewCode}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Form primitives wire react-hook-form fields to labels, descriptions, and error
            messages with consistent spacing and accessibility.
          </p>
          <EmailFormExample />
        </div>
      </DemoSection>

      <DemoSection title="Multiple fields" code={fieldsCode}>
        <ProfileFormExample />
      </DemoSection>
    </div>
  );
}
