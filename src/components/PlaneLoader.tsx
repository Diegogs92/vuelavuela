export default function PlaneLoader({ size = "large" }: { size?: "small" | "medium" | "large" }) {
  const containerSizes = {
    small: "w-32 h-24",
    medium: "w-48 h-32",
    large: "w-64 h-40"
  };

  const planeSizes = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-20 h-20"
  };

  return (
    <div className={`${containerSizes[size]} relative overflow-hidden flex items-end justify-start pb-4 pl-4`}>
      {/* Pista de despegue */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/20">
        <div className="absolute inset-0 flex gap-2">
          <div className="flex-1 h-full bg-muted-foreground/30 animate-runway"></div>
          <div className="flex-1 h-full bg-muted-foreground/30 animate-runway" style={{ animationDelay: '0.2s' }}></div>
          <div className="flex-1 h-full bg-muted-foreground/30 animate-runway" style={{ animationDelay: '0.4s' }}></div>
          <div className="flex-1 h-full bg-muted-foreground/30 animate-runway" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>

      {/* Avión despegando */}
      <svg
        className={`${planeSizes[size]} text-primary animate-plane-taxiing-takeoff`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>

      {/* Nubes de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-cloud-1 absolute top-2 left-1/4 text-muted-foreground/20">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </div>
        <div className="animate-cloud-2 absolute top-8 right-1/4 text-muted-foreground/20">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
