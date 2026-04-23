import { DemoSection } from "@/showcase/component-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SIDES = ["top", "right", "bottom", "left"] as const;

export default function SheetDemo() {
  return (
    <>
      <DemoSection title="Sheet Sides" code={`import {
  Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>
        Sheet description goes here.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Sheet content */}
    </div>
  </SheetContent>
</Sheet>`}>
        <div className="flex flex-wrap gap-2">
          {SIDES.map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" className="capitalize">
                  Open {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Sheet from {side}</SheetTitle>
                  <SheetDescription>
                    This sheet opens from the {side} of the screen.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Use sheets for supplementary content that does not require
                    the user to leave the current page context.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Sheet with Form">
        <Sheet>
          <SheetTrigger asChild>
            <Button>Edit Profile</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Update your profile information. Click save when you are done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <Label htmlFor="sheet-name">Name</Label>
                <Input id="sheet-name" defaultValue="Jane Smith" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sheet-email">Email</Label>
                <Input
                  id="sheet-email"
                  type="email"
                  defaultValue="jane@company.com"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sheet-role">Role</Label>
                <Input id="sheet-role" defaultValue="Senior Engineer" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button>Save Changes</Button>
            </div>
          </SheetContent>
        </Sheet>
      </DemoSection>
    </>
  );
}
