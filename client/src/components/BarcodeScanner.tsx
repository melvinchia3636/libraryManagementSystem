import { Result, useZxing } from "react-zxing";

export const BarcodeScanner = ({
  callback,
  paused,
}: {
  callback: (result: Result) => void;
  paused: boolean;
}) => {
  const { ref } = useZxing({
    paused,
    onDecodeResult: callback,
  });

  return (
    <video
      ref={ref}
      className={paused ? "hidden" : "rounded-md overflow-hidden"}
    />
  );
};
