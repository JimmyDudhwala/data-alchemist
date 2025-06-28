// components/ValidationSummary.tsx
interface ValidationError {
    file: string;
    rowIndex: number;
    column?: string;
    message: string;
  }
  
  export default function ValidationSummary({ errors }: { errors: ValidationError[] }) {
    if (errors.length === 0) return <p className="text-green-600">✅ No validation errors!</p>;
  
    return (
      <div className="border p-4 rounded bg-red-50">
        <h3 className="text-red-600 font-bold mb-2">Validation Errors</h3>
        <ul className="space-y-1 text-sm">
          {errors.map((err, idx) => (
            <li key={idx}>
              🔴 <strong>{err.file}</strong> row {err.rowIndex + 1}{err.column ? ` (col: ${err.column})` : ""}: {err.message}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  