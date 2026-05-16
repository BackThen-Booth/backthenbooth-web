import { useCallback, useMemo } from 'react'

import './styles.css'

const imgsModules = import.meta.glob("./*.svg", { base: "../../../assets/icons", eager: true })

export default function Footer() {
  const imgs = useCallback((name: string) => (imgsModules[`./${name}.svg`] as any).default, [])

  const socials = useMemo(() => [
    {
      name: "instagram",
      handle: "https://instagram.com/backthenbooth"
    },
    {
      name: "twitter",
      handle: "https://x.com/backthenbooth"
    },
    {
      name: "facebook",
      handle: "https://www.facebook.com/profile.php?id=61588536075093"
    },
    {
      name: "youtube",
      handle: "https://youtube.com/@BackThenBooth"
    },
    {
      name: "linkedin",
      handle: "https://linkedin.com/company/backthenbooth/"
    },
  ], [])

  return (
    <footer id="footer">
      <a
        className="footer-email"
        href='mailto:social@backthenbooth.com'
        rel='noopener noreferrer'
        target='_blank'
      >
        <span className="material-symbols-rounded">email</span>
        social@backthenbooth.com
      </a>
      <div className="footer-socials">
        {socials.map((social, idx) => (
          <a
            key={idx}
            href={social.handle}
            className="footer-social"
            rel='noopener noreferrer'
            target='_blank'
          >
            <img src={imgs(social.name)} alt={social.name} />
          </a>
        ))}
      </div>
      <div className="footer-legal">
        <a>Terms of Services</a>
        <span>|</span>
        <a>Privacy Policy</a>
      </div>
    </footer>
  )
}
