import { AlertCircleIcon } from "lucide-react";

export const DataNotFoundArea = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed rounded-xl border-muted bg-muted/5">
      <div className="p-4 rounded-full bg-muted/20">
        <AlertCircleIcon className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="space-y-2 px-10">
        <h3 className="text-xl font-semibold">データが見つかりませんでした</h3>
        <p className="text-muted-foreground mx-auto">
          現在表示できるデータがありません。しばらく経ってから再度アクセスしてください。
        </p>
      </div>
    </div>
  );
};
