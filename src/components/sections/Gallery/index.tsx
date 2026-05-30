import { useState, useCallback, useEffect } from 'react'
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

// load all images from all folder directories
const allImages = import.meta.glob('/public/images/*/*.{jpg,jpeg,png,webp}', { eager: true, query: "?url", import: "default" })

// group by folder name
function getPhotosForFolder(label: string): string[] {
  return Object.entries(allImages)
    .filter(([path]) => path.includes(`/images/${label}/`))
    .map(([, url]) => (url as string).replace("/public", ""))
}

export default function Gallery() {
  const folders: FolderData[] = [
    'RedBull F1 @ RGU',
    'RedBull F1 @ ADTU',
  ].map((label, i) => ({
    label,
    color: FOLDER_COLORS[i % FOLDER_COLORS.length],
    photos: getPhotosForFolder(label),
  }))

  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [origin, setOrigin] = useState<Origin>({ xPct: 0.5, yPct: 0.5, xPx: 0, yPx: 0 })
  const [phase, setPhase] = useState<Phase>('idle')

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number>(0)

    useEffect(() => {
        if (lightboxSrc) {
            document.documentElement.classList.add("no-scroll")
            document.body.classList.add("no-scroll")
        } else {
            document.documentElement.classList.remove("no-scroll")
            document.body.classList.remove("no-scroll")
        }
    }, [lightboxSrc])

  const handleFolderClick = useCallback((idx: number, e: React.MouseEvent) => {
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
  const activePhotos = activeFolder?.photos ?? []

  const openLightbox = (src: string, index: number) => {
    setLightboxSrc(src)
    setLightboxIdx(index)
  }

  const closeLightbox = () => setLightboxSrc(null)

  const lightboxPrev = () => {
    const newIdx = (lightboxIdx - 1 + activePhotos.length) % activePhotos.length
    setLightboxIdx(newIdx)
    setLightboxSrc(activePhotos[newIdx])
  }

  const lightboxNext = () => {
    const newIdx = (lightboxIdx + 1) % activePhotos.length
    setLightboxIdx(newIdx)
    setLightboxSrc(activePhotos[newIdx])
  }

  return (
    <>
      <h2 className="section-heading">Moments Captured.</h2>

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
            onClick={(e) => handleFolderClick(idx, e)}
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
          {phase === 'open' && (
            <>
              <h2 className="section-heading overlay-heading">
                {folders[openIdx].label}
              </h2>

              <button className="close-btn" onClick={handleClose}>
                <span className="material-symbols-rounded">close</span>
              </button>

              <div className="photo-grid">
                {activePhotos.length == 0 && (
                  <div className="photo-grid-empty">No photos yet.</div>
                )}
                {activePhotos.map((src, i) => (
                  <div key={i} className="photo-item" onClick={() => openLightbox(src, i)}>
                    <img src={src} alt={src} draggable={false} />
                  </div>
                ))}
              </div>
            </>
          )}

          {lightboxSrc && (
            <div className="lightbox" onClick={closeLightbox}>
              <button className="lightbox-close" onClick={closeLightbox}>
                <span className="material-symbols-rounded">close</span>
              </button>
              <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); lightboxPrev() }}>
                <span className="material-symbols-rounded">chevron_left</span>
              </button>
              <button
                className="lightbox-img"
                onClick={(e) => e.stopPropagation()}
                no-select="true"
              >
                <img
                  src={lightboxSrc}
                  alt={lightboxSrc}
                />
              </button>
              <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); lightboxNext() }}>
                <span className="material-symbols-rounded">chevron_right</span>
              </button>
              <div className="lightbox-counter">{lightboxIdx + 1} / {activePhotos.length}</div>
            </div>
          )}
        </div>
      )}
    </>
  )
}