# Modal Component Design

## Summary

A wrapper component around the existing Dialog primitives that provides an opinionated layout with sticky header, scrollable body, and sticky footer. Default width of `sm:min-w-4xl`.

## Approach

Wrapper component (Approach A) -- keeps the base Dialog simple for basic use cases while providing the full header/body/footer pattern as a separate `modal` registry component.

## Sub-components

| Component | Behavior |
|-----------|----------|
| `Modal` | Re-export of `Dialog` (root controlled/uncontrolled state) |
| `ModalTrigger` | Re-export of `DialogTrigger` |
| `ModalClose` | Re-export of `DialogClose` |
| `ModalContent` | Wraps `DialogContent` with `sm:min-w-4xl`, `max-h-[85vh]`, `flex flex-col`, `p-0` |
| `ModalHeader` | Sticky top area with `px-6 py-4 border-b`, renders title + optional description + close button |
| `ModalBody` | `flex-1 overflow-y-auto px-6 py-4` scrollable content area |
| `ModalFooter` | Sticky bottom with `px-6 py-4 border-t`, right-aligned actions |

## Key Decisions

- `ModalHeader` takes `title` and optional `description` as props (not children) for consistency
- Close button built into `ModalHeader` by default (toggleable via `showCloseButton`)
- No size variants -- consumers use `className` to override
- Registry dependency on `dialog`
- `max-h-[85vh]` prevents modal from exceeding viewport
- `p-0` on content so header/body/footer control their own padding

## Usage

```tsx
<Modal>
  <ModalTrigger asChild>
    <Button>Open</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader title="Edit Employee" description="Update details" />
    <ModalBody>
      {/* scrollable form content */}
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild><Button variant="outline">Cancel</Button></ModalClose>
      <Button>Save</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

## File Structure

- `registry/default/modal/modal.tsx` -- component implementation
- Registry entry in `registry.json` with dependency on `dialog`
