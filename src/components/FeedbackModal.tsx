import { useStore } from "../stores/useStore";

export default function FeedbackModal() {
  const { feedbackTitle, feedbackMessage, isFeedbackOpen, closeFeedback } =
    useStore();

  if (!isFeedbackOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <p>{feedbackTitle}</p>
      <p>{feedbackMessage}</p>
      <button onClick={closeFeedback}>OK</button>
    </div>
  );
}
