interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export default function ImageWithCaption({ src, alt, caption, className = "" }: ImageWithCaptionProps) {
  return (
    <figure className={`my-8 ${className}`}>
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
