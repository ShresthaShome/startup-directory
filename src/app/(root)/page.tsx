import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const posts = [
    {
      _createdAt: new Date(),
      views: 100,
      author: { _id: 1, name: "BOSS Ullas" },
      _id: 1,
      description: "description",
      image: "https://i1.perfumesclub.com/grande/23339-4.jpg",
      category: "BOSS",
      title: "BOSS",
    },
  ];

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Startup, <br /> Connect With Other Entreprenuers
        </h1>

        <p className="sub-heading !max-w-3xl ">
          Submit Ideas, Vote on Pitches, Get Noticed and Compete Virtually!
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold ">
          {query ? `All search results for "${query}"` : "Showing All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length ? (
            posts.map((post /*: StartupCardType*/, index: number) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
