import './styles.css'

export default function Header() {
    return (
        <header id="header">
            <a className="logo">
                <img src="/logo.svg" alt="logo" />
            </a>
            <nav>
                <a href="#home" className="nav-link">Home</a>
                <a href="#gallery" className="nav-link">Gallery</a>
                <a href="#locations" className="nav-link">Locations</a>
            </nav>
            <a href='#cta' className="cta-btn">CONTACT US</a>
        </header>
    )
}
