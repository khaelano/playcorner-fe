type Game = {
  id: number;
  title: string;
  coverPictUrl: string;
};

export default function GameSlide({ id, title, coverPictUrl }: Game) {
  return (
    <div
      key={id}
      className="aspect-16/9 w-full rounded-3xl bg-cover drop-shadow-black/25 drop-shadow-[0_0_0.5rem] overflow-hidden"
      style={{
        backgroundImage: `url(${coverPictUrl})`,
      }}
    >
      <div className="absolute w-full h-full bg-linear-to-t from-black/35 from-15 to-transparent to-40%" />
      <p className="absolute bottom-4 left-6 font-semibold text-white text-nowrap text-ellipsis">
        {title}
      </p>
    </div>
  );
}
