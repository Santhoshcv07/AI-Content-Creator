export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 md:slide-in-from-right-12 duration-500 ease-out fill-mode-both">
      {children}
    </div>
  );
}