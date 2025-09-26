export default function DragonDebug() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'red',
        opacity: 0.3,
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px black'
      }}>
        DRAGON HERE
      </div>
      
      <svg viewBox="0 0 1600 900" style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.8
      }}>
        <circle cx="800" cy="450" r="100" fill="lime" />
        <text x="800" y="460" textAnchor="middle" fill="black" fontSize="20">
          Dragon Eye
        </text>
      </svg>
    </div>
  );
}