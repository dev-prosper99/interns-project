interface SmallCardsProps {
  cardNumber: number;
  cardHeader: string;
  cardText: string;
}
export const SmallCards = ({
  cardNumber,
  cardHeader,
  cardText,
}: SmallCardsProps) => {
  return (
    <div className="max-w-110 py-8 px-6 bg-[#7C3AED1A] rounded-2xl flex-col gap-6">
      <div className="rounded-lg py-2.5 px-2 bg-purple-500">{cardNumber}</div>
      <div className="flex-col gap-2">
        <h3 className="text-white font-medium text-xl">{cardHeader}</h3>
        <p className="text-neutral-300 text-base font-normal leading-6">
          {cardText}
        </p>
      </div>
    </div>
  );
};
