import { Button } from '../Button';

interface ExamplePresentationProps {
  count: number;
  onIncrement: () => void;
}

export default function ExamplePresentation({ count, onIncrement }: ExamplePresentationProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-3xl font-bold">Ejemplo de Patrón Container-Presentational</h1>

      <div className="mb-6 text-center">
        <p className="mb-4 text-2xl font-bold">{count}</p>
        <Button onClick={onIncrement}>Incrementar</Button>
      </div>
    </div>
  );
}
