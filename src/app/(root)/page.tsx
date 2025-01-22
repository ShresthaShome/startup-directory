import SearchForm from "@/components/SearchForm";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Startup, <br /> Connect With Other Entreprenuers
        </h1>

        <p className="sub-heading !max-w-3xl ">
          Submit ideas, vote on pitches, get noticed and compete virtually!
        </p>

        <SearchForm query={query} />
      </section>
    </>
  );
}
