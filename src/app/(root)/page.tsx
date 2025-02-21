import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { client } from "@/sanity/lib/client";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const [{ data }, fallbackData] = await Promise.all([
    sanityFetch<any>({
      query: STARTUPS_QUERY,
      params,
    }),
    client.withConfig({ useCdn: false }).fetch(STARTUPS_QUERY, params),
  ]);

  const posts: StartupCardType[] =
    fallbackData.length > data.length ? fallbackData : data;

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
            posts.map((post: StartupCardType) => (
              <StartupCard key={post._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
