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
            ? "border-green-300"
            : tone === "debuff"
                ? "border-red-300"
                : "border-amber-300";
    const ring =
        tone === "buff"
            ? "focus-within:ring-green-200"
            : tone === "debuff"
                ? "focus-within:ring-red-200"
                : "focus-within:ring-amber-200";


    return (
        <Card className={cx("glass-lite rounded-3xl border", border, ring)}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    {headerAddon}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}