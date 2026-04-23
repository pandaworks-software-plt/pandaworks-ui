import { Download, Plus, Pencil, Trash2 } from "lucide-react";
import { DemoSection } from "@/showcase/component-page";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export default function PageHeaderDemo() {
  return (
    <>
      <DemoSection title="List page" code={`import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

<PageHeader
  title="Employees"
  description="Manage your team members."
  actions={
    <>
      <Button variant="outline" size="sm">Export</Button>
      <Button size="sm">
        <Plus className="size-4 mr-2" />
        Add Employee
      </Button>
    </>
  }
/>`}>
        <PageHeader
          title="Employees"
          description="Manage your team members and their information."
          actions={
            <>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="size-4 mr-2" />
                Add Employee
              </Button>
            </>
          }
        />
      </DemoSection>

      <DemoSection title="Detail page">
        <PageHeader
          title="John Doe"
          description="Software Engineer -- Engineering Department"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Pencil className="size-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </>
          }
        />
      </DemoSection>

      <DemoSection title="Title only">
        <PageHeader title="Settings" />
      </DemoSection>

      <DemoSection title="With description, no actions">
        <PageHeader
          title="Dashboard"
          description="Overview of key metrics and recent activity."
        />
      </DemoSection>
    </>
  );
}
