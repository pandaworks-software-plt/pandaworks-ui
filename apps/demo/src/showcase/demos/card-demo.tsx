import { DemoSection } from '@/showcase/component-page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CardDemo() {
  return (
    <>
      <DemoSection
        title="Basic Card"
        code={`import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Employee Overview</CardTitle>
    <CardDescription>Summary of team members.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Total Employees: 142</p>
  </CardContent>
</Card>`}
      >
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
            <CardDescription>View a summary of your team members and their current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Employees</span>
                <span className="font-medium">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active</span>
                <span className="font-medium">138</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">On Leave</span>
                <span className="font-medium">4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DemoSection>

      <DemoSection title="Card with Footer">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review pending leave requests and performance review submissions from your team.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" className="flex-1">
              Dismiss
            </Button>
            <Button className="flex-1">View All</Button>
          </CardFooter>
        </Card>
      </DemoSection>

      <DemoSection title="Card with Form">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Create Department</CardTitle>
            <CardDescription>Add a new department to your organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="dept-name">
                  Department Name <span className="text-destructive">*</span>
                </Label>
                <Input id="dept-name" placeholder="e.g. Engineering" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="dept-code">Department Code</Label>
                <Input id="dept-code" placeholder="e.g. ENG" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="dept-head">Department Head</Label>
                <Input id="dept-head" placeholder="Select a manager" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Create</Button>
          </CardFooter>
        </Card>
      </DemoSection>

      <DemoSection
        title="Title Sizes"
        code={`<Card>
  <CardHeader>
    <CardTitle>Standard card</CardTitle>
    <CardDescription>16px (default size="sm") — for product cards, dense grids, tile-sized cards.</CardDescription>
  </CardHeader>
</Card>

<Card>
  <CardHeader>
    <CardTitle size="md">Dashboard card</CardTitle>
    <CardDescription>18px — slightly more prominent dashboard / detail page cards.</CardDescription>
  </CardHeader>
</Card>

<Card>
  <CardHeader>
    <CardTitle size="lg">Hero surface</CardTitle>
    <CardDescription>24px — for hero / single-card surfaces.</CardDescription>
  </CardHeader>
</Card>`}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Standard card</CardTitle>
              <CardDescription>16px — default product card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The SaaS-default product card size — also fits dense 3- and 4-up grids.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle size="md">Dashboard card</CardTitle>
              <CardDescription>18px — slightly more prominent.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Sits between the default product card and a hero card.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle size="lg">Hero surface</CardTitle>
              <CardDescription>24px — for single-card / hero surfaces.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Use when the card is the page's primary subject.</p>
            </CardContent>
          </Card>
        </div>
      </DemoSection>

      <DemoSection title="Color Variants">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card color="blue">
            <CardHeader>
              <CardTitle size="sm">Blue</CardTitle>
              <CardDescription>Gradient card with blue tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Suitable for informational or primary content cards.</p>
            </CardContent>
          </Card>

          <Card color="purple">
            <CardHeader>
              <CardTitle size="sm">Purple</CardTitle>
              <CardDescription>Gradient card with purple tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Great for creative or premium feature highlights.</p>
            </CardContent>
          </Card>

          <Card color="peach">
            <CardHeader>
              <CardTitle size="sm">Peach</CardTitle>
              <CardDescription>Gradient card with peach tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Warm and inviting for social or people-related content.</p>
            </CardContent>
          </Card>

          <Card color="indigo">
            <CardHeader>
              <CardTitle size="sm">Indigo</CardTitle>
              <CardDescription>Gradient card with indigo tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Works well for analytics or data-driven sections.</p>
            </CardContent>
          </Card>

          <Card color="green">
            <CardHeader>
              <CardTitle size="sm">Green</CardTitle>
              <CardDescription>Gradient card with green tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ideal for success states or growth metrics.</p>
            </CardContent>
          </Card>

          <Card color="amber">
            <CardHeader>
              <CardTitle size="sm">Amber</CardTitle>
              <CardDescription>Gradient card with amber tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Good for warnings or attention-requiring content.</p>
            </CardContent>
          </Card>

          <Card color="rose">
            <CardHeader>
              <CardTitle size="sm">Rose</CardTitle>
              <CardDescription>Gradient card with rose tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Suited for urgent or high-priority information.</p>
            </CardContent>
          </Card>

          <Card color="teal">
            <CardHeader>
              <CardTitle size="sm">Teal</CardTitle>
              <CardDescription>Gradient card with teal tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Perfect for health, wellness, or status cards.</p>
            </CardContent>
          </Card>
        </div>
      </DemoSection>
    </>
  );
}
