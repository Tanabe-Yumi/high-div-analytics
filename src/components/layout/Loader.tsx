import { Spinner } from "@/components/ui/spinner";

interface LoaderPrrops {
  label?: string;
}

export const Loader = ({ label }: LoaderPrrops) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <Spinner />
      {label && <p>{label}</p>}
    </div>
  );
};
