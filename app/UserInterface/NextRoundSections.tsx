import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

// Section Component
interface SectionProps {
    title: string;
    tone: "buff" | "debuff" | "neutral";
    children: React.ReactNode;
    headerAddon?: React.ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" ");

export function Section({ title, tone, children, headerAddon }: SectionProps) {
    const border =
        tone === "buff"
            ? "border-green-500/30"
            : tone === "debuff"
                ? "border-red-500/30"
                : "border-white/20";
    const ring =
        tone === "buff"
            ? "focus-within:ring-green-200/50"
            : tone === "debuff"
                ? "focus-within:ring-red-200/50"
                : "focus-within:ring-amber-200/50";


    return (
        <Card className={cx("border rounded-xl bg-white/40 drop-shadow-lg", border, ring)}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-neutral-900">{title}</CardTitle>
                    {headerAddon}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}