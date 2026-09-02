interface BannerImageSectionProps {
  image: string;
  alt: string;
}
 
export default function BannerImageSection({ image, alt }: BannerImageSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-neutral-500 text-xs">Banner Image</p>
      <img
        src={image}
        alt={alt}
        className="w-full rounded-2xl object-cover"
        style={{ maxHeight: 406 }}
      />
    </div>
  );
}