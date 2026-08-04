interface SmallCardsProps {
  cardNumber?: number;
  icon?: React.ComponentType<{className?:string}>;
  cardHeader: string;
  cardText: string;
}
export const SmallCards = ({
  cardNumber,
  icon: Icon,
  cardHeader,
  cardText,
}: SmallCardsProps) => {
  return (
    <div className="bg-purple-500/10 rounded-2xl flex flex-col gap-6 pt-8 pb-8 px-6">
      <div className="w-11 h-11 rounded-lg bg-purple-500 flex items-center justify-center text-white font medium">{Icon ? <Icon className="w-5 h-5 text-white"/> : cardNumber}</div>
      <div className="flex flex-col gap-2">
        <h3 className="font-jakarta text-white font-medium text-xl leading-7 tracking-[-0.02em]">{cardHeader}</h3>
        <p className="text-neutral-300 text-base font-normal leading-6">
          {cardText}
        </p>
      </div>
    </div>
  );
};
