interface PromoCodeBannerProps {
  code: string;
  discount: string;
}

export default function PromoCodeBanner({
  code,
  discount,
}: PromoCodeBannerProps) {
  return (
    <div
      className="rounded-2xl flex items-center justify-between p-4"
      style={{ backgroundColor: "#0F973D3D" }}
    >
      <p className="text-sm" style={{ color: "#0F973D" }}>
        Promo code: <span className="font-semibold">{code}</span> - {discount}
      </p>
    </div>
  );
}
