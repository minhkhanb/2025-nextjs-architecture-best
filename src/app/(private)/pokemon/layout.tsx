export default function PokemonLayout({
  drawer,
  main,
}: {
  drawer: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-1/4">{drawer}</aside> {/* Drawer slot */}
      <main className="w-3/4">{main}</main> {/* Main content slot */}
    </div>
  );
}
