import './styles.css'

export default function Contact() {
  return (
    <>
      <h2 className="section-heading">
        Get In Touch.
      </h2>
      <div className="content">
        <div>
          <div className="section-subtitle">
            Have something in mind?
          </div>
          <div className="section-text">
            Whether you're planning an event, looking to collaborate, or simply curious about the booth — we’d love to hear from you.
            <br />
            From birthdays and weddings to college fests, brand activations, and private parties, BackThen Booth brings a fun nostalgic touch to any gathering. Step in, strike a pose, and walk away with memories you can actually hold.
            <br />
            If you're interested in booking the booth, learning about our event pricing, hosting one at your venue, or creating content together, drop us a message. We're always excited to be part of something memorable.
          </div>
          <a
            href='mailto:contact@backthenbooth.com'
            rel='noopener noreferrer'
            target='_blank'
          >
            <span className="material-symbols-rounded">email</span>
            contact@backthenbooth.com
          </a>
        </div>
        <div>
          <form action="">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="first-name">First Name *</label>
                <input id='first-name' type="text" required />
              </div>
              <div className="form-field">
                <label htmlFor="last-name">Last Name</label>
                <input id='last-name' type="text" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="user-email">Email *</label>
                <input id='user-email' type="email" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="message">Message *</label>
                <textarea id='message' required />
              </div>
            </div>
            <button>Send</button>
          </form>
        </div>
      </div>
    </>
  )
}
