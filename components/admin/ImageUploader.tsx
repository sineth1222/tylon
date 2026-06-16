'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  label?: string
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 6,
  label = 'Images',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', '/loom/products')

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()

    if (!res.ok || !data.url) {
      toast.error(data.error || 'Upload failed')
      return null
    }
    return data.url
  }

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files)
    const remaining = maxImages - images.length
    if (remaining <= 0) {
      toast.error(`Max ${maxImages} images allowed`)
      return
    }
    const toUpload = arr.slice(0, remaining)

    setUploading(true)
    const results: string[] = []
    for (const f of toUpload) {
      const url = await uploadFile(f)
      if (url) results.push(url)
    }
    setUploading(false)

    if (results.length) {
      onChange([...images, ...results])
      toast.success(`${results.length} image${results.length > 1 ? 's' : ''} uploaded`)
    }
  }, [images, maxImages, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  // Reorder by drag
  const handleItemDragStart = (idx: number) => setDragIndex(idx)
  const handleItemDragEnter = (idx: number) => setDropIndex(idx)
  const handleItemDragEnd = () => {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      const next = [...images]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(dropIndex, 0, moved)
      onChange(next)
    }
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500">
          {label}
        </label>
        <span className="text-[11px] text-stone-400">
          {images.length}/{maxImages} · drag to reorder
        </span>
      </div>

      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all mb-3',
            dragOver
              ? 'border-stone-600 bg-stone-50'
              : 'border-cream-300 hover:border-stone-400 hover:bg-cream-100 bg-cream-50'
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-stone-400 animate-spin" />
              <p className="text-xs text-stone-400">Uploading to ImageKit…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center">
                <Upload size={18} className="text-stone-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-stone-700">
                  {dragOver ? 'Drop to upload' : 'Click or drag images here'}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  JPG, PNG, WebP · max 8 MB each · up to {maxImages - images.length} more
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              draggable
              onDragStart={() => handleItemDragStart(idx)}
              onDragEnter={() => handleItemDragEnter(idx)}
              onDragEnd={handleItemDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                'relative group aspect-[3/4] rounded-xl overflow-hidden bg-cream-200 border-2 transition-all cursor-grab active:cursor-grabbing',
                idx === 0 ? 'border-stone-700' : 'border-transparent',
                dropIndex === idx && dragIndex !== idx ? 'border-sage-400 scale-95' : ''
              )}
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 25vw"
              />

              {/* Primary badge */}
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-stone-700 text-cream-100 text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded">
                  PRIMARY
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-1.5 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} className="text-cream-100 drop-shadow" />
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={10} />
              </button>

              {/* Image number */}
              <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[9px] font-bold rounded px-1">
                {idx + 1}
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {images.length < maxImages && !uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-[3/4] rounded-xl border-2 border-dashed border-cream-300 hover:border-stone-400 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-stone-600 transition-all bg-cream-50 hover:bg-cream-100"
            >
              <ImageIcon size={18} />
              <span className="text-[10px] font-medium">Add</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
