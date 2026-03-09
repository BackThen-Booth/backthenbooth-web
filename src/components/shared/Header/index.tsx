import type React from 'react'
import './styles.css'

export default function Header() {
    return (
        <header id="header">
            <NavLink to='#home' className='logo'>
                <img src="/logo.svg" alt="logo" />
            </NavLink>
            <nav>
                <NavLink to="#home" className="nav-link">Home</NavLink>
                <NavLink to="#gallery" className="nav-link">Gallery</NavLink>
                <NavLink to="#locations" className="nav-link">Locations</NavLink>
            </nav>
            <NavLink to='#cta' className="cta-btn">Contact Us</NavLink>
        </header>
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