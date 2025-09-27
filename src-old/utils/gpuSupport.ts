/**
 * GPU Capability Detection for Dragon Storm System
 * Detects WebGPU, WebGL2, and compatibility modes with feature validation
 */

export type GPUBackend = 'webgpu' | 'webgl2' | 'none';

export interface GPUCapabilities {
  backend: GPUBackend;
  adapter?: GPUAdapter;
  device?: GPUDevice;
  canvas?: HTMLCanvasElement;
  context?: GPUCanvasContext | WebGL2RenderingContext;
  features: {
    compute: boolean;
    multisampling: boolean;
    timestamp: boolean;
    storageTextures: boolean;
    depthClamping: boolean;
  };
  limits: {
    maxTextureSize: number;
    maxBufferSize: number;
    maxWorkgroupSize: number;
    maxComputeInvocations: number;
  };
  isCompatibilityMode: boolean;
  performanceProfile: 'high' | 'medium' | 'low';
}

/**
 * Primary GPU backend detection with full feature validation
 */
export async function getGPUBackend(): Promise<GPUBackend> {
  // Check WebGPU support
  if ('gpu' in navigator) {
    try {
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
      });
      
      if (adapter) {
        // Test device creation to ensure it actually works
        const device = await adapter.requestDevice({
          requiredFeatures: [],
          requiredLimits: {}
        });
        
        if (device) {
          device.destroy(); // Clean up test device
          return 'webgpu';
        }
      }
    } catch (error) {
      console.warn('WebGPU detection failed:', error);
    }
  }

  // Fallback to WebGL2
  const testCanvas = document.createElement('canvas');
  const webgl2Context = testCanvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
    powerPreference: 'high-performance'
  });

  if (webgl2Context) {
    return 'webgl2';
  }

  // No GPU support
  return 'none';
}

/**
 * Comprehensive GPU capabilities analysis
 */
export async function getGPUCapabilities(): Promise<GPUCapabilities> {
  const backend = await getGPUBackend();
  
  if (backend === 'webgpu') {
    return await getWebGPUCapabilities();
  } else if (backend === 'webgl2') {
    return await getWebGL2Capabilities();
  }
  
  // Fallback for no GPU support
  return {
    backend: 'none',
    features: {
      compute: false,
      multisampling: false,
      timestamp: false,
      storageTextures: false,
      depthClamping: false
    },
    limits: {
      maxTextureSize: 512,
      maxBufferSize: 0,
      maxWorkgroupSize: 0,
      maxComputeInvocations: 0
    },
    isCompatibilityMode: true,
    performanceProfile: 'low'
  };
}

async function getWebGPUCapabilities(): Promise<GPUCapabilities> {
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance'
  });
  
  if (!adapter) {
    throw new Error('WebGPU adapter not available');
  }

  // Detect compatibility mode
  const isCompatibilityMode = adapter.features.has('compatibility');
  
  // Request device with optional features
  const optionalFeatures: GPUFeatureName[] = [
    'timestamp-query',
    'depth-clip-control'
  ];
  
  const availableFeatures = optionalFeatures.filter(feature => 
    adapter.features.has(feature)
  );

  const device = await adapter.requestDevice({
    requiredFeatures: availableFeatures,
    requiredLimits: {
      maxTextureDimension2D: Math.min(8192, adapter.limits.maxTextureDimension2D),
      maxBufferSize: Math.min(256 * 1024 * 1024, adapter.limits.maxBufferSize)
    }
  });

  // Create canvas and context for rendering
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgpu');
  
  if (!context) {
    throw new Error('WebGPU context not available');
  }

  // Configure canvas context
  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'premultiplied',
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  });

  // Determine performance profile
  const performanceProfile = determinePerformanceProfile(adapter.limits, isCompatibilityMode);

  return {
    backend: 'webgpu',
    adapter,
    device,
    canvas,
    context,
    features: {
      compute: true, // WebGPU always has compute
      multisampling: true,
      timestamp: device.features.has('timestamp-query'),
      storageTextures: true,
      depthClamping: device.features.has('depth-clip-control')
    },
    limits: {
      maxTextureSize: adapter.limits.maxTextureDimension2D,
      maxBufferSize: adapter.limits.maxBufferSize,
      maxWorkgroupSize: adapter.limits.maxComputeWorkgroupSizeX,
      maxComputeInvocations: adapter.limits.maxComputeInvocationsPerWorkgroup
    },
    isCompatibilityMode,
    performanceProfile
  };
}

async function getWebGL2Capabilities(): Promise<GPUCapabilities> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
    powerPreference: 'high-performance'
  });

  if (!context) {
    throw new Error('WebGL2 context not available');
  }

  // Check WebGL2 extensions
  const extensions = {
    colorBufferFloat: context.getExtension('EXT_color_buffer_float'),
    textureFilterAnisotropic: context.getExtension('EXT_texture_filter_anisotropic'),
    depthTexture: context.getExtension('WEBGL_depth_texture'),
    drawBuffers: context.getExtension('WEBGL_draw_buffers')
  };

  const maxTextureSize = context.getParameter(context.MAX_TEXTURE_SIZE);
  const maxRenderBufferSize = context.getParameter(context.MAX_RENDERBUFFER_SIZE);
  
  // WebGL2 performance profiling
  const renderer = context.getParameter(context.RENDERER);
  const vendor = context.getParameter(context.VENDOR);
  const isIntegratedGPU = /Intel|integrated/i.test(renderer);
  
  const performanceProfile: 'high' | 'medium' | 'low' = 
    isIntegratedGPU ? 'medium' : 
    maxTextureSize >= 4096 ? 'high' : 'low';

  return {
    backend: 'webgl2',
    canvas,
    context,
    features: {
      compute: false, // WebGL2 doesn't have compute shaders
      multisampling: true,
      timestamp: !!context.getExtension('EXT_disjoint_timer_query_webgl2'),
      storageTextures: false,
      depthClamping: false
    },
    limits: {
      maxTextureSize,
      maxBufferSize: context.getParameter(context.MAX_UNIFORM_BLOCK_SIZE),
      maxWorkgroupSize: 0,
      maxComputeInvocations: 0
    },
    isCompatibilityMode: false,
    performanceProfile
  };
}

function determinePerformanceProfile(
  limits: GPUSupportedLimits, 
  isCompatibilityMode: boolean
): 'high' | 'medium' | 'low' {
  if (isCompatibilityMode) {
    return 'medium';
  }
  
  const hasHighLimits = 
    limits.maxTextureDimension2D >= 8192 &&
    limits.maxBufferSize >= 256 * 1024 * 1024 &&
    limits.maxComputeWorkgroupSizeX >= 256;
  
  return hasHighLimits ? 'high' : 'medium';
}

/**
 * Performance telemetry for frame rate monitoring
 */
export class PerformanceTelemetry {
  private frameTimes: number[] = [];
  private droppedFrames = 0;
  private lastFrameTime = 0;
  private qualityTier: 'high' | 'medium' | 'low' = 'high';
  
  recordFrame() {
    const now = performance.now();
    if (this.lastFrameTime > 0) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimes.push(frameTime);
      
      // Keep only last 60 frames
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }
      
      // Count dropped frames (> 20ms = under 50fps)
      if (frameTime > 20) {
        this.droppedFrames++;
      }
    }
    this.lastFrameTime = now;
    
    // Auto-degrade if too many dropped frames
    if (this.frameTimes.length >= 60 && this.droppedFrames > 10) {
      this.degradeQuality();
      this.droppedFrames = 0; // Reset counter
    }
  }
  
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 16.67; // 60fps default
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }
  
  getAverageFPS(): number {
    return 1000 / this.getAverageFrameTime();
  }
  
  getQualityTier(): 'high' | 'medium' | 'low' {
    return this.qualityTier;
  }
  
  private degradeQuality() {
    if (this.qualityTier === 'high') {
      this.qualityTier = 'medium';
      console.log('🐉 Performance: Degraded to medium quality');
    } else if (this.qualityTier === 'medium') {
      this.qualityTier = 'low';
      console.log('🐉 Performance: Degraded to low quality');
    }
  }
  
  reset() {
    this.frameTimes = [];
    this.droppedFrames = 0;
    this.qualityTier = 'high';
  }
}