import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadButton({ data, filename, className = "" }: { data: string, filename: string, className?: string }) {
  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className={className}>
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
}
