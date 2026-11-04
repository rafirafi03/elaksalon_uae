"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export type SortableColumn = { label: string; className?: string };
export type SortableRow = {
  id: string;
  /** Used in screen-reader announcements and the bulk delete message. */
  label: string;
  /** One node per column (rendered inside <td>, with the column's className). */
  cells: React.ReactNode[];
};

type Props = {
  columns: SortableColumn[];
  rows: SortableRow[];
  /** Singular / plural nouns, e.g. "service" / "services". */
  itemType: string;
  itemTypePlural: string;
  onReorder: (ids: string[]) => Promise<{ error?: string }>;
  onBulkDelete: (ids: string[]) => Promise<{ error?: string }>;
};

type SaveStatus = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

/**
 * Admin table with drag & drop ordering (mouse, touch and keyboard via the grip handle),
 * row checkboxes, select-all and bulk delete.
 */
export default function SortableTable({ columns, rows, itemType, itemTypePlural, onReorder, onBulkDelete }: Props) {
  const rowsKey = rows.map((r) => r.id).join(",");
  const [syncedKey, setSyncedKey] = useState(rowsKey);
  const [order, setOrder] = useState(() => rows.map((r) => r.id));
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });
  const [, startTransition] = useTransition();

  // Server sent a new list (after add/delete/revalidate): adopt it and drop stale selections.
  if (syncedKey !== rowsKey) {
    setSyncedKey(rowsKey);
    setOrder(rows.map((r) => r.id));
    setSelected((prev) => new Set([...prev].filter((id) => rows.some((r) => r.id === id))));
  }

  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = order.map((id) => byId.get(id)).filter((r): r is SortableRow => Boolean(r));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const previous = order;
    const next = arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id)));
    setOrder(next);
    setStatus({ kind: "saving" });
    startTransition(async () => {
      try {
        const result = await onReorder(next);
        if (result.error) {
          setOrder(previous);
          setStatus({ kind: "error", message: result.error });
        } else {
          setStatus({ kind: "saved" });
        }
      } catch {
        setOrder(previous);
        setStatus({ kind: "error", message: "We couldn't save the new order. Please try again." });
      }
    });
  }

  // Hide the "Order saved" note after a moment.
  useEffect(() => {
    if (status.kind !== "saved") return;
    const id = setTimeout(() => setStatus({ kind: "idle" }), 2000);
    return () => clearTimeout(id);
  }, [status]);

  const allSelected = ordered.length > 0 && selected.size === ordered.length;
  const someSelected = selected.size > 0 && !allSelected;
  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  function toggle(id: string, on: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const selectedIds = order.filter((id) => selected.has(id));
  const count = selectedIds.length;

  return (
    <div className="space-y-3">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 px-1">
        {count > 0 ? (
          <div className="flex flex-wrap items-center gap-3 rounded-full bg-surface-elevated py-1.5 pr-1.5 pl-4">
            <span className="text-sm text-cream">
              {count} {count === 1 ? itemType : itemTypePlural} selected
            </span>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs tracking-wide text-muted uppercase transition hover:text-cream"
            >
              Clear
            </button>
            <ConfirmDeleteButton
              itemName=""
              itemType={itemType}
              title={`Delete ${count} ${count === 1 ? itemType : itemTypePlural}?`}
              message={
                <>
                  {selectedIds
                    .slice(0, 5)
                    .map((id) => byId.get(id)?.label)
                    .filter(Boolean)
                    .map((l) => `“${l}”`)
                    .join(", ")}
                  {count > 5 ? ` and ${count - 5} more` : ""} will be permanently deleted. This cannot be undone.
                </>
              }
              triggerLabel={
                <>
                  <Trash2 size={14} />
                  Delete selected
                </>
              }
              triggerClassName="inline-flex items-center gap-1.5 rounded-full bg-danger px-4 py-2 text-xs font-medium text-white transition hover:bg-danger/85"
              onConfirm={async () => {
                const result = await onBulkDelete(selectedIds);
                if (!result.error) setSelected(new Set());
                return result;
              }}
            />
          </div>
        ) : (
          <p className="text-xs text-muted">Drag the handle to reorder. The same order is used on the website.</p>
        )}

        <p className="text-xs" role="status" aria-live="polite">
          {status.kind === "saving" ? (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Loader2 size={13} className="animate-spin" /> Saving order…
            </span>
          ) : null}
          {status.kind === "saved" ? (
            <span className="inline-flex items-center gap-1.5 text-gold">
              <Check size={13} /> Order saved
            </span>
          ) : null}
          {status.kind === "error" ? <span className="text-danger">{status.message}</span> : null}
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-surface-elevated">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            accessibility={{
              screenReaderInstructions: {
                draggable: "Press space or enter to pick up a row, use the arrow keys to move it, and press space or enter again to drop it.",
              },
            }}
          >
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="w-10 py-4 pl-4 font-medium">
                    <span className="sr-only">Reorder</span>
                  </th>
                  <th className="w-10 py-4 pr-2 font-medium">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => setSelected(e.target.checked ? new Set(order) : new Set())}
                      aria-label={`Select all ${itemTypePlural}`}
                      className="h-4 w-4 cursor-pointer accent-[var(--color-gold,#c9a45c)]"
                    />
                  </th>
                  {columns.map((c) => (
                    <th key={c.label} className={cn("px-4 py-4 font-medium", c.className)}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                <tbody>
                  {ordered.map((row) => (
                    <Row
                      key={row.id}
                      row={row}
                      columns={columns}
                      checked={selected.has(row.id)}
                      onCheck={(on) => toggle(row.id, on)}
                      disabled={status.kind === "saving"}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

function Row({
  row,
  columns,
  checked,
  onCheck,
  disabled,
}: {
  row: SortableRow;
  columns: SortableColumn[];
  checked: boolean;
  onCheck: (on: boolean) => void;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    disabled,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "border-t border-border/50 transition-colors hover:bg-surface",
        checked && "bg-gold/5",
        isDragging && "relative z-10 bg-surface shadow-2xl",
      )}
    >
      <td className="py-4 pl-4">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${row.label}`}
          className="flex h-8 w-8 cursor-grab touch-none items-center justify-center rounded-full text-muted transition hover:bg-background hover:text-gold active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="py-4 pr-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          aria-label={`Select ${row.label}`}
          className="h-4 w-4 cursor-pointer accent-[var(--color-gold,#c9a45c)]"
        />
      </td>
      {row.cells.map((cell, i) => (
        <td key={i} className={cn("px-4 py-4", columns[i]?.className)}>
          {cell}
        </td>
      ))}
    </tr>
  );
}
