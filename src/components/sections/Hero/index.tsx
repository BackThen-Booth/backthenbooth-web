import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import start from '../../../assets/images/Start.png'
import ambientMusic from '../../../assets/audio/ambient.m4a'

import './styles.css'

gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(0)

const TOTAL_FRAMES = 361
const FRAMES_PER_SPRITE = 16
const COLS = 4
const ROWS = 4

const SNAP_FRAMES = [1, 60, 162, 238, 294, 350]

type Bounds = {
    x: number,
    y: number,
    w: number,
    h: number,
}

export default function Hero() {
    const [frame, setFrame] = useState<number>(0);
    const [muted, setMuted] = useState<boolean>(true)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<HTMLDivElement | null>(null)

    const frameBoundsRef = useRef<Bounds | null>({ x: 0, y: 0, w: 0, h: 0 })

    const renderZoom = useRef<number>(1)
    const zoomState = useRef<{ scale: number }>({ scale: 1 })

    const uiAnim = useRef<{ progress: number }>({ progress: 0 })

    useEffect(() => {
        const canvas = canvasRef.current!

        const audio = new Audio(ambientMusic)
        audio.loop = true
        audio.volume = 0
        audio.preload = 'auto'
        audio.muted = true

        audio.play().catch(() => { })

        audioRef.current = audio

        const ctx = canvas.getContext("2d", { alpha: false })!

        const DPR = Math.min(window.devicePixelRatio, 1.25)

        function resize() {
            canvas.width = window.innerWidth * DPR
            canvas.height = window.innerHeight * DPR
            canvas.style.width = "100vw"
            canvas.style.height = "100vh"
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
        }

        const controller = new AbortController()
        resize()
        window.addEventListener("resize", resize, { signal: controller.signal })

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        const spriteCount = Math.ceil(TOTAL_FRAMES / FRAMES_PER_SPRITE)
        const sprites: (HTMLImageElement | null)[] = new Array(spriteCount).fill(null)

        function loadImage(src: string) {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image()

                img.onload = async () => {
                    try { await img.decode().catch(() => { }) } catch { }
                    resolve(img)
                }

                img.onerror = reject
                img.src = src
            })
        }


        async function loadSprite(index: number) {
            const src = `/videos/photobooth/sprite_${String(index + 1).padStart(2, "0")}.webp`
            const img = await loadImage(src)
            sprites[index] = img
        }

        async function loadInitialSprites() {
            await Promise.all([
                loadSprite(0),
                loadSprite(1),
                uiImg.decode()
            ])

            draw(0)
            state.renderedFrame = 0
            setFrame(0)

            startAnimation()

            for (let i = 2; i < spriteCount; i++) {
                loadSprite(i)
            }

        }

        let uiImg = new Image()
        uiImg.src = start

        const state = {
            targetFrame: 0,
            renderedFrame: -1,
            frame: 0
        }

        function draw(frame: number) {
            const spriteIndex = Math.floor(frame / FRAMES_PER_SPRITE)
            const frameInSprite = frame % FRAMES_PER_SPRITE

            const sprite = sprites[spriteIndex]

            if (!sprite) return

            const frameWidth = sprite.width / COLS
            const frameHeight = sprite.height / ROWS

            const col = frameInSprite % COLS
            const row = Math.floor(frameInSprite / COLS)

            const canvasW = canvas.width / DPR
            const canvasH = canvas.height / DPR

            const frameAspect = frameWidth / frameHeight
            const canvasAspect = canvasW / canvasH

            let drawW
            let drawH

            if (canvasAspect > frameAspect) {
                drawW = canvasW
                drawH = drawW / frameAspect
            } else {
                drawH = canvasH
                drawW = drawH * frameAspect
            }

            const x = (canvasW - drawW) / 2
            const y = (canvasH - drawH) / 2

            frameBoundsRef.current = { x, y, w: drawW, h: drawH }

            ctx.clearRect(0, 0, canvasW, canvasH)

            const zoom = renderZoom.current

            const pivotX = x + drawW * 0.5
            const pivotY = y + drawH * 0.3

            ctx.save()

            ctx.translate(pivotX, pivotY)
            ctx.scale(zoom, zoom)
            ctx.translate(-pivotX, -pivotY)

            ctx.drawImage(
                sprite,
                col * frameWidth,
                row * frameHeight,
                frameWidth,
                frameHeight,
                x,
                y,
                drawW,
                drawH
            )

            if (frame >= 350 && uiImg.complete) {
                const p = uiAnim.current.progress

                const scaleAnim = 0.9 + 0.1 * p
                const opacityAnim = p
                const brightnessAnim = 0.8 + 0.2 * p

                const uiWidth = frameSize(uiScale)
                const uiHeight = uiWidth / (382 / 230)

                const uiX = uiPos.left - (uiWidth / 2)
                const uiY = uiPos.top - uiHeight

                const imgW = uiImg.width
                const imgH = uiImg.height

                const scale = Math.max(
                    uiWidth / imgW,
                    uiHeight / imgH
                )

                const drawW2 = imgW * scale
                const drawH2 = imgH * scale

                const offsetX = uiX + (uiWidth - drawW2) / 2
                const offsetY = uiY + (uiHeight - drawH2) / 2

                ctx.save()

                ctx.beginPath()
                ctx.rect(uiX, uiY, uiWidth, uiHeight)
                ctx.clip()

                ctx.filter = `brightness(${brightnessAnim}) sepia(0.3)`

                ctx.globalCompositeOperation = "screen"

                ctx.globalAlpha = opacityAnim

                const cx = uiX + (uiWidth / 2)
                const cy = uiY + (uiHeight / 2)

                ctx.translate(cx, cy)
                ctx.scale(scaleAnim, scaleAnim)
                ctx.translate(-cx, -cy)

                const glow = 0.6 * (1 - p)

                ctx.shadowColor = `rgba(255, 255, 255, ${glow})`
                ctx.shadowBlur = 60

                ctx.drawImage(
                    uiImg,
                    offsetX,
                    offsetY,
                    drawW2,
                    drawH2
                )

                ctx.restore()
            }

            ctx.restore()
        }

        let lastZoom = 1
        let lastUIProgress = 0

        gsap.ticker.add(() => {
            const frame = Math.round(state.targetFrame)
            const zoom = renderZoom.current
            const p = uiAnim.current.progress

            if (
                frame !== state.renderedFrame ||
                zoom !== lastZoom ||
                p !== lastUIProgress
            ) {
                draw(frame)
                state.renderedFrame = frame
                lastZoom = zoom
                lastUIProgress = p
                setFrame(frame)
            }

            if (frame >= 350 && uiAnim.current.progress === 0) {
                gsap.to(uiAnim.current, {
                    progress: 1,
                    duration: 0.25,
                    ease: "power3.out"
                })
            }
        })

        function startAnimation() {
            let timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: "#home",
                    start: "top top",
                    end: "+=11000",
                    pin: sceneRef.current,
                    scrub: 1,
                    snap: {
                        delay: 0.12,
                        duration: 0.45,
                        ease: "power2.out",

                        snapTo: (value) => {

                            const FRAME_PORTION = 9 / 11

                            // do NOT snap during zoom
                            if (value > FRAME_PORTION) return value

                            // convert timeline progress → frame progress
                            const frameProgress = value / FRAME_PORTION
                            const frame = frameProgress * (TOTAL_FRAMES - 1)

                            const snappedFrame = SNAP_FRAMES.reduce((a, b) =>
                                Math.abs(b - frame) < Math.abs(a - frame) ? b : a
                            )

                            // convert back → timeline progress
                            return (snappedFrame / (TOTAL_FRAMES - 1)) * FRAME_PORTION
                        }
                    }
                }
            })

            timeline.to(state, {
                targetFrame: TOTAL_FRAMES - 1,
                ease: "none",
                duration: 9,
            })

            timeline.to(zoomState.current, {
                scale: () => computeTargetZoom(),
                ease: "power3.out",
                duration: 2,
                onUpdate() {
                    renderZoom.current = zoomState.current.scale
                }
            })

        }

        loadInitialSprites()

        return () => {
            controller.abort()
            ScrollTrigger.killAll()
        }

    }, [])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.muted = muted

        if (!muted) {
            audio.volume = 0.6
            audio.play().catch(() => { })
        } else {
            audio.volume = 0
        }
    }, [muted])

    function computeTargetZoom() {
        const bounds = frameBoundsRef.current!
        const imgWidth = bounds.h * uiScale

        return window.innerWidth / imgWidth
    }

    function framePos(px: number, py: number) {
        const { x, y, w, h } = frameBoundsRef.current!

        return {
            left: x + w * px,
            top: y + h * py
        }
    }

    function frameFont(scale: number) {
        const { h } = frameBoundsRef.current!
        return Math.max(18, h * scale)
    }

    function frameSize(scale: number) {
        const { h } = frameBoundsRef.current!
        return h * scale
    }

    const fontScales = useMemo(() => ({
        curtain: 0.115,
        screen: 0.055,
        props: 0.075
    }), [])

    const uiScale = 0.49 as const;

    const anchors = useMemo(() => ({
        curtain: [0.25, 0.20],
        screen: [0.50, 0.35],
        props: [0.29, 0.15],
        ui: [0.50, 0.50]
    } as const), [])

    const curtainPos = framePos(...anchors.curtain)
    const screenPos = framePos(...anchors.screen)
    const propsPos = framePos(...anchors.props)
    const uiPos = framePos(...anchors.ui)

    return (
        <>
            <div ref={sceneRef} className='scene'>
                <canvas ref={canvasRef} />
                <div className="overlay-layer">
                    {frame >= 60 && frame <= 70 && (
                        <div
                            className="text curtain-text"
                            style={{
                                left: curtainPos.left,
                                top: curtainPos.top,
                                fontSize: frameFont(fontScales.curtain)
                            }}
                        >
                            The scene is yours
                        </div>
                    )}

                    {frame >= 238 && frame <= 250 && (
                        <div
                            className="text screen-text"
                            style={{
                                left: screenPos.left,
                                top: screenPos.top,
                                transform: "translate(-50%, -50%)",
                                fontSize: frameFont(fontScales.screen)
                            }}
                        >
                            Make yourself comfortable
                        </div>
                    )}

                    {frame >= 294 && frame <= 300 && (
                        <div
                            className="text prop-text"
                            style={{
                                left: propsPos.left,
                                top: propsPos.top,
                                fontSize: frameFont(fontScales.props)
                            }}
                        >
                            Choose your alter ego
                        </div>
                    )}

                    {/* {frame >= 350 && (
                        <div
                            className="sw-img"
                            style={{
                                left: uiPos.left,
                                top: uiPos.top,
                                width: frameSize(uiScale),
                                transform: "translate(-50%, -100%)"
                            }}
                        >
                            <img src={start} />
                        </div>
                    )} */}

                </div>
            </div>
            <button
                className={`mute-btn${muted ? " muted" : ""}`}
                onClick={() => setMuted(m => !m)}
            >
                <span className="material-symbols-rounded">
                    {muted ? "volume_off" : "volume_up"}
                </span>
            </button>
        </>
    )
}
