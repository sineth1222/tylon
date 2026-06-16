'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { ProductVariant, SizeStock } from '@/types'
import { cn } from '@/lib/utils'
import ImageUploader from './ImageUploader'

// Size presets per category/gender
const SIZE_PRESETS: Record<string, string[]> = {
  clothing_adult: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  clothing_kids:  ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y', '14Y'],
  shoes_womens:   ['35', '36', '37', '38', '39', '40', '41'],
  shoes_mens:     ['39', '40', '41', '42', '43', '44', '45', '46'],
  shoes_kids:     ['28', '30', '32', '34', '36'],
  one_size:       ['One Size'],
  waist:          ['28', '30', '32', '34', '36', '38', '40'],
}

// Common colour palette for quick-add
const COLOR_PALETTE = [
  { name: 'Black',     hex: '#1A1A1A' },
  { name: 'White',     hex: '#FAFAFA' },
  { name: 'Cream',     hex: '#F5F0E8' },
  { name: 'Navy',      hex: '#1B2A4A' },
  { name: 'Camel',     hex: '#C4955A' },
  { name: 'Sage',      hex: '#9BB394' },
  { name: 'Blush',     hex: '#E8C4B0' },
  { name: 'Charcoal',  hex: '#4A4A4A' },
  { name: 'Olive',     hex: '#6B7A5A' },
  { name: 'Terracotta',hex: '#B8784A' },
  { name: 'Sky Blue',  hex: '#A8C4D8' },
  { name: 'Burgundy',  hex: '#6B2D3E' },
]

interface VariantBuilderProps {
  variants: ProductVariant[]
  onChange: (variants: ProductVariant[]) => void
  gender?: string
  category?: string
}

function defaultSizes(gender: string, category: string): SizeStock[] {
  let preset: string[] = []
  if (category === 'accessories') preset = SIZE_PRESETS.one_size
  else if (gender === 'kids') preset = SIZE_PRESETS.clothing_kids
  else preset = SIZE_PRESETS.clothing_adult
  return preset.map(s => ({ size: s, stock: 10 }))
}

export default function VariantBuilder({ variants, onChange, gender = 'unisex', category = 'basics' }: VariantBuilderProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(variants.length > 0 ? 0 : null)
  const [customSize, setCustomSize] = useState('')
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#1A1A1A')
  const [activePreset, setActivePreset] = useState('clothing_adult')

  const addVariant = (colorName: string, colorHex: string) => {
    const exists = variants.find(v => v.colorName.toLowerCase() === colorName.toLowerCase())
    if (exists) return
    const newVariant: ProductVariant = {
      colorName,
      colorHex,
      images: [],
      sizes: defaultSizes(gender, category),
    }
    const next = [...variants, newVariant]
    onChange(next)
    setOpenIdx(next.length - 1)
    setNewColorName('')
  }

  const removeVariant = (idx: number) => {
    onChange(variants.filter((_, i) => i !== idx))
    setOpenIdx(null)
  }

  const updateVariant = (idx: number, patch: Partial<ProductVariant>) => {
    onChange(variants.map((v, i) => i === idx ? { ...v, ...patch } : v))
  }

  const updateSizeStock = (variantIdx: number, sizeIdx: number, stock: number) => {
    const sizes = variants[variantIdx].sizes.map((s, i) =>
      i === sizeIdx ? { ...s, stock: Math.max(0, stock) } : s
    )
    updateVariant(variantIdx, { sizes })
  }

  const toggleSize = (variantIdx: number, size: string) => {
    const v = variants[variantIdx]
    const exists = v.sizes.find(s => s.size === size)
    const sizes = exists
      ? v.sizes.filter(s => s.size !== size)
      : [...v.sizes, { size, stock: 10 }]
    updateVariant(variantIdx, { sizes })
  }

  const addCustomSize = (variantIdx: number) => {
    if (!customSize.trim()) return
    const v = variants[variantIdx]
    if (!v.sizes.find(s => s.size === customSize.trim())) {
      updateVariant(variantIdx, { sizes: [...v.sizes, { size: customSize.trim(), stock: 10 }] })
    }
    setCustomSize('')
  }

  const duplicateSizesFrom = (fromIdx: number, toIdx: number) => {
    const fromSizes = variants[fromIdx].sizes.map(s => ({ ...s }))
    updateVariant(toIdx, { sizes: fromSizes })
  }

  return (
    <div className="space-y-3">
      {/* Existing variants */}
      {variants.map((variant, idx) => (
        <div key={idx} className={cn(
          'border rounded-2xl overflow-hidden transition-all',
          openIdx === idx ? 'border-stone-600 shadow-sm' : 'border-cream-300'
        )}>
          {/* Header */}
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
              openIdx === idx ? 'bg-stone-700' : 'bg-cream-100 hover:bg-cream-200'
            )}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-white/30 shrink-0"
              style={{ backgroundColor: variant.colorHex }}
            />
            <span className={cn('font-medium text-sm flex-1', openIdx === idx ? 'text-cream-100' : 'text-stone-800')}>
              {variant.colorName}
            </span>

            {/* Quick stats */}
            <div className={cn('flex items-center gap-3 text-xs', openIdx === idx ? 'text-cream-300' : 'text-stone-400')}>
              <span>{variant.images.length} img{variant.images.length !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>{variant.sizes.length} size{variant.sizes.length !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>Stock: {variant.sizes.reduce((t, s) => t + s.stock, 0)}</span>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeVariant(idx) }}
              className={cn(
                'w-6 h-6 rounded-lg flex items-center justify-center transition-colors',
                openIdx === idx
                  ? 'hover:bg-red-500/30 text-cream-300 hover:text-red-200'
                  : 'hover:bg-red-100 text-stone-400 hover:text-red-500'
              )}
            >
              <Trash2 size={13} />
            </button>

            {openIdx === idx
              ? <ChevronUp size={15} className="text-cream-300 shrink-0" />
              : <ChevronDown size={15} className="text-stone-400 shrink-0" />
            }
          </div>

          {/* Body */}
          {openIdx === idx && (
            <div className="p-5 space-y-6 bg-cream-50">
              {/* Color info */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={variant.colorHex}
                  onChange={e => updateVariant(idx, { colorHex: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-cream-300 cursor-pointer p-0.5"
                />
                <input
                  value={variant.colorName}
                  onChange={e => updateVariant(idx, { colorName: e.target.value })}
                  placeholder="Colour name"
                  className="input-zora flex-1"
                />
              </div>

              {/* Images for this colour */}
              <ImageUploader
                label={`Images — ${variant.colorName}`}
                images={variant.images}
                onChange={imgs => updateVariant(idx, { images: imgs })}
                maxImages={6}
              />

              {/* Sizes + stock */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500">
                    Sizes & Stock
                  </label>
                  {/* Copy sizes from another variant */}
                  {variants.length > 1 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-stone-400">Copy from:</span>
                      {variants.map((v, i) => i !== idx && (
                        <button
                          key={i}
                          type="button"
                          onClick={() => duplicateSizesFrom(i, idx)}
                          title={`Copy sizes from ${v.colorName}`}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg bg-cream-200 hover:bg-cream-300 text-stone-600 transition-colors"
                        >
                          <Copy size={10} />
                          {v.colorName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size preset picker */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Object.keys(SIZE_PRESETS).map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setActivePreset(preset)
                        // Add preset sizes not already present
                        const current = new Set(variant.sizes.map(s => s.size))
                        const toAdd = SIZE_PRESETS[preset].filter(s => !current.has(s))
                        if (toAdd.length) {
                          updateVariant(idx, {
                            sizes: [...variant.sizes, ...toAdd.map(s => ({ size: s, stock: 10 }))]
                          })
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-cream-200 hover:bg-stone-700 hover:text-cream-100 text-stone-600 transition-all"
                    >
                      + {preset.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>

                {/* Size rows */}
                <div className="space-y-2">
                  {variant.sizes.length === 0 && (
                    <p className="text-xs text-stone-400 italic text-center py-2">
                      No sizes added. Use presets above or add custom.
                    </p>
                  )}
                  {variant.sizes.map((ss, si) => (
                    <div key={ss.size + si} className="flex items-center gap-3">
                      {/* Size label */}
                      <div className="w-16 h-9 rounded-xl bg-cream-200 flex items-center justify-center text-xs font-bold text-stone-700 shrink-0">
                        {ss.size}
                      </div>

                      {/* Stock input */}
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          type="button"
                          onClick={() => updateSizeStock(idx, si, ss.stock - 1)}
                          className="w-7 h-7 rounded-lg bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 font-bold text-sm transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={ss.stock}
                          onChange={e => updateSizeStock(idx, si, parseInt(e.target.value) || 0)}
                          className="w-16 text-center text-sm font-semibold bg-cream-100 border border-cream-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-stone-600"
                        />
                        <button
                          type="button"
                          onClick={() => updateSizeStock(idx, si, ss.stock + 1)}
                          className="w-7 h-7 rounded-lg bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 font-bold text-sm transition-colors"
                        >
                          +
                        </button>
                        <span className="text-xs text-stone-400">units</span>
                        {ss.stock === 0 && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>

                      {/* Remove size */}
                      <button
                        type="button"
                        onClick={() => updateVariant(idx, { sizes: variant.sizes.filter((_, i) => i !== si) })}
                        className="w-7 h-7 rounded-lg hover:bg-red-100 text-stone-300 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom size input */}
                <div className="flex gap-2 mt-3">
                  <input
                    value={customSize}
                    onChange={e => setCustomSize(e.target.value)}
                    placeholder="Custom size (e.g. 32, XXS, 6.5)"
                    className="input-zora flex-1 text-sm"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize(idx))}
                  />
                  <button
                    type="button"
                    onClick={() => addCustomSize(idx)}
                    className="px-3 py-2 bg-stone-700 text-cream-100 rounded-xl text-xs font-medium hover:bg-stone-600 transition-colors whitespace-nowrap"
                  >
                    + Add Size
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new variant */}
      <div className="border-2 border-dashed border-cream-300 rounded-2xl p-4 space-y-4">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500">
          Add Colour Variant
        </p>

        {/* Quick palette */}
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.filter(c => !variants.find(v => v.colorName === c.name)).map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => addVariant(c.name, c.hex)}
              title={c.name}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-cream-300 hover:border-stone-500 bg-cream-50 hover:bg-cream-200 transition-all text-xs text-stone-600"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
            </button>
          ))}
        </div>

        {/* Custom colour */}
        <div className="flex gap-2">
          <input
            type="color"
            value={newColorHex}
            onChange={e => setNewColorHex(e.target.value)}
            className="w-11 h-11 rounded-xl border border-cream-300 cursor-pointer p-0.5 shrink-0"
          />
          <input
            value={newColorName}
            onChange={e => setNewColorName(e.target.value)}
            placeholder="Custom colour name (e.g. Dusty Rose)"
            className="input-zora flex-1"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), newColorName.trim() && addVariant(newColorName.trim(), newColorHex))}
          />
          <button
            type="button"
            onClick={() => newColorName.trim() && addVariant(newColorName.trim(), newColorHex)}
            disabled={!newColorName.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-700 text-cream-100 rounded-xl text-xs font-medium hover:bg-stone-600 transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {variants.length === 0 && (
        <p className="text-xs text-center text-stone-400 py-1">
          Add at least one colour variant with images and sizes.
        </p>
      )}
    </div>
  )
}
