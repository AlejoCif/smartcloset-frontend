export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-10 h-10 border-4 border-surface border-t-accent rounded-full animate-spin" />
      {text && <p className="text-primary/60 font-body text-sm">{text}</p>}
    </div>
  )
}
