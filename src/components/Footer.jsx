import { FacebookOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import Link from 'next/link';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-main'>
        <div className='footer-sv'>
          <section className='footer-sv__links--container'>
            <ul className='footer-sv__links'>
              <h5 className='footer-sv__link--header'>Horarios Óptica</h5>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Lunes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8:30 - 20:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Martes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8:30 - 20:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Miércoles &nbsp;&nbsp; 8:30 - 20:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Jueves &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8:30 - 20:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Viernes &nbsp;&nbsp;&nbsp;&nbsp; 8:30 - 20:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Sábado &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8:30 - 14:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Domingo &nbsp;&nbsp;&nbsp;&nbsp; CERRADO</p>
              </li>
            </ul>
            <ul className='footer-sv__links'>
              <h5 className='footer-sv__link--header'>Horarios Oftalmológica</h5>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Lunes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9:00 - 19:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Martes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9:00 - 19:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Miércoles &nbsp;&nbsp; 9:00 - 19:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Jueves &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9:00 - 19:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Viernes &nbsp;&nbsp;&nbsp;&nbsp; 9:00 - 19:00</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Sábado &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10:00 - 12:30</p>
              </li>
              <li className='footer-sv__link--wrapper'>
                <p className='footer-sv__link'>Domingo &nbsp;&nbsp;&nbsp;&nbsp; CERRADO</p>
              </li>
            </ul>
          </section>
          <section className='footer-sv__contact'>
            <h4 className='footer-sv__contact-title'>Contáctanos</h4>
            <br />
            <ul className='footer-sv__contact-info'>
              <li className='footer-sv__contact-tel'>
                <PhoneOutlined />
                <span className='footer-sv__contact-label'>4-4224882</span>
                <span className='footer-sv__contact-label'>4-4506232</span>
              </li>
              <li className='footer-sv__contact-email'>
                <MailOutlined />
                <span className='footer-sv__contact-label'>info@viscarra.center</span>
                <span className='footer-sv__contact-label'>centrooftalmologicoviscarra@hotmail.com</span>
              </li>
              <li className='footer-sv__contact-message'>
                <WhatsAppOutlined />
                <span className='footer-sv__contact-label'>+591 74560178</span>
                <span className='footer-sv__contact-label'>+591 65780746</span>
              </li>
            </ul>
            <br />
            <ul className='footer-sv__contact-info'>
              <li className='footer-sv__contact-tel'>
                <InstagramOutlined />
                <span className='footer-sv__contact-label'>opticas_viscarra</span>
                <span className='footer-sv__contact-label'>centrooftalmologicoviscarra</span>
              </li>
              <li className='footer-sv__contact-email'>
                <FacebookOutlined />
                <span className='footer-sv__contact-label'>Centro Óptico Viscarra</span>
                <span className='footer-sv__contact-label'>Centro Oftalmológico Viscarra</span>
              </li>
            </ul>
          </section>
        </div>
        <ul className='footer-bottom'>
          <span className='footer-bottom__link'>&copy; 2024 VisCenter</span>
          <Link
            href='/'
            className='footer-bottom__link'
          >
            Sobre nosotros
          </Link>
          <Link
            href='/'
            className='footer-bottom__link'
          >
            Preguntas frecuentes
          </Link>
          <Link
            href='/'
            className='footer-bottom__link'
          >
            Ubicación
          </Link>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
