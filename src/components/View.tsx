import { client } from "@/sanity/lib/client";
import Ping from "./Ping";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

export default async function View({ id }: { id: string }) {
  const { views }: { views: number } =
    (await client
      .withConfig({ useCdn: false })
      .fetch(STARTUP_VIEWS_QUERY, { id })) || 0;

  after(async () => await writeClient.patch(id).inc({ views: 1 }).commit());

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">
          {views || 0} view{views && views > 1 ? "s" : ""}
        </span>
      </p>
    </div>
  );
}
