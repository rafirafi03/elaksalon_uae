import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
};

/**
 * Shared page width + horizontal gutters.
 * Middle ground: enough inset without large empty sides.
 */
export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[85rem] px-5 sm:px-6 lg:px-12 xl:px-14",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
