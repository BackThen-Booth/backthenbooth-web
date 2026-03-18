import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import start from '../../../assets/images/Start.png'

import './styles.css'

gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(0)

const TOTAL_FRAMES = 501

const SNAP_FRAMES = [0, 59, 181, 277, 308, 373, 449, 470, 498]

type Bounds = {
    x: number,
    y: number,
    w: number,
    h: number,
}

export default function Hero() {
    const [frame, setFrame] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const frameBoundsRef = useRef<Bounds | null>({ x: 0, y: 0, w: 0, h: 0 })

    const renderZoom = useRef<number>(1)
    const zoomState = useRef<{ scale: number }>({ scale: 1 })

    const uiAnim = useRef<{ progress: number }>({ progress: 0 })

    useEffect(() => {
        const canvas = canvasRef.current!

        const ctx = canvas.getContext("2d", { alpha: false })!

        const DPR = window.devicePixelRatio || 1

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

        const frames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null)

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

        function frameSrc(index: number) {
            return `/videos/photobooth/frames/frame_${String(index + 1).padStart(4, "0")}.webp`
        }

        async function loadFrame(index: number) {
            const img = await loadImage(frameSrc(index))
            frames[index] = img
        }

        async function loadInitialFrames() {
            const initial = Array.from({ length: TOTAL_FRAMES }, (_, i) => loadFrame(i))
            await Promise.all([...initial, uiImg.decode()])

            draw(0)
            state.renderedFrame = 0
            setFrame(0)

            startAnimation()
        }

        let uiImg = new Image()
        uiImg.src = start

        const state = {
            targetFrame: 0,
            renderedFrame: -1,
            frame: 0
        }

        function draw(frameIndex: number) {
            const img = frames[frameIndex]
            if (!img) return

            const canvasW = canvas.width / DPR
            const canvasH = canvas.height / DPR

            const frameAspect = img.naturalWidth / img.naturalHeight
            const canvasAspect = canvasW / canvasH

            let drawW, drawH

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

            ctx.drawImage(img, x, y, drawW, drawH)

            if (frameIndex >= 498 && uiImg.complete) {
                const p = uiAnim.current.progress

                const scaleAnim = 0.9 + 0.1 * p
                const opacityAnim = p
                const brightnessAnim = 0.8 + 0.2 * p
                const { x, y, w, h } = frameBoundsRef.current!

                const uiWidth = h * uiScale
                const uiHeight = uiWidth / (382 / 230)

                const uiX = (x + w * 0.50) - (uiWidth / 2)
                const uiY = (y + h * 0.50) - uiHeight

                const imgW = uiImg.width
                const imgH = uiImg.height

                const scale = Math.max(uiWidth / imgW, uiHeight / imgH)
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

                ctx.drawImage(uiImg, offsetX, offsetY, drawW2, drawH2)
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

            if (frame >= 481 && uiAnim.current.progress === 0) {
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
                    end: "+=20000",
                    pin: canvasRef.current,
                    pinnedContainer: canvasRef.current,
                    scrub: 0.5,
                    anticipatePin: 1,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    snap: {
                        delay: 0.2,
                        duration: { min: 0.3, max: 0.6 },
                        ease: "none",

                        snapTo: (value) => {
                            const FRAME_PORTION = 19 / 20

                            // do NOT snap during zoom
                            if (value > FRAME_PORTION) return value

                            // convert timeline progress -> frame progress
                            const frameProgress = value / FRAME_PORTION
                            const frame = frameProgress * (TOTAL_FRAMES - 1)

                            const snappedFrame = SNAP_FRAMES.reduce((a, b) =>
                                Math.abs(b - frame) < Math.abs(a - frame) ? b : a
                            )
                            // convert back -> timeline progress
                            return (snappedFrame / (TOTAL_FRAMES - 1)) * FRAME_PORTION
                        }
                    }
                }
            })

            timeline.to(state, {
                targetFrame: TOTAL_FRAMES - 1,
                ease: "none",
                duration: 19,
            })

            timeline.to(zoomState.current, {
                scale: () => computeTargetZoom(),
                ease: "none",
                duration: 1,
                onUpdate() {
                    renderZoom.current = zoomState.current.scale
                }
            })

        }

        loadInitialFrames()

        return () => {
            controller.abort()
            ScrollTrigger.killAll()
        }

    }, [])

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

    const fontScales = useMemo(() => ({
        curtain: 0.115,
        screen: 0.055,
        props: 0.075
    }), [])

    const uiScale = 0.49 as const;

    const anchors = useMemo(() => ({
        curtain: [0.25, 0.20],
        screen: [0.50, 0.35],
        props: [0.27, 0.15],
    } as const), [])

    const screenPos = framePos(...anchors.screen)
    const propsPos = framePos(...anchors.props)

    return (
        <>
            <canvas ref={canvasRef} />
            <div className="overlay-layer">
                {frame >= 59 && frame <= 91 && (
                    <div
                        className="text left middle"
                    >
                        <div className="text-main">
                            Remember back then
                            <br />
                            when photos were something you
                            <br />
                            could hold?
                        </div>
                        <div className="text-sub">
                            Not just something you scrolled past.
                            <br />
                            Something you kept.
                        </div>
                    </div>
                )}

                {frame >= 181 && frame <= 226 && (
                    <div
                        className="text left bottom"
                    >
                        <div className="text-main">
                            Photos in wallets.
                            <br />
                            On bedroom mirrors.
                            <br />
                            Taped inside notebooks.
                        </div>
                        <div className="text-sub">
                            Little pieces of time that stayed with you.
                        </div>
                    </div>
                )}

                {frame >= 277 && frame <= 305 && (
                    <div
                        className="text screen-text"
                        style={{
                            left: screenPos.left,
                            top: screenPos.top,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <div className="text-mid">
                            But somewhere along the way
                            <br />
                            our memories moved to screens.
                        </div>
                    </div>
                )}
                
                {frame >= 308 && frame <= 337 && (
                    <div
                        className="text screen-text"
                        style={{
                            left: screenPos.left,
                            top: screenPos.top,
                            transform: "translate(-50%, -50%)",
                            fontSize: frameFont(fontScales.screen)
                        }}
                    >
                        <div className="text-mid">
                            Thousands of photos saved.
                            <br/>
                            Almost none we ever hold.
                        </div>
                    </div>
                )}

                {frame >= 373 && frame <= 411 && (
                    <div
                        className="text prop-text"
                        style={{
                            left: propsPos.left,
                            top: propsPos.top,
                        }}
                    >
                        <div className="text-main">
                            So we built BackThen Booth.
                        </div>
                        <div className="text-sub">
                            To bring back the joy of printing a moment the second it happens.
                        </div>
                    </div>
                )}

                {frame >= 449 && frame <= 467 && (
                    <div
                        className="text left bottom"
                    >
                        <div className="text-main">
                            We believe
                            <br />
                            the best memories
                            <br />
                            should exist off-screen.
                        </div>
                    </div>
                )}

                {frame >= 470 && frame <= 488 && (
                    <div
                        className="text right bottom"
                    >
                        <div className="text-main">
                            Because
                            <br />
                            some moments
                            <br />
                            deserve to be held forever.
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
