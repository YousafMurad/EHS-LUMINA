// Avatar Component - User profile images
interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

export function Avatar({ src, alt, size = "md", fallback }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  // Generate initials from alt text
  const initials = fallback || alt.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium`}>
      {initials}
    </div>
  );
}
