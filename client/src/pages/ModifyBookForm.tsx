/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import Button from "../components/Button";
import beep from "../sounds/beep.mp3";
import { BarcodeScanner } from "../components/BarcodeScanner";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import LanguageSelector from "../components/LanguageSelector";
import TagInput from "../components/TagInput";

export interface IFormData {
  title: string;
  authors: {
    id: string;
    text: string;
    className: string;
  }[];
  isbn: string;
  genres: {
    id: string;
    text: string;
    className: string;
  }[];
  language: string;
  publicationYear: string;
  publisher: string;
  pageCount: string;
  coverImage: string;
  description: string;
}

const ModifyBookForm: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    authors: [],
    isbn: "",
    genres: [],
    language: "",
    publicationYear: "",
    publisher: "",
    pageCount: "",
    coverImage: "", // Assuming you'll handle image uploads separately
    description: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchDataLoading, setIsFetchDataLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const fetchBookData = async () => {
    setIsFetchDataLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}/books/isbn-query/${formData.isbn}`
    );
    if (response.ok) {
      const data = (await response.json()).book;
      if (!data) {
        toast.error("Book not found.");
        setIsFetchDataLoading(false);
        return;
      }

      setFormData({
        ...formData,
        title: data.title,
        publisher: data.publisher,
        coverImage: data.image,
        publicationYear: data.date_published
          ? typeof data.date_published === "number"
            ? data.date_published + ""
            : data.date_published.split("-")[0]
          : "",
        language: data.language,
        genres:
          data.subjects?.map((genre: string) => ({
            id: genre,
            text: genre,
            className: "",
          })) ?? [],
        authors:
          data.authors?.map((author: string) => ({
            id: author,
            text: author,
            className: "",
          })) ?? [],
        pageCount: data.pages + "",
        description: data.synopsis,
      });
      setIsFetchDataLoading(false);
    } else {
      const data = await response.json();
      toast.error(data.error || "Failed to fetch book data.");
      setIsFetchDataLoading(false);
    }
  };

  const { isAuthenticated } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addBookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    authors: z.array(z.string()).min(1, "Author is required"),
    isbn: z.string().optional(),
    genre: z.string().optional(),
    publicationYear: z.string().optional(),
    language: z.string().optional(),
    publisher: z.string().optional(),
    coverImage: z.string().optional(),
    pageCount: z.number().optional(),
    description: z.string().optional(),
  });

  const cleanedUpFormData = {
    title: formData.title,
    authors: formData.authors.map((author) => author.text),
    isbn: formData.isbn,
    genres: formData.genres.map((genre) => genre.text),
    language: formData.language,
    publicationYear: formData.publicationYear,
    publisher: formData.publisher,
    coverImage: formData.coverImage,
    pageCount: parseInt(formData.pageCount),
    description: formData.description,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addBookSchema.parse(cleanedUpFormData);
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/books${
          location.pathname.startsWith("/modify") ? `/${id}` : ""
        }`,
        {
          method: location.pathname.startsWith("/modify") ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(cleanedUpFormData),
        }
      );

      if (response.ok) {
        toast.success(
          `Book ${
            location.pathname.startsWith("/modify") ? "updated" : "added"
          } successfully!`
        );
        if (location.pathname.startsWith("/modify")) {
          // Redirect to book list after updating book
          navigate("/");
          return;
        }

        setFormData({
          title: "",
          authors: [],
          isbn: "",
          genres: [],
          language: "",
          publicationYear: "",
          publisher: "",
          coverImage: "",
          pageCount: "",
          description: "",
        });
      } else {
        const data = await response.json();
        toast.error(data.error || { general: "Failed to add book" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.formErrors);
      } else {
        toast.error("An error occurred while adding the book");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith("/modify")) {
      fetch(`${import.meta.env.VITE_API_HOST}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            ...data,
            authors: data.authors.map((author: any) => ({
              id: author.name,
              text: author.name,
              className: "",
            })),
            genres: data.genres.map((genre: any) => ({
              id: genre.name,
              text: genre.name,
              className: "",
            })),
            publicationYear: data.publicationYear + "",
            description: data.description ?? "",
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to fetch book data");
        });
    }
  }, [location.pathname, id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <div className="flex-1 flex flex-col items-center mt-28 mb-6 px-8 md:px-20">
      <h2 className="text-2xl font-bold w-full flex items-center gap-4 mb-8">
        <Icon icon="mdi:book-plus" className="text-3xl" />
        Add New Book
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TagInput
          label="Author"
          tags={formData.authors}
          placeholder="Add author..."
          name="authors"
          setFormData={setFormData}
        />
        <FormInput
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          sideButton={
            <Button
              type="button"
              onClick={() => setScanning(!scanning)}
              className="ml-2"
              variant="secondary"
              icon="mdi:barcode-scan"
            >
              {scanning ? "Stop" : "Scan"}
            </Button>
          }
        />
        <BarcodeScanner
          paused={!scanning}
          callback={(result) => {
            setFormData({ ...formData, isbn: result.getText() });
            setScanning(false);
            const button = document.createElement("button");
            button.onclick = () => {
              new Audio(beep).play();
            };
            button.click();
          }}
        />
        <TagInput
          label="Genre"
          tags={formData.genres}
          placeholder="Add genre..."
          name="genres"
          setFormData={setFormData}
        />
        <LanguageSelector
          value={formData.language}
          onChange={(value) => setFormData({ ...formData, language: value })}
        />
        {[
          ["Publication Year", "publicationYear", "text"],
          ["Publisher", "publisher", "text"],
          ["Page Count", "pageCount", "number"],
          ["Cover Image", "coverImage", "text"],
          ["Description", "description", "textarea"],
        ].map(([label, name, type]) => (
          <FormInput
            key={name}
            label={label}
            name={name}
            type={type}
            value={formData[name as keyof IFormData] as string}
            onChange={handleChange}
          />
        ))}
        <Button
          type="button"
          variant="secondary"
          className="w-full !mt-8"
          icon={!isFetchDataLoading ? "tabler:database" : ""}
          onClick={() => fetchBookData()}
          disabled={isFetchDataLoading}
        >
          {isFetchDataLoading ? (
            <Icon icon="svg-spinners:180-ring" />
          ) : (
            "Fetch Book Data"
          )}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full !mt-2"
          icon="tabler:plus"
        >
          {isLoading
            ? `${
                location.pathname.startsWith("/modify") ? "Updating" : "Adding"
              } book...`
            : `${
                location.pathname.startsWith("/modify") ? "Update" : "Add"
              } Book`}
        </Button>
      </form>
    </div>
  );
};

export default ModifyBookForm;
