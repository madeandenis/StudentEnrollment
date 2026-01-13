import logo from '@/assets/logo.png';

export default function WelcomePage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1.5rem'
        }}>
            <img src={logo} alt="Student Enrollment Logo" style={{ width: '200px', height: 'auto' }} />
            <p>Folosește meniul pentru a naviga prin aplicație</p>
        </div>
    );
}