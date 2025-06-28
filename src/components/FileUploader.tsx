// components/FileUploader.tsx
"use client";

import { parseCSV } from "@/lib/parser";

interface FileUploaderProps {
  onDataParsed: (data: any[], name: string) => void;
}

export default function FileUploader({ onDataParsed }: FileUploaderProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await parseCSV(file);
    const name = file.name.toLowerCase().includes("client")
      ? "clients"
      : file.name.toLowerCase().includes("task")
      ? "tasks"
      : "workers";

    onDataParsed(data, name);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload CSV</label>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}
