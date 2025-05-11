
export function LoadingState() {
  return (
    <div className="text-center p-8 w-full max-w-md">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resume-primary mx-auto mb-4"></div>
      <p className="text-lg font-medium">Loading analysis results...</p>
      <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
    </div>
  );
}
