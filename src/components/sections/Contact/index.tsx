import { useState } from 'react'
import emailjs from '@emailjs/browser'

import './styles.css'

const EMAILJS_SERVICE_ID = 'service_x8dn4xa'
const EMAILJS_TEMPLATE_ID = 'template_83k87he'
const EMAILJS_PUBLIC_KEY = 'p_7pWYwGsh90saF9b'

export default function Contact() {
  const [fields, setFields] = useState({
    first_name: '',
    last_name: '',
    user_email: '',
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: `${fields.first_name} ${fields.last_name}`.trim(),
        email: fields.user_email,
        message: fields.message,
        title: 'New Booking Inquiry',
        time: new Date().toLocaleString(),
      }, { publicKey: EMAILJS_PUBLIC_KEY })

      setStatus('sent')
      setFields({ first_name: '', last_name: '', user_email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

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
            href='mailto:social@backthenbooth.com'
            rel='noopener noreferrer'
            target='_blank'
          >
            <span className="material-symbols-rounded">email</span>
            social@backthenbooth.com
          </a>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="first-name">First Name *</label>
                <input id="first-name" name="first_name" type="text" required value={fields.first_name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="last-name">Last Name</label>
                <input id="last-name" name="last_name" type="text" value={fields.last_name} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="user-email">Email *</label>
                <input id="user-email" name="user_email" type="email" required value={fields.user_email} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" required value={fields.message} onChange={handleChange} />
              </div>
            </div>
            <button type='submit' disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Send'}
            </button>
            {status === 'error' && (
              <div className="form-status error">Something went wrong — please try again.</div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
