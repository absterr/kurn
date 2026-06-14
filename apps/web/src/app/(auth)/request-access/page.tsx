import RequestAccessForm from "./RequestAccessForm";

export default function RequestAccessPage() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Request Access
      </h1>
      <RequestAccessForm />
    </div>
  );
}
