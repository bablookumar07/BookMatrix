import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

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

function AddBook() {
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be smaller than 5MB.");
      return;
    }

    setCover(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeCover = () => {
    setCover(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const total = Number(formData.totalCopies);
    const available = Number(formData.availableCopies);

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.totalCopies ||
      !formData.availableCopies
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (total < 1) {
      setError("Total copies must be at least 1.");
      return;
    }

    if (available < 0 || available > total) {
      setError(
        "Available copies cannot be greater than total copies.",
      );
      return;
    }

    setSuccess(true);

    // Backend API will be connected during integration.
    setTimeout(() => {
      navigate("/admin/books");
    }, 1200);
  };

  if (success) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-5 py-12">
          <section className="w-full border border-emerald-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-emerald-50 text-emerald-600">
              <BookOpen size={24} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#102022]">
              Book added successfully
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The book has been added to the library collection.
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

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                <BookOpen size={14} />
                Library Inventory
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#102022] sm:text-4xl">
                Add New Book
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Add a new title and its available copies to the library.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_330px]">

            {/* Main information */}
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
                      Enter the basic details of the book.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {/* Title */}
                <FormField
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. The Great Gatsby"
                  required
                />

                {/* Author */}
                <FormField
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g. F. Scott Fitzgerald"
                  required
                />

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-xs font-bold text-slate-600"
                  >
                    Category
                    <span className="ml-1 text-cyan-700">*</span>
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

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-xs font-bold text-slate-600"
                  >
                    Description
                    <span className="ml-1 text-cyan-700">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Write a short description of the book..."
                    className="w-full resize-y border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-700"
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    Give students enough information to understand what
                    the book is about.
                  </p>
                </div>

                {/* Copies */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <NumberField
                    label="Total Copies"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    icon={Layers3}
                  />

                  <NumberField
                    label="Available Copies"
                    name="availableCopies"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    icon={Hash}
                  />

                </div>

                <div className="border border-cyan-100 bg-cyan-50 px-4 py-3">
                  <p className="text-xs leading-5 text-cyan-800">
                    <strong>Copies:</strong> Available copies should never
                    exceed the total number of copies. When students borrow
                    or return a book, this value will be updated automatically.
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
                      Upload a cover image.
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
                        alt="Book cover preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-white text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove cover"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-[3/4] w-full flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50/60 px-5 text-center transition hover:border-cyan-500 hover:bg-cyan-50/30"
                  >
                    <div className="flex h-12 w-12 items-center justify-center bg-white text-slate-400 shadow-sm">
                      <Upload size={20} />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      Upload cover
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
                  onChange={handleCoverChange}
                  className="hidden"
                />

                {cover && (
                  <p className="mt-3 truncate text-xs text-slate-400">
                    {cover.name}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-700">
              {error}
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
              className="inline-flex items-center justify-center gap-2 bg-[#102022] px-5 py-3 text-xs font-bold text-white transition hover:bg-cyan-800"
            >
              <Save size={15} />
              Add Book
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
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-slate-600"
      >
        {label}

        {required && (
          <span className="ml-1 text-cyan-700">*</span>
        )}
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
  placeholder,
  icon: Icon,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-slate-600"
      >
        {label}
        <span className="ml-1 text-cyan-700">*</span>
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
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-11 w-full border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-700"
        />
      </div>
    </div>
  );
}

export default AddBook;