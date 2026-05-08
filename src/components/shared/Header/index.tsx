import type React from 'react'
import './styles.css'
import { useState, useEffect } from 'react';
import { useMenu } from '../../../contexts/MenuContext';

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
                        <NavLink to='#cta' className="cta-btn">Contact Us</NavLink>
                    </>
                )}

                
                {(collapsed && open) && <nav id="nav" role='navigation' aria-label='Primary Navigation'>
                    <NavLink to="#home" className="nav-link">Home</NavLink>
                    <NavLink to="#gallery" className="nav-link">Gallery</NavLink>
                    <NavLink to="#locations" className="nav-link">Locations</NavLink>
                </nav>}
            </header>
            {collapsed && <NavLink to='#cta' className="cta-btn" data-collapsed={collapsed}>Contact Us</NavLink>}
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

function NavLink({
    to,
    children,
    ...rest
}: NavLinkProps) {
    return (
        <a
            href={to}
            onClick={(e) => e.currentTarget.blur()}
            {...rest}
        >
            {children}
        </a>
    )
}