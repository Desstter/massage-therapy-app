import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  debounceMs = 200,
}: SearchBarProps) {
  const [local, setLocal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocal(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function handleChange(v: string) {
    setLocal(v)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(v), debounceMs)
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-secondary border border-bg-border rounded-lg py-2 pl-9 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-colors"
      />
      {local && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
