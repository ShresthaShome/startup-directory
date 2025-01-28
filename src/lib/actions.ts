"use server";

import { auth } from "@/auth";
import { parseServerResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { Session } from "next-auth";

export const createIdea = async (
  state: any,
  formData: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session)
    return parseServerResponse({ error: "Not signed in", status: "ERROR" });

  const { title, description, category, link } = Object.fromEntries(
    Array.from(formData).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      pitch,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: (() => {
          const sessionWithId = session as Session & { id: string };
          return sessionWithId?.id;
        })(), // ensured type management
      },
    };

    const result = await writeClient.create({ _type: "startup", ...startup });

    return parseServerResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
