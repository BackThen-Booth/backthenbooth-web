import { useState } from 'react'
import Folder from '../../ui/Folder'
import './styles.css'

// const HEADER_HEIGHT = 80
const TITLE_HEIGHT = 180
const FOLDER_W = 90
const FOLDER_H = 100

// Each folder gets a distinct color
const FOLDER_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2d6a4f', '#1b4332', '#6d4c41', '#37474f',
]

// Placeholder photos per folder (use your real photo arrays here)
const FOLDER_PHOTOS: Record<number, string[]> = {}

function getRandomPositions(count: number) {
  const positions: { top: number; left: number }[] = []
  for (let i = 0; i < count; i++) {
    let attempts = 0
    let pos = { top: 0, left: 0 }
    do {
      pos = {
        top: TITLE_HEIGHT + Math.random() * (window.innerHeight - TITLE_HEIGHT - FOLDER_H - 20),
        left: 20 + Math.random() * (window.innerWidth - FOLDER_W - 40),
      }
      const overlaps = positions.some(
        p => Math.abs(p.left - pos.left) < FOLDER_W + 30 && Math.abs(p.top - pos.top) < FOLDER_H + 30
      )
      if (!overlaps || attempts > 60) break
      attempts++
    } while (true)
    positions.push(pos)
  }
  return positions
}

interface FolderData {
  label: string
  color: string
  photos: string[]
}

export default function Gallery() {
  const folders: FolderData[] = [
    "NE go skate day 2026",
    "NE go skate day 2026",
    "NE go skate day 2026",
    "NE go skate day 2026",
    "NE go skate day 2026",
    "NE go skate day 2026",
    "NE go skate day 2026",
    "NE go skate day 2026",
  ].map((label, i) => ({
    label,
    color: FOLDER_COLORS[i % FOLDER_COLORS.length],
    photos: FOLDER_PHOTOS[i] ?? Array.from({ length: 8 }, (_, j) => `https://picsum.photos/seed/${i * 10 + j}/300/400`),
  }))

  const [positions] = useState(() => getRandomPositions(folders.length))
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [animating, setAnimating] = useState(false)
  const [closing, setClosing] = useState(false)

  const handleOpen = (idx: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setClosing(false)
    setOpenIdx(idx)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 600)
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setOpenIdx(null)
      setClosing(false)
    }, 500)
  }

  const activeFolder = openIdx !== null ? folders[openIdx] : null

  // Arc: top-right to bottom-left, center of curvature roughly in the middle-right
  // We place N photos along an arc from ~-30deg to ~200deg (a ~230deg sweep)
  const arcPhotos = activeFolder?.photos ?? []
  const ARC_RADIUS = Math.min(window.innerWidth, window.innerHeight) * 0.36
  const ARC_CENTER = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
  const ARC_START_DEG = -50   // top-right
  const ARC_END_DEG = 210     // bottom-left
  const photoItems = arcPhotos.map((src, i) => {
    const t = arcPhotos.length === 1 ? 0.5 : i / (arcPhotos.length - 1)
    const deg = ARC_START_DEG + t * (ARC_END_DEG - ARC_START_DEG)
    const rad = (deg * Math.PI) / 180
    return {
      src,
      x: ARC_CENTER.x + ARC_RADIUS * Math.cos(rad),
      y: ARC_CENTER.y + ARC_RADIUS * Math.sin(rad),
      rotation: deg + 90, // photo faces inward
    }
  })

  return (
    <>
      <h2 className="section-heading">
        {openIdx !== null ? folders[openIdx].label : 'Moments Captured.'}
      </h2>

      {/* Folders scattered on screen */}
      <div className="folders-container" style={{ opacity: openIdx !== null ? 0 : 1, transition: 'opacity 0.3s' }}>
        {folders.map((folder, idx) => (
          <div
            key={idx}
            className="folder-wrapper"
            style={{ position: 'absolute', top: positions[idx].top, left: positions[idx].left }}
            onClick={(e) => handleOpen(idx, e)}
          >
            <Folder label={folder.label} />
          </div>
        ))}
      </div>

      {/* Expanded overlay */}
      {openIdx !== null && (
        <div
          className={`folder-overlay ${animating ? 'expanding' : ''} ${closing ? 'collapsing' : ''}`}
          style={{
            backgroundColor: activeFolder!.color,
            '--ox': `${origin.x}px`,
            '--oy': `${origin.y}px`,
          } as React.CSSProperties}
        >
          {/* Arc photos */}
          {!animating && photoItems.map((photo, i) => (
            <div
              key={i}
              className="arc-photo"
              style={{
                left: photo.x,
                top: photo.y,
                transform: `translate(-50%, -50%) rotate(${photo.rotation - 90}deg)`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              <img src={photo.src} alt="" />
            </div>
          ))}

          {/* Close button at arc center */}
          {!animating && (
            <button
              className="arc-close-btn"
              style={{ left: ARC_CENTER.x, top: ARC_CENTER.y }}
              onClick={handleClose}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </>
  )
}