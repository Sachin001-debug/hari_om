'use strict';
'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ImagePlus, Camera, Info, MapPin, Sparkles, UploadCloud, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AREAS_BY_CITY, CITIES } from '@/data/locations';
import { formatLandArea, formatPrice } from '@/lib/formatPrice';
import { createProperty } from '@/lib/api';

const initialForm = {
  title: '',
  type: 'house',
  price: '',
  priceNegotiable: false,
  city: 'Butwal',
  area: '',
  keywords: '',
  description: '',
  landAreaValue: '',
  landAreaUnit: 'Dhur',
  bedrooms: '',
  bathrooms: '',
  roadWidth: '',
  facing: '',
  legalStatus: 'Freehold (Lalpurja verified)',
  waterSupply: 'Deep boring & municipal line',
  electricity: 'NEA 3-phase connection',
  parking: 'Covered garage (2 cars)',
  construction: 'Earthquake-resistant RCC frame',
  featured: false,
  createdAt: new Date().toISOString().slice(0, 10),
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const inputClass =
  'mt-1.5 min-h-10 w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-text outline-none transition placeholder:text-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15';
const checkboxClass =
  'h-4 w-4 rounded border-admin-border text-admin-primary focus:ring-admin-primary';

function Field({ label, htmlFor, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-admin-text">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[11px] leading-relaxed text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] leading-relaxed text-admin-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AddPropertyForm() {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const fileInputRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);

  const availableAreas = AREAS_BY_CITY[form.city.toLowerCase()] || [];
  const keywords = useMemo(
    () => form.keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
    [form.keywords],
  );
  const slug = makeSlug([form.title, form.area, form.city].filter(Boolean).join(' '));

  // Clean up object URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, []);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setServerError('');
  }

  function validateSelectedFile(file) {
    if (!file) {
      return 'Please select a property image.';
    }

    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());

    if (!hasValidExt || !hasValidMime) {
      return 'Unsupported format. Only JPEG, JPG, and PNG images are allowed.';
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum limit of 5 MB.`;
    }

    return '';
  }

  function applyImageFile(file) {
    setImageError('');
    setServerError('');

    const validationMsg = validateSelectedFile(file);
    if (validationMsg) {
      setImageError(validationMsg);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreviewUrl(objectUrl);
    setCameraError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    applyImageFile(file);
  }

  function handleRemoveImage() {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl('');
    setImageError('');
    setCameraError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function startCamera() {
    setCameraError('');
    setServerError('');

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setIsCameraOpen(true);

      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play().catch(() => {});
        }
      });
    } catch (err) {
      setCameraError(
        err?.name === 'NotAllowedError' || err?.name === 'SecurityError'
          ? 'Camera permission was denied. Please allow camera access in your browser, or use file selection instead.'
          : 'Unable to access the camera on this device. Please try again or use file selection instead.',
      );
    }
  }

  function stopCamera() {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraOpen(false);

    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
  }

  function handleCameraCapture() {
    const video = videoRef.current;
    const stream = cameraStreamRef.current;

    if (!video || !stream || !video.videoWidth) {
      setCameraError('Camera preview is not ready yet. Please try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Unable to capture the photo on this device.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        stopCamera();

        if (!blob) {
          setCameraError('Failed to capture the photo. Please try again.');
          return;
        }

        const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
        applyImageFile(file);
      },
      blob.type || 'image/jpeg',
      0.92,
    );
  }

  function validateForm() {
    const errors = {};

    if (!form.title.trim() || form.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long.';
    }

    if (!form.price || Number(form.price) <= 0) {
      errors.price = 'Please enter a valid asking price greater than 0.';
    }

    if (!form.city.trim()) {
      errors.city = 'Please select a city.';
    }

    if (!form.area.trim()) {
      errors.area = 'Please enter an area or neighbourhood.';
    }

    if (!form.landAreaValue || Number(form.landAreaValue) <= 0) {
      errors.landAreaValue = 'Please enter a valid land area value.';
    }

    if (form.type === 'house') {
      if (!form.bedrooms || Number(form.bedrooms) < 1) {
        errors.bedrooms = 'Bedrooms is required for houses and must be at least 1.';
      }
      if (!form.bathrooms || Number(form.bathrooms) < 1) {
        errors.bathrooms = 'Bathrooms is required for houses and must be at least 1.';
      }
    }

    if (!form.description.trim() || form.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long.';
    }

    if (!imageFile) {
      setImageError('Please select a property image to upload.');
      errors.image = 'Property image is required.';
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccessInfo(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('type', form.type);
      formData.append('price', form.price);
      formData.append('priceNegotiable', form.priceNegotiable ? 'true' : 'false');
      formData.append('city', form.city.trim());
      formData.append('area', form.area.trim());
      formData.append('keywords', form.keywords.trim());
      formData.append('description', form.description.trim());
      formData.append('landAreaValue', form.landAreaValue);
      formData.append('landAreaUnit', form.landAreaUnit);

      if (form.type === 'house') {
        formData.append('bedrooms', form.bedrooms);
        formData.append('bathrooms', form.bathrooms);
        if (form.parking) formData.append('parking', form.parking.trim());
        if (form.construction) formData.append('construction', form.construction.trim());
      }

      if (form.roadWidth) formData.append('roadWidth', form.roadWidth.trim());
      if (form.facing) formData.append('facing', form.facing);
      if (form.legalStatus) formData.append('legalStatus', form.legalStatus.trim());
      if (form.waterSupply) formData.append('waterSupply', form.waterSupply.trim());
      if (form.electricity) formData.append('electricity', form.electricity.trim());
      formData.append('featured', form.featured ? 'true' : 'false');
      formData.append('status', 'PUBLISHED');

      if (form.createdAt) {
        formData.append('createdAt', form.createdAt);
      }

      formData.append('image', imageFile);

      const response = await createProperty(formData);

      if (response?.success && response?.property) {
        setSuccessInfo({
          title: response.property.title,
          slug: response.property.slug,
          message: 'Property listing created and published successfully.',
        });

        // Reset form to initial state
        setForm(initialForm);
        handleRemoveImage();
      } else {
        setServerError('Property could not be saved. Please try again.');
      }
    } catch (err) {
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const backendErrors = {};
        err.data.errors.forEach((e) => {
          backendErrors[e.field] = e.message;
        });
        setFieldErrors(backendErrors);
        setServerError('Please review the errors highlighted below.');
      } else {
        setServerError(err.message || 'Failed to submit property to backend server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <header className="border-b border-admin-border pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
          Add Property
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-admin-muted">
          Enter verified property specifications. The property will be published directly to the public website.
        </p>
      </header>

      {/* Global Success Banner */}
      {successInfo && (
        <div className="flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">{successInfo.message}</p>
              <p className="mt-0.5 text-xs text-emerald-700">
                &ldquo;{successInfo.title}&rdquo; is now live in the database.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Link
                  href={`/listings/${successInfo.slug}`}
                  target="_blank"
                  className="inline-flex items-center text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                >
                  View live listing on website &rarr;
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessInfo(null)}
            className="text-emerald-700 hover:text-emerald-900"
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="text-xs leading-relaxed text-red-800">
            <p className="font-semibold">{serverError}</p>
          </div>
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Listing Details */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-admin-text">Listing details</h2>
              <p className="mt-1 text-xs text-admin-muted">The title and description appear on the public listing.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Property title" htmlFor="title" error={fieldErrors.title} className="sm:col-span-2">
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="e.g. Modern family home in Sukhanagar"
                  required
                  maxLength={120}
                />
              </Field>
              <Field label="Property type" htmlFor="type" error={fieldErrors.type}>
                <select id="type" name="type" value={form.type} onChange={updateField} className={inputClass}>
                  <option value="house">House / Villa</option>
                  <option value="plot">Land / Plot</option>
                </select>
              </Field>
              <Field label="Asking price (NPR)" htmlFor="price" error={fieldErrors.price}>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="e.g. 18500000"
                  required
                />
              </Field>
              <label className="flex min-h-10 items-center gap-2.5 rounded-lg border border-admin-border px-3 text-xs text-admin-text">
                <input
                  type="checkbox"
                  name="priceNegotiable"
                  checked={form.priceNegotiable}
                  onChange={updateField}
                  className={checkboxClass}
                />
                Price is negotiable
              </label>
              <label className="flex min-h-10 items-center gap-2.5 rounded-lg border border-admin-border px-3 text-xs text-admin-text">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={updateField}
                  className={checkboxClass}
                />
                Mark as featured listing
              </label>
            </div>
          </section>

          {/* 2. Location */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4 text-admin-primary" />
              <h2 className="text-sm font-semibold text-admin-text">Location</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" htmlFor="city" error={fieldErrors.city}>
                <select id="city" name="city" value={form.city} onChange={updateField} className={inputClass} required>
                  {CITIES.filter((city) => city.id !== 'all').map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Area / neighbourhood"
                htmlFor="area"
                error={fieldErrors.area}
                hint="Choose a suggested area or enter a different one."
              >
                <input
                  id="area"
                  name="area"
                  value={form.area}
                  onChange={updateField}
                  list="property-areas"
                  className={inputClass}
                  placeholder="e.g. Manigram"
                  required
                />
                <datalist id="property-areas">
                  {availableAreas.map((area) => (
                    <option key={area} value={area} />
                  ))}
                </datalist>
              </Field>
            </div>
          </section>

          {/* 3. Specifications */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-admin-text">Property specifications</h2>
              <p className="mt-1 text-xs text-admin-muted">These details appear in the listing summary and property details.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Land area" htmlFor="landAreaValue" error={fieldErrors.landAreaValue}>
                <div className="flex gap-2">
                  <input
                    id="landAreaValue"
                    name="landAreaValue"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.landAreaValue}
                    onChange={updateField}
                    className={inputClass}
                    placeholder="e.g. 10"
                    required
                  />
                  <select
                    aria-label="Land area unit"
                    name="landAreaUnit"
                    value={form.landAreaUnit}
                    onChange={updateField}
                    className={`${inputClass} max-w-32`}
                  >
                    {['Dhur', 'Katha', 'Bigha', 'Ropani', 'Aana', 'Sq. ft.'].map((unit) => (
                      <option key={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </Field>
              {form.type === 'house' && (
                <>
                  <Field label="Bedrooms" htmlFor="bedrooms" error={fieldErrors.bedrooms}>
                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="1"
                      step="1"
                      value={form.bedrooms}
                      onChange={updateField}
                      className={inputClass}
                      placeholder="e.g. 4"
                      required
                    />
                  </Field>
                  <Field label="Bathrooms" htmlFor="bathrooms" error={fieldErrors.bathrooms}>
                    <input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="1"
                      step="1"
                      value={form.bathrooms}
                      onChange={updateField}
                      className={inputClass}
                      placeholder="e.g. 3"
                      required
                    />
                  </Field>
                </>
              )}
              <Field label="Road access / width" htmlFor="roadWidth" error={fieldErrors.roadWidth}>
                <input
                  id="roadWidth"
                  name="roadWidth"
                  value={form.roadWidth}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="e.g. 20 ft pitched"
                />
              </Field>
              <Field label="Facing direction" htmlFor="facing" error={fieldErrors.facing}>
                <select id="facing" name="facing" value={form.facing} onChange={updateField} className={inputClass}>
                  <option value="">Select direction</option>
                  {['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'].map(
                    (direction) => (
                      <option key={direction}>{direction}</option>
                    ),
                  )}
                </select>
              </Field>
            </div>
          </section>

          {/* 4. Additional details */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-admin-text">Additional details</h2>
              <p className="mt-1 text-xs text-admin-muted">Verified legal and utility specifications on the property page.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Legal status" htmlFor="legalStatus">
                <input id="legalStatus" name="legalStatus" value={form.legalStatus} onChange={updateField} className={inputClass} />
              </Field>
              <Field label="Water supply" htmlFor="waterSupply">
                <input id="waterSupply" name="waterSupply" value={form.waterSupply} onChange={updateField} className={inputClass} />
              </Field>
              <Field label="Electricity" htmlFor="electricity">
                <input id="electricity" name="electricity" value={form.electricity} onChange={updateField} className={inputClass} />
              </Field>
              {form.type === 'house' && (
                <>
                  <Field label="Parking" htmlFor="parking">
                    <input id="parking" name="parking" value={form.parking} onChange={updateField} className={inputClass} />
                  </Field>
                  <Field label="Construction" htmlFor="construction">
                    <input id="construction" name="construction" value={form.construction} onChange={updateField} className={inputClass} />
                  </Field>
                </>
              )}
            </div>
          </section>

          {/* 5. Description & Highlights */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-admin-text">Description & highlights</h2>
              <p className="mt-1 text-xs text-admin-muted">Highlights are shown as tags on the property details page.</p>
            </div>
            <div className="space-y-4">
              <Field label="Property description" htmlFor="description" error={fieldErrors.description}>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  className={`${inputClass} min-h-28 resize-y`}
                  placeholder="Describe the property, condition, amenities, and nearby conveniences."
                  required
                  maxLength={2000}
                />
              </Field>
              <Field
                label="Highlights / keywords"
                htmlFor="keywords"
                hint="Separate each highlight with a comma, for example: Road facing, Near school, Parking space."
              >
                <input
                  id="keywords"
                  name="keywords"
                  value={form.keywords}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="Road facing, Near school, Parking space"
                />
              </Field>
            </div>
          </section>

          {/* 6. Secure Property Image Upload */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImagePlus aria-hidden="true" className="h-4 w-4 text-admin-primary" />
                <h2 className="text-sm font-semibold text-admin-text">Property image</h2>
              </div>
              <span className="text-[11px] text-admin-muted">JPEG, JPG, or PNG (Max 5 MB) &middot; or capture instantly with camera</span>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                id="property-image-input"
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />

              {!imageFile ? (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors hover:border-admin-primary/60 hover:bg-admin-primary-soft/10 ${
                      imageError ? 'border-red-300 bg-red-50/30' : 'border-admin-border bg-white'
                    }`}
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-admin-primary-soft text-admin-primary">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-admin-text">
                      Click to select property image from your device
                    </p>
                    <p className="mt-1 text-[11px] text-admin-muted">
                      Supports high-resolution JPEG, JPG, and PNG files up to 5 MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-admin-border bg-white px-3 text-xs font-semibold text-admin-text transition hover:border-admin-primary/60 hover:text-admin-primary"
                  >
                    <Camera aria-hidden="true" className="h-4 w-4" />
                    Take photo with camera
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-admin-border bg-white p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center border border-slate-200"
                      style={{ backgroundImage: `url("${imagePreviewUrl}")` }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-admin-text">{imageFile.name}</p>
                      <p className="text-[11px] text-admin-muted">
                        {(imageFile.size / (1024 * 1024)).toFixed(2)} MB &middot; Ready to upload
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-medium text-admin-text hover:bg-gray-50"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-lg p-1.5 text-admin-muted hover:bg-red-50 hover:text-red-600"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {isCameraOpen && (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl border border-admin-border bg-black">
                    <video ref={videoRef} autoPlay playsInline muted className="h-72 w-full" />
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 bg-black/60 p-3">
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-4 text-xs font-semibold text-white transition hover:bg-white/20"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCameraCapture}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-admin-primary px-4 text-xs font-semibold text-white transition hover:bg-admin-primary-hover"
                      >
                        <Camera aria-hidden="true" className="h-4 w-4" />
                        Capture photo
                      </button>
                    </div>
                  </div>
                  {cameraError && <p className="text-[11px] font-medium text-red-600">{cameraError}</p>}
                </div>
              )}

              {imageError && (
                <p className="text-[11px] font-medium text-red-600">{imageError}</p>
              )}
            </div>
          </section>

          {/* 7. Listing metadata */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-admin-text">Listing metadata</h2>
              <p className="mt-1 text-xs text-admin-muted">The public page uses the listing date and a URL generated from the title and location.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Listing date" htmlFor="createdAt">
                <input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  value={form.createdAt}
                  onChange={updateField}
                  className={inputClass}
                  required
                />
              </Field>
              <Field
                label="Public URL slug"
                htmlFor="slug"
                hint="Generated automatically upon saving to the database."
              >
                <input id="slug" value={slug} readOnly className={`${inputClass} bg-gray-50 text-admin-muted`} />
              </Field>
            </div>
          </section>

          {/* Action Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-blue-900">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              Submitting saves the property securely to the database and uploads the image.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-admin-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-admin-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving property...</span>
                </>
              ) : (
                <span>Publish property</span>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <aside className="space-y-3 xl:sticky xl:top-24">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-admin-primary" />
            <h2 className="text-sm font-semibold text-admin-text">Public listing preview</h2>
          </div>
          <article className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
            <div className="relative aspect-[16/10] bg-gray-100">
              {imagePreviewUrl ? (
                <div
                  role="img"
                  aria-label={form.title ? `Preview image for ${form.title}` : 'Property image preview'}
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${imagePreviewUrl.replaceAll('"', '%22')}")` }}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-admin-muted">
                  <ImagePlus aria-hidden="true" className="h-7 w-7" />
                  <span className="text-xs">Property image preview</span>
                </div>
              )}
              <div className="absolute left-3 top-3 flex gap-1.5">
                <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {form.type === 'house' ? 'House' : 'Land'}
                </span>
                {form.featured && (
                  <span className="rounded bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2.5 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-base font-semibold text-slate-900">
                  {form.price ? formatPrice(Number(form.price)) : 'Asking price'}
                </p>
                {form.priceNegotiable && <span className="text-[10px] font-medium text-orange-600">Negotiable</span>}
              </div>
              <h3 className="text-sm font-medium text-slate-900">{form.title || 'Property title'}</h3>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                {form.area || 'Area'}, {form.city}
              </p>
              <p className="border-b border-slate-100 pb-3 text-xs text-slate-600">
                {form.landAreaValue
                  ? formatLandArea({ value: Number(form.landAreaValue), unit: form.landAreaUnit })
                  : 'Land area'}
                {form.type === 'house' && form.bedrooms && ` · ${form.bedrooms} BHK`}
                {form.type === 'house' && form.bathrooms && ` · ${form.bathrooms} bath`}
              </p>
              <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
                {form.description || 'Property description will appear here.'}
              </p>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {keywords.map((keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <p className="border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                {form.createdAt ? `Listed ${form.createdAt}` : 'Listing date'}
                {slug && <span className="mt-1 block truncate font-mono">/listings/{slug}</span>}
              </p>
            </div>
          </article>
          <dl className="rounded-xl border border-admin-border bg-white px-4 py-2">
            {[
              ['Facing', form.facing || 'East'],
              ['Road access', form.roadWidth || '20 ft pitched'],
              ['Legal status', form.legalStatus],
              ['Water supply', form.waterSupply],
              ['Electricity', form.electricity],
              ...(form.type === 'house'
                ? [
                    ['Parking', form.parking],
                    ['Construction', form.construction],
                  ]
                : []),
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
                <dt className="text-[11px] text-slate-500">{label}</dt>
                <dd className="text-right text-[11px] font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[11px] leading-relaxed text-admin-muted">
            The listing is instantly indexed and accessible by slug upon submission.
          </p>
        </aside>
      </div>
    </div>
  );
}
