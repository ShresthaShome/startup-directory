"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Hourglass, Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createIdea } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function StartupForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [fetcher, setFetcher] = useState<Record<string, string>>({});

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      setFetcher(formValues);

      await formSchema.parseAsync(formValues);

      // console.log(formValues);

      const result = await createIdea(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        setFetcher({});

        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully.",
        });

        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description:
            "Validation failed. Please check your input and try again.",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occured.",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occured",
        status: "ERROR",
      };
    }
    // finally {
    // }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Add Startup Title"
          value={fetcher.title || ""}
          onChange={(e) => setFetcher({ ...fetcher, title: e.target.value })}
        />

        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Add Description"
          value={fetcher.description || ""}
          onChange={(e) =>
            setFetcher({ ...fetcher, description: e.target.value })
          }
        />

        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Ex. Tech / Health / Education..."
          value={fetcher.category || ""}
          onChange={(e) => setFetcher({ ...fetcher, category: e.target.value })}
        />

        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image Link
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Add Image URL [Ex.: https://example.com/image.jpg]"
          value={fetcher.link || ""}
          onChange={(e) => setFetcher({ ...fetcher, link: e.target.value })}
        />

        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          id="pitch"
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          preview="edit"
          height={300}
          //area-required
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your startup idea.",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? (
          <>
            Creating...
            <Hourglass className="animate-spin !size-6 ml-2" />
          </>
        ) : (
          <>
            Create New Startup
            <Send className="!size-6 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
