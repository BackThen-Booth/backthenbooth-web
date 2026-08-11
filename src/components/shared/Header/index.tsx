import type React from 'react'
import './styles.css'
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useMenu } from '../../../contexts/MenuContext';

gsap.registerPlugin(ScrollToPlugin)

export default function Header() {
    const [collapsed, setCollapsed] = useState(false)

    const { open, setOpen } = useMenu()

    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth <= 800) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
                setOpen(false);
            }
        };

        checkSize();
        window.addEventListener("resize", checkSize);

        return () => window.removeEventListener("resize", checkSize);
    }, []);

    useEffect(() => {
        if (open) {
            document.documentElement.classList.add("no-scroll")
            document.body.classList.add("no-scroll")
        } else {
            document.documentElement.classList.remove("no-scroll")
            document.body.classList.remove("no-scroll")
        }
    }, [open])

    return (
        <>
            <header
                id="header"
                role='banner'
                aria-label='Site Header'
                no-select="true"
                data-collapsed={collapsed}
                data-menu={open}
                onClick={() => {
                    if (open && collapsed) setOpen(false)
                }}
            >
                <NavLink to='#home' className='logo'>
                    <img src="/logo.svg" alt="logo" />
                </NavLink>
                
                {collapsed && (
                    <button
                        className="menu-btn"
                        onClick={() => setOpen(m => !m)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                )}

                {!collapsed && (
                    <>
                        <nav className='glass'>
                            <NavLink to="#home" className="nav-link">Home</NavLink>
                            <NavLink to="#gallery" className="nav-link">Gallery</NavLink>
                            <NavLink to="#locations" className="nav-link">Locations</NavLink>
                        </nav>
                        <NavLink to='#contact' className="cta-btn">Contact Us</NavLink>
                    </>
                )}

                
                {(collapsed && open) && <nav id="nav" role='navigation' aria-label='Primary Navigation'>
                    <NavLink to="#home" className="nav-link">Home</NavLink>
                    <NavLink to="#gallery" className="nav-link">Gallery</NavLink>
                    <NavLink to="#locations" className="nav-link">Locations</NavLink>
                    {collapsed && <NavLink to='#contact' className="cta-btn" data-collapsed={collapsed}>Contact Us</NavLink>}
                </nav>}
            </header>
        </>
    )
}

type NavLinkProps = Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "href" | "onClick"
> & {
    to: string,
    children: React.ReactNode
}

// `getBoundingClientRect()`/`offsetTop` on the target itself becomes unreliable
// once a `position: sticky` section has been stuck at least once, so the
// document offset is derived from the (non-sticky-affected) heights of the
// sections that precede it instead of the target's own measured position.
function absoluteTop(el: Element): number {
    let top = 0
    let sibling = el.previousElementSibling
    while (sibling) {
        top += sibling.getBoundingClientRect().height
        sibling = sibling.previousElementSibling
    }
    return top
}

// Any jump that crosses the Hero's huge scrubbed-frame range would otherwise
// animate straight through hundreds of rapidly-changing video frames, which
// reads as a strobe/flash. Those jumps instead fade fully to cover, jump the
// real scroll position while hidden, hold briefly so the Hero's own lagged
// scroll-linked animation (scrub) settles, then fade back in on the
// destination — swapping the target's own position (fixed -> sticky) mid
// transition instead fought with that lag and could flash a stale frame.
// Short hops between the stacked cards stay a smooth scroll.
const HERO_JUMP_THRESHOLD = 4000

let transitionOverlay: HTMLDivElement | null = null

function getTransitionOverlay(): HTMLDivElement {
    if (transitionOverlay) return transitionOverlay

    const el = document.createElement('div')
    el.style.cssText = `
        position: fixed;
        inset: 0;
        background: #090909;
        opacity: 0;
        pointer-events: none;
        z-index: 90;
    `
    document.body.appendChild(el)
    transitionOverlay = el
    return el
}

function NavLink({
    to,
    children,
    ...rest
}: NavLinkProps) {
    return (
        <a
            href={to}
            onClick={(e) => {
                e.currentTarget.blur()

                const target = document.querySelector(to) as HTMLElement | null
                if (!target) return

                e.preventDefault()

                const header = document.getElementById('header')
                const offset = to === '#home' ? 0 : (header?.offsetHeight ?? 0)
                const targetY = absoluteTop(target) - offset
                const distance = Math.abs(targetY - window.scrollY)

                if (distance > HERO_JUMP_THRESHOLD) {
                    const overlay = getTransitionOverlay()

                    gsap.timeline()
                        .to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.inOut' })
                        .call(() => window.scrollTo(0, targetY))
                        .to(overlay, { opacity: 1, duration: 0.15 })
                        .to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.out' })
                } else {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: targetY },
                        ease: 'power2.inOut'
                    })
                }

                history.pushState(null, '', to)
            }}
            {...rest}
        >
            {children}
        </a>
    )
}