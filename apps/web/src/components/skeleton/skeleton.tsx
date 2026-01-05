import { cn } from "@web/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn("bg-gray-200 animate-pulse rounded-md", className)}
            {...props}
        />
    );
}

export { Skeleton };
