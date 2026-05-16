import { useState, useCallback } from 'react'
import Folder from '../../ui/Folder'
import './styles.css'

const FOLDER_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2d6a4f', '#1b4332', '#6d4c41', '#37474f',
]

// const FOLDER_PHOTOS: Record<number, string[]> = {}

interface FolderData {
  label: string
  color: string
  photos: string[]
}

interface Origin {
  // as % of the section container, so arc stays correct regardless of viewport
  xPct: number
  yPct: number
  // absolute px for clip-path origin
  xPx: number
  yPx: number
}

type Phase = 'idle' | 'expanding' | 'open' | 'closing'

export default function Gallery() {
  const folders: FolderData[] = [
    'RedBull F1 @ RGU',
  ].map((label, i) => ({
    label,
    color: FOLDER_COLORS[i % FOLDER_COLORS.length],
    photos: [],
  }))

  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [origin, setOrigin] = useState<Origin>({ xPct: 0.5, yPct: 0.5, xPx: 0, yPx: 0 })
  const [phase, setPhase] = useState<Phase>('idle')

  const handleFolderDoubleClick = useCallback((idx: number, e: React.MouseEvent) => {
    const folderRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const section = document.getElementById("gallery")
    if (!section) return
    const sectionRect = section.getBoundingClientRect()

    const xPx = folderRect.left + folderRect.width / 2 - sectionRect.left
    const yPx = folderRect.top + folderRect.height / 2 - sectionRect.top

    setOrigin({ xPct: xPx / sectionRect.width, yPct: yPx / sectionRect.height, xPx, yPx })
    setOpenIdx(idx)
    setPhase('idle') // mount at idle (circle 0%) first

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('expanding') // now transition to 150%
        setTimeout(() => setPhase('open'), 500)
      })
    })
  }, [])

  const handleClose = useCallback(() => {
    setPhase('closing')
    setTimeout(() => {
      setOpenIdx(null)
      setPhase('idle')
    }, 400)
  }, [])

  const activeFolder = openIdx !== null ? folders[openIdx] : null

  // Arc: photos spread from top-right to bottom-left around center of section
  // Center is fixed at 50%/50% of the overlay, arc radius relative to section size
  // const ARC_START_DEG = 180   // left-center
  // const ARC_END_DEG = 0       // right-center (going through bottom, so use 360 or go negative)

  const photoItems = (activeFolder?.photos ?? []).map((src, i, arr) => {
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1)
    const deg = 180 - t * 180  // 180 → 0, sweeping through top
    // or for bottom arc:
    // const deg = 180 + t * 180  // 180 → 360, sweeping through bottom
    const rad = (deg * Math.PI) / 180
    const RX = 50
    const RY = 40
    return {
      src,
      x: 50 + RX * Math.cos(rad),
      y: 50 + RY * Math.sin(rad),
      rotation: deg - 90,
    }
  })

  return (
    <>
      <h2 className="section-heading">
        {openIdx !== null ? folders[openIdx].label : 'Moments Captured.'}
      </h2>

      {/* Folders grid */}
      <div
        className="folders-container"
        style={{
          opacity: openIdx !== null ? 0 : 1,
          pointerEvents: openIdx !== null ? 'none' : 'auto',
          transition: 'opacity 0.25s',
        }}
      >
        {folders.map((folder, idx) => (
          <div
            key={idx}
            className="folder-wrapper"
            onDoubleClick={(e) => handleFolderDoubleClick(idx, e)}
            style={{ pointerEvents: 'auto' }}
          >
            <Folder label={folder.label} />
          </div>
        ))}
      </div>

      {/* Expanded overlay — scoped inside the section */}
      {openIdx !== null && (
        <div
          className={`folder-overlay folder-overlay--${phase}`}
          style={{
            backgroundColor: activeFolder!.color,
            '--ox': `${origin.xPx}px`,
            '--oy': `${origin.yPx}px`,
          } as React.CSSProperties}
        >
          {/* Photos along arc */}
          {phase === 'open' && photoItems.map((photo, i) => (
            <div
              key={i}
              className="arc-photo"
              style={{
                '--arc-x': `${photo.x}%`,
                '--arc-y': `${photo.y}%`,
                '--arc-rot': `${photo.rotation}deg`,
                animationDelay: `${i * 50}ms`,
              } as React.CSSProperties}
            >
              <img src={photo.src} alt="" draggable={false} />
            </div>
          ))}

          {/* Close button */}
          {phase === 'open' && (
            <button className="arc-close-btn" onClick={handleClose}>
              <span className="material-symbols-rounded">close</span>
            </button>
          )}
        </div>
      )}
    </>
  )
}