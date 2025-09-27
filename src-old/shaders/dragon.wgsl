// Dragon Storm System - WGSL Shaders
// High-performance GPU shaders for dragon silhouette, storm, and lightning

// Uniform buffer for storm control parameters
struct StormUniforms {
    resolution: vec2<f32>,
    time: f32,
    stormIntensity: f32,
    lightningPhase: f32,
    smokeDensity: f32,
    hue: f32,
    qualityTier: f32, // 0.0=low, 1.0=medium, 2.0=high
    dragonPosition: vec2<f32>,
    dragonScale: f32,
    _padding: f32,
}

@group(0) @binding(0) var<uniform> uniforms: StormUniforms;

// Vertex shader for fullscreen quad
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    
    // Generate fullscreen quad from vertex index
    let x = f32((vertexIndex << 1u) & 2u) - 1.0;
    let y = f32(vertexIndex & 2u) - 1.0;
    
    output.position = vec4<f32>(x, y, 0.0, 1.0);
    output.uv = vec2<f32>(x * 0.5 + 0.5, y * 0.5 + 0.5);
    
    return output;
}

// Noise functions for procedural effects
fn hash(p: vec2<f32>) -> f32 {
    let h = dot(p, vec2<f32>(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(hash(i + vec2<f32>(0.0, 0.0)), hash(i + vec2<f32>(1.0, 0.0)), u.x),
        mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x),
        u.y
    );
}

// Fractal Brownian Motion for complex noise patterns
fn fbm(p: vec2<f32>, octaves: i32) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var pos = p;
    
    for (var i = 0; i < octaves; i++) {
        if (i >= i32(uniforms.qualityTier) + 3) { break; } // Quality-based LOD
        value += amplitude * noise(pos * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
        pos = pos * 2.0 + vec2<f32>(0.17, 0.31);
    }
    
    return value;
}

// Signed Distance Function for dragon silhouette
fn dragonSDF(p: vec2<f32>) -> f32 {
    let center = uniforms.dragonPosition;
    let scale = uniforms.dragonScale;
    let pos = (p - center) / scale;
    
    // Complex dragon shape using multiple ellipses and smoothstep operations
    let body = length(pos * vec2<f32>(1.0, 0.6)) - 0.8;
    let head = length((pos - vec2<f32>(-0.6, 0.1)) * vec2<f32>(0.7, 0.8)) - 0.4;
    let neck = length((pos - vec2<f32>(-0.3, 0.0)) * vec2<f32>(0.4, 0.6)) - 0.3;
    
    // Wing approximation
    let wingPos = pos - vec2<f32>(0.2, -0.3);
    let wing = length(wingPos * vec2<f32>(0.8, 1.2)) - 0.6;
    
    // Tail curve
    let tailPos = pos - vec2<f32>(0.7, 0.0);
    let tail = length(tailPos * vec2<f32>(2.0, 0.4)) - 0.2;
    
    // Combine shapes using smooth minimum
    var dragon = min(body, head);
    dragon = min(dragon, neck);
    dragon = min(dragon, wing);
    dragon = min(dragon, tail);
    
    return dragon;
}

// Storm effect generation
fn computeStorm(uv: vec2<f32>) -> vec4<f32> {
    let time = uniforms.time;
    let intensity = uniforms.stormIntensity;
    
    // Rain pattern - diagonal streaks
    let rainDir = vec2<f32>(0.3, -1.0);
    let rainUV = uv + rainDir * time * 0.5;
    let rain = fbm(rainUV * 8.0, 4);
    
    // Wind distortion
    let windNoise = fbm((uv + time * 0.1) * 4.0, 3) * 0.1;
    let distortedUV = uv + windNoise;
    
    // Storm clouds using multiple octaves
    let clouds = fbm(distortedUV * 3.0 + time * 0.05, 6);
    let cloudDensity = smoothstep(0.3, 0.8, clouds) * intensity;
    
    // Lightning calculation
    let lightning = computeLightning(uv);
    
    // Combine effects
    let rainIntensity = smoothstep(0.5, 0.8, rain) * intensity * 0.6;
    let stormColor = vec3<f32>(0.1, 0.3, 0.4) * cloudDensity + vec3<f32>(0.8, 0.9, 1.0) * rainIntensity;
    
    return vec4<f32>(stormColor + lightning.rgb, cloudDensity + rainIntensity + lightning.a);
}

// Lightning bolt generation
fn computeLightning(uv: vec2<f32>) -> vec4<f32> {
    let time = uniforms.time;
    let phase = uniforms.lightningPhase;
    
    // Lightning bolt path using noise
    let boltSeed = floor(time * 0.1) * 13.7; // Change bolt pattern periodically
    let boltPath = fbm(vec2<f32>(uv.x * 2.0, boltSeed), 3) * 0.1;
    
    // Vertical lightning bolt
    let boltY = uv.y + boltPath;
    let boltDistance = abs(uv.x - 0.3 - sin(phase * 6.28318) * 0.4);
    
    // Lightning intensity with flickering
    let flicker = sin(time * 50.0 + phase * 20.0) * 0.5 + 0.5;
    let boltIntensity = exp(-boltDistance * 100.0) * flicker;
    
    // Flash effect
    let flash = smoothstep(0.8, 1.0, sin(phase * 6.28318)) * exp(-length(uv - vec2<f32>(0.3, 0.2)) * 2.0);
    
    let lightningColor = vec3<f32>(0.9, 0.95, 1.0) * (boltIntensity + flash * 0.3);
    let lightningAlpha = boltIntensity + flash * 0.1;
    
    return vec4<f32>(lightningColor, lightningAlpha);
}

// Color space conversion for perceptually uniform colors
fn hsl2rgb(hsl: vec3<f32>) -> vec3<f32> {
    let h = hsl.x * 6.0;
    let s = hsl.y;
    let l = hsl.z;
    
    let c = (1.0 - abs(2.0 * l - 1.0)) * s;
    let x = c * (1.0 - abs((h % 2.0) - 1.0));
    let m = l - c * 0.5;
    
    var rgb = vec3<f32>(0.0);
    
    if (h < 1.0) {
        rgb = vec3<f32>(c, x, 0.0);
    } else if (h < 2.0) {
        rgb = vec3<f32>(x, c, 0.0);
    } else if (h < 3.0) {
        rgb = vec3<f32>(0.0, c, x);
    } else if (h < 4.0) {
        rgb = vec3<f32>(0.0, x, c);
    } else if (h < 5.0) {
        rgb = vec3<f32>(x, 0.0, c);
    } else {
        rgb = vec3<f32>(c, 0.0, x);
    }
    
    return rgb + m;
}

// Main fragment shader
@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.uv;
    let time = uniforms.time;
    
    // Adjust UV for aspect ratio
    let aspectRatio = uniforms.resolution.x / uniforms.resolution.y;
    let adjustedUV = vec2<f32>((uv.x - 0.5) * aspectRatio + 0.5, uv.y);
    
    // Dragon silhouette calculation
    let dragonDist = dragonSDF(adjustedUV);
    let dragonMask = 1.0 - smoothstep(-0.02, 0.02, dragonDist);
    
    // Dragon color with hue shift
    let dragonHue = uniforms.hue / 360.0;
    let dragonColor = hsl2rgb(vec3<f32>(dragonHue, 0.6, 0.3)) * dragonMask;
    
    // Dragon glow effect
    let glowDistance = abs(dragonDist);
    let glow = exp(-glowDistance * 20.0) * 0.3;
    let glowColor = hsl2rgb(vec3<f32>(dragonHue, 0.8, 0.6)) * glow;
    
    // Storm effects
    let storm = computeStorm(adjustedUV);
    
    // Smoke/fog using fbm around dragon
    let smokeNoise = fbm((adjustedUV + time * 0.02) * 5.0, 5) * uniforms.smokeDensity;
    let smokeMask = exp(-dragonDist * 3.0) * smokeNoise;
    let smokeColor = vec3<f32>(0.2, 0.3, 0.4) * smokeMask * 0.5;
    
    // Combine all effects
    var finalColor = storm.rgb + dragonColor + glowColor + smokeColor;
    let finalAlpha = max(storm.a, dragonMask * 0.8 + glow + smokeMask * 0.3);
    
    // Apply quality-based effects
    if (uniforms.qualityTier >= 2.0) {
        // High quality: add atmospheric scattering
        let scatter = fbm(adjustedUV * 2.0 + time * 0.01, 3) * 0.1;
        finalColor += vec3<f32>(0.05, 0.08, 0.12) * scatter;
    }
    
    // Tone mapping and gamma correction
    finalColor = finalColor / (finalColor + 1.0); // Reinhard tone mapping
    finalColor = pow(finalColor, vec3<f32>(1.0 / 2.2)); // Gamma correction
    
    return vec4<f32>(finalColor, finalAlpha);
}