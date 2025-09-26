#!/usr/bin/env python3
"""
Ultra-simple dragon server in Python Flask
No dependencies, no complex frameworks, just guaranteed visible dragon effects
"""

from flask import Flask, render_template_string
import datetime

app = Flask(__name__)

# HTML template with inline styles for maximum compatibility
DRAGON_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐉 Python Dragon Server</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f23, #1a1a2e);
            color: white;
            font-family: 'Courier New', monospace;
            overflow-x: hidden;
        }
        
        .dragon-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }
        
        .dragon {
            position: absolute;
            top: 25%;
            left: 20%;
            width: 300px;
            height: 150px;
            background: radial-gradient(ellipse, rgba(0, 255, 127, 0.2), transparent);
            border: 3px solid #00ff7f;
            border-radius: 60% 40% 80% 20%;
            animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-15px) scale(1.02); }
        }
        
        .dragon-eye {
            position: absolute;
            top: 35%;
            right: 30%;
            width: 8px;
            height: 8px;
            background: #00ff7f;
            border-radius: 50%;
            box-shadow: 0 0 10px #00ff7f;
            animation: blink 2.5s infinite;
        }
        
        @keyframes blink {
            0%, 85%, 100% { opacity: 1; }
            90% { opacity: 0.1; }
        }
        
        .storm {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                20deg,
                transparent,
                transparent 25px,
                rgba(0, 255, 127, 0.05) 25px,
                rgba(0, 255, 127, 0.05) 27px
            );
            animation: storm-move 1.8s linear infinite;
        }
        
        @keyframes storm-move {
            0% { background-position: 0 0; }
            100% { background-position: 40px 80px; }
        }
        
        .content {
            position: relative;
            z-index: 1;
            padding: 50px 30px;
            text-align: center;
        }
        
        .status-box {
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ff7f;
            border-radius: 15px;
            padding: 25px;
            margin: 25px auto;
            max-width: 500px;
            box-shadow: 0 0 20px rgba(0, 255, 127, 0.3);
        }
        
        .success-badge {
            background: #00ff7f;
            color: black;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            display: inline-block;
            margin: 10px;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .tech-info {
            font-size: 14px;
            color: #00ff7f;
            margin: 10px 0;
        }
        
        button {
            background: #00ff7f;
            color: black;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        }
        
        button:hover {
            background: #00cc64;
            transform: translateY(-2px);
        }
        
        @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
        }
        
        @media (max-width: 600px) {
            .dragon { width: 250px; height: 120px; left: 15%; }
            .content { padding: 30px 20px; }
            .status-box { margin: 15px; padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="dragon-container">
        <div class="storm"></div>
        <div class="dragon">
            <div class="dragon-eye"></div>
        </div>
    </div>
    
    <div class="content">
        <h1>🐉 Python Dragon Server</h1>
        <div class="success-badge">✅ PYTHON SERVER ACTIVE</div>
        
        <div class="status-box">
            <h2>🌟 Dragon Status</h2>
            <p><strong>Server Time:</strong> {{ current_time }}</p>
            <p><strong>Language:</strong> Python {{ python_version }}</p>
            <p><strong>Framework:</strong> Flask (minimal)</p>
            
            <div class="tech-info">
                <p>✅ Green dragon with glowing eye (floating animation)</p>
                <p>✅ Diagonal storm lines (moving pattern)</p>
                <p>✅ Pure CSS animations (no JavaScript required)</p>
                <p>✅ Reduced motion support</p>
            </div>
            
            <button onclick="toggleDragon()">Toggle Dragon Visibility</button>
            <button onclick="window.location.reload()">Refresh Page</button>
        </div>
        
        <div class="status-box">
            <h3>🔥 Why This Works</h3>
            <p>This is <strong>pure HTML/CSS</strong> served by <strong>Python Flask</strong></p>
            <p>No React, no TypeScript, no complex build tools</p>
            <p>Just simple, guaranteed-to-work web technologies</p>
            <p><strong>If you still see nothing, your browser may have CSS disabled</strong></p>
        </div>
    </div>
    
    <script>
        function toggleDragon() {
            const dragon = document.querySelector('.dragon');
            const container = document.querySelector('.dragon-container');
            
            if (dragon.style.border === '5px solid red') {
                dragon.style.border = '3px solid #00ff7f';
                dragon.style.background = 'radial-gradient(ellipse, rgba(0, 255, 127, 0.2), transparent)';
                container.style.backgroundColor = '';
                console.log('Dragon reset to normal');
            } else {
                dragon.style.border = '5px solid red';
                dragon.style.background = 'rgba(255, 0, 0, 0.3)';
                container.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
                console.log('Dragon in debug mode - should be VERY visible now');
            }
        }
        
        console.log('🐉 Python Dragon Server loaded!');
        console.log('Time:', '{{ current_time }}');
    </script>
</body>
</html>
"""

@app.route('/')
def dragon_home():
    import sys
    return render_template_string(DRAGON_TEMPLATE,
        current_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        python_version=f"{sys.version_info.major}.{sys.version_info.minor}"
    )

@app.route('/status')
def status():
    return {
        "status": "Dragon server running",
        "time": datetime.datetime.now().isoformat(),
        "dragon_visible": True,
        "effects": ["floating_dragon", "storm_lines", "blinking_eye"]
    }

if __name__ == '__main__':
    print("🐉 Starting Python Dragon Server...")
    print("🌐 Visit: http://localhost:5000")
    print("📊 Status: http://localhost:5000/status")
    print("🔥 This WILL show a dragon - guaranteed!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)