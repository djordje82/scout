import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tracks = ["Circle", "Tavily", "Nebius", "OOBE"];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0a0a0a] p-8 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Whale<span className="text-[#3b82f6]">Sight</span> AI
        </h1>
        <p className="max-w-md text-sm text-neutral-400">
          Autonomous on-chain market intelligence agent — scaffold is live.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {tracks.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="w-full max-w-md border-neutral-800 bg-neutral-950 text-white">
        <CardHeader>
          <CardTitle>Scaffold check</CardTitle>
          <CardDescription className="text-neutral-400">
            Tailwind + Shadcn UI render confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">It works</Button>
        </CardContent>
      </Card>
    </main>
  );
}
