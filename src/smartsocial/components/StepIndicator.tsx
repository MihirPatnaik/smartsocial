//D:\datasenceai\src\smartsocial\components\StepIndicator.tsx

export default function StepIndicator({ step }: { step: number }) {
  const steps = ["Prompt", "Review", "Post"];
  return (
    <div className="flex justify-center space-x-4 mb-6">
      {steps.map((label, index) => (
        <div
          key={label}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            index + 1 === step
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
