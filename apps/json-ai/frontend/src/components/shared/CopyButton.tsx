import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyButton({ text, className = "" }: { text: string, className?: string }) {
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className={className}>
      <Copy className="mr-2 h-4 w-4" />
      Copy
    </Button>
  );
}
