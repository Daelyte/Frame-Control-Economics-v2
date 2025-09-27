// Ultra simple test dragon - SHOULD BE VERY VISIBLE
export default function TestDragon() {
  return (
    <>
      {/* Bright red background test */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        RED BACKGROUND TEST
      </div>
      
      {/* Bright green dragon shape */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '200px',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          borderRadius: '50px',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        GREEN DRAGON TEST
      </div>
      
      {/* Bright blue rain lines */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'repeating-linear-gradient(45deg, transparent 0px, transparent 50px, rgba(0, 0, 255, 0.3) 51px, rgba(0, 0, 255, 0.3) 53px)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        BLUE RAIN TEST
      </div>
    </>
  );
}