import { AlertTriangle, Bug, Clock, Copy, MoreHorizontal } from 'lucide-react';
import { DemoSection } from '@/showcase/component-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetaDivider, TableListCell } from '@/components/ui/table-list-cell';

const TICKETS = [
  {
    id: 'TICKET-1042',
    title: 'Login fails when SSO session expires mid-checkout',
    customer: 'Atlas Logistics',
    sla: 'Today',
    priority: 'high',
    type: 'bug',
  },
  {
    id: 'TICKET-1041',
    title: 'Add CSV export to the activity report',
    customer: 'Luna Labs',
    sla: 'In 2 days',
    priority: 'medium',
    type: 'feature',
  },
  {
    id: 'TICKET-1039',
    title: 'Dashboard widgets render off-canvas on Safari 17',
    customer: 'Helix Studio',
    sla: 'Breached',
    priority: 'high',
    type: 'bug',
  },
];

export default function TableListCellDemo() {
  return (
    <>
      <DemoSection
        title="Two-line ticket row"
        code={`<TableListCell
  leadingIcon={<Bug className="size-4 text-destructive" />}
  eyebrow="#TICKET-1042"
  title="Login fails when SSO session expires mid-checkout"
  meta={
    <>
      <Badge variant="destructive" size="xs">SLA breached</Badge>
      <Badge variant="warning" size="xs">High</Badge>
      <MetaDivider />
      <Badge variant="outline" size="xs">Atlas Logistics</Badge>
    </>
  }
/>`}
      >
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-6 py-3">Ticket</TableHead>
              <TableHead className="w-10 px-3 py-3" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {TICKETS.map((t) => (
              <TableRow key={t.id} className="group cursor-pointer hover:bg-accent">
                <TableListCell
                  leadingIcon={
                    t.type === 'bug' ? (
                      <Bug className="size-4 shrink-0 text-destructive" />
                    ) : (
                      <Clock className="size-4 shrink-0 text-info" />
                    )
                  }
                  eyebrow={`#${t.id}`}
                  title={t.title}
                  meta={
                    <>
                      {t.sla === 'Breached' ? (
                        <Badge variant="destructive" size="xs">
                          <AlertTriangle className="size-3" />
                          SLA breached
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="xs">
                          <Clock className="size-3" />
                          SLA {t.sla}
                        </Badge>
                      )}
                      <Badge variant={t.priority === 'high' ? 'destructive' : 'muted'} size="xs">
                        {t.priority}
                      </Badge>
                      <MetaDivider />
                      <Badge variant="outline" size="xs">
                        {t.customer}
                      </Badge>
                    </>
                  }
                />
                <TableCell className="px-3 py-4 text-right">
                  <Button variant="ghost" size="icon-sm" aria-label="Row actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection
        title="Title only (no leading icon, no eyebrow)"
        code={`<TableListCell
  title="Standard Onboarding"
  meta={
    <>
      <Badge variant="muted" size="xs">Admin</Badge>
      <Badge variant="muted" size="xs">Support</Badge>
      <Badge variant="muted" size="xs">Developer</Badge>
    </>
  }
/>`}
      >
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-6 py-3">Template</TableHead>
              <TableHead className="w-10 px-3 py-3" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="group cursor-pointer hover:bg-accent">
              <TableListCell
                title="Standard Onboarding"
                meta={
                  <>
                    <Badge variant="muted" size="xs">
                      Admin
                    </Badge>
                    <Badge variant="muted" size="xs">
                      Support
                    </Badge>
                    <Badge variant="muted" size="xs">
                      Developer
                    </Badge>
                  </>
                }
              />
              <TableCell className="px-3 py-4 text-right">
                <Button variant="ghost" size="icon-sm" aria-label="Copy link">
                  <Copy className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>
    </>
  );
}
