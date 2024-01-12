import Spinner from "./spinner";
export default function SpinPage() {
  return (
    <div className=" h-full w-full flex justify-center items-center">
      <div className=" scale-[5]">
        <Spinner></Spinner>
      </div>
    </div>
  );
}
