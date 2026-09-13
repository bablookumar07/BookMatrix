import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ImagePlus,
  Upload,
  X,
  Save,
  FileText,
  Layers3,
  Hash,
  AlertTriangle,
} from "lucide-react";

import API from "../../services/api";

const categories = [
  "Technology",
  "Classic",
  "Self Development",
  "Finance",
  "Productivity",
  "Science",
  "Literature",
  "History",
  "Other",
];

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    totalCopies: "",
    availableCopies: "",
  });

  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/books/${id}`
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to fetch book"
          );
        }

        const book =
          response.data?.book ||
          response.data?.data;

        if (!book) {
          throw new Error("Book not found");
        }

        setFormData({
          title: book.title || "",
          author: book.author || "",
          description:
            book.description || "",
          category: book.category || "",
          totalCopies:
            book.totalCopies !== undefined
              ? String(book.totalCopies)
              : "",
          availableCopies:
            book.availableCopies !==
              undefined
              ? String(book.availableCopies)
              : "",
        });

        setPreview(
          book.coverImage?.url || ""
        );
      } catch (err) {
        console.error(
          "Failed to fetch book:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load book"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WebP image files are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Cover image must be 5MB or smaller."
      );

      event.target.value = "";
      return;
    }

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setCover(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeCover = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setCover(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (submitting) {
      return;
    }

    const title = formData.title.trim();
    const description =
      formData.description.trim();

    const total = Number(
      formData.totalCopies
    );

    const available = Number(
      formData.availableCopies
    );

    if (
      !title ||
      !description ||
      !formData.category ||
      formData.totalCopies === "" ||
      formData.availableCopies === ""
    ) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    if (
      !Number.isInteger(total) ||
      total < 1
    ) {
      setError(
        "Total copies must be a positive whole number."
      );
      return;
    }

    if (
      !Number.isInteger(available) ||
      available < 0 ||
      available > total
    ) {
      setError(
        "Available copies must be a whole number between 0 and total copies."
      );
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("title", title);
      data.append(
        "description",
        description
      );
      data.append(
        "category",
        formData.category
      );
      data.append(
        "totalCopies",
        String(total)
      );
      data.append(
        "availableCopies",
        String(available)
      );

      /*
        The current backend Book model does not
        define an author field.

        The Author field remains in the UI to
        preserve your existing design, but it is
        intentionally not sent until the backend
        model/API is extended to support it.
      */

      if (cover) {
        data.append("coverImage", cover);
      }

      const response = await API.put(
        `/books/${id}`,
        data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to update book"
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/admin/books");
      }, 1200);
    } catch (err) {
      console.error(
        "Failed to update book:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update book"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-5 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

            <p className="mt-3 text-sm text-slate-500">
              Loading book details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-5 py-8 sm:px-6 lg:px-8">
          <section className="w-full max-w-md border border-red-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#102022]">
              Unable to load book
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <Link
              to="/admin/books"
              className="mt-5 inline-flex items-center gap-2 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back to Books
            </Link>
          </section>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-5 py-12">
          <section className="w-full border border-emerald-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-emerald-50 text-emerald-600">
              <Save size={23} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#102022]">
              Book updated successfully
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The book information has been
              updated successfully.
            </p>

            <p className="mt-5 text-xs text-slate-400">
              Returning to Books...
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f7f7f4]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-7">
          <Link
            to="/admin/books"
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-cyan-700"
          >
            <ArrowLeft size={15} />
            Back to Books
          </Link>

          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            <BookOpen size={14} />
            Library Inventory
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102022] sm:text-4xl">
            Edit Book
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the information and inventory
            details for this book.
          </p>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_330px]">
            {/* Information */}
            <section className="border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-cyan-50 text-cyan-700">
                    <FileText size={17} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#102022]">
                      Book Information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Update the details of the
                      book.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <FormField
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Book title"
                />

                <FormField
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                />

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-xs font-bold text-slate-600"
                  >
                    Category
                    <span className="ml-1 text-cyan-700">
                      *
                    </span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-cyan-700"
                  >
                    <option value="">
                      Select a category
                    </option>

                    {categories.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-xs font-bold text-slate-600"
                  >
                    Description
                    <span className="ml-1 text-cyan-700">
                      *
                    </span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    rows={7}
                    placeholder="Book description..."
                    className="w-full resize-y border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-700"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField
                    label="Total Copies"
                    name="totalCopies"
                    value={
                      formData.totalCopies
                    }
                    onChange={handleChange}
                    icon={Layers3}
                  />

                  <NumberField
                    label="Available Copies"
                    name="availableCopies"
                    value={
                      formData.availableCopies
                    }
                    onChange={handleChange}
                    icon={Hash}
                  />
                </div>

                <div className="border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="text-xs leading-5 text-amber-800">
                    If this book currently has
                    borrowed copies, keep the
                    inventory numbers consistent
                    with the active borrowing
                    records.
                  </p>
                </div>
              </div>
            </section>

            {/* Cover */}
            <section className="h-fit border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-cyan-50 text-cyan-700">
                    <ImagePlus size={17} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#102022]">
                      Book Cover
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Replace the current cover if
                      needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {preview ? (
                  <div className="relative">
                    <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                      <img
                        src={preview}
                        alt={`${formData.title} cover`}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removeCover}
                      disabled={submitting}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-white text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Remove cover"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={submitting}
                    className="flex aspect-[3/4] w-full flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50/60 px-5 text-center transition hover:border-cyan-500 hover:bg-cyan-50/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center bg-white text-slate-400 shadow-sm">
                      <Upload size={20} />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      Upload new cover
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      PNG, JPG or WEBP
                      <br />
                      Maximum 5MB
                    </p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    handleCoverChange
                  }
                  className="hidden"
                />

                {cover && (
                  <p className="mt-3 truncate text-xs text-slate-400">
                    New image: {cover.name}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-700">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/books"
              className="inline-flex items-center justify-center border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-[#102022] px-5 py-3 text-xs font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save size={15} />
              )}

              {submitting
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-slate-600"
      >
        {label}

        <span className="ml-1 text-cyan-700">
          *
        </span>
      </label>

      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-700"
      />
    </div>
  );
}

function NumberField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-slate-600"
      >
        {label}

        <span className="ml-1 text-cyan-700">
          *
        </span>
      </label>

      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={name}
          name={name}
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={onChange}
          className="h-11 w-full border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-cyan-700"
        />
      </div>
    </div>
  );
}

export default EditBook;