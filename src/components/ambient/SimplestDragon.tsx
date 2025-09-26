// Absolute simplest dragon - WILL WORK
export default function SimplestDragon() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'rgba(20, 184, 166, 0.05)', // Visible jade background
      }}
    >
      {/* Simple dragon shape */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: '60%',
          height: '40%',
          border: '3px solid rgba(20, 184, 166, 0.3)',
          borderRadius: '50% 20% 50% 20%',
          backgroundColor: 'rgba(20, 184, 166, 0.05)',
        }}
      />
      
      {/* Dragon eye */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '65%',
          width: '30px',
          height: '30px',
          backgroundColor: 'rgba(20, 184, 166, 0.6)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
        }}
      />
      
      {/* Simple rain lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0px, transparent 100px, rgba(20, 184, 166, 0.1) 101px, rgba(20, 184, 166, 0.1) 103px)',
          animation: 'rain 4s linear infinite',
        }}
      />
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes rain {
          0% { background-position: 0px 0px; }
          100% { background-position: 200px 200px; }
        }
      `}</style>
    </div>
  );
}