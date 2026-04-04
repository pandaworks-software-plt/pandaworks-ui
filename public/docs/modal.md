# Modal

An opinionated modal built on Dialog with sticky header, scrollable body, and sticky footer. Use for form modals and complex content that may overflow.

```tsx
import {
  Modal, ModalTrigger, ModalClose, ModalContent,
  ModalHeader, ModalBody, ModalFooter,
} from "@/components/ui/modal"

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader title="Edit Employee" description="Update employee details." />
    <ModalBody>
      {/* Scrollable content */}
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild><Button variant="outline">Cancel</Button></ModalClose>
      <Button>Save</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

ModalHeader props:
- `title: string` -- Header title
- `description?: string` -- Optional description below title
- `showCloseButton?: boolean` -- Show X close button (default: true)

Dependencies: dialog
