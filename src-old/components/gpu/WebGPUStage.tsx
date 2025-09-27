import React, { useEffect, useRef, useCallback } from 'react';
import { GPUCapabilities, PerformanceTelemetry } from '../../utils/gpuSupport';

// Import WGSL shader as string (we'll need to configure Vite for this)
import dragonWGSL from '../../shaders/dragon.wgsl?raw';

export interface StormControls {
  stormIntensity: number;  // 0.0 - 2.0
  lightningPhase: number;  // 0.0 - 1.0
  smokeDensity: number;    // 0.0 - 1.0
  hue: number;            // 0 - 360
  dragonPosition: [number, number]; // UV coordinates
  dragonScale: number;     // 0.5 - 2.0
}

interface WebGPUStageProps {
  capabilities: GPUCapabilities;
  controls: StormControls;
  telemetry: PerformanceTelemetry;
  className?: string;
  onError?: (error: Error) => void;
}

export const WebGPUStage: React.FC<WebGPUStageProps> = ({
  capabilities,
  controls,
  telemetry,
  className,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderStateRef = useRef<{
    device?: GPUDevice;
    context?: GPUCanvasContext;
    renderPipeline?: GPURenderPipeline;
    uniformBuffer?: GPUBuffer;
    bindGroup?: GPUBindGroup;
    animationId?: number;
    isInitialized: boolean;
  }>({ isInitialized: false });

  const initializeWebGPU = useCallback(async () => {
    if (!canvasRef.current || !capabilities.device || !capabilities.adapter) {
      throw new Error('WebGPU device or canvas not available');
    }

    const canvas = canvasRef.current;
    const device = capabilities.device;
    
    // Get or create context
    const context = canvas.getContext('webgpu');
    if (!context) {
      throw new Error('Failed to get WebGPU context');
    }

    // Configure canvas context
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: presentationFormat,
      alphaMode: 'premultiplied',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // Create shader module
    const shaderModule = device.createShaderModule({
      label: 'Dragon Storm Shader',
      code: dragonWGSL,
    });

    // Create render pipeline
    const renderPipeline = device.createRenderPipeline({
      label: 'Dragon Storm Pipeline',
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{
          format: presentationFormat,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
          },
        }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    // Create uniform buffer
    const uniformBufferSize = 
      2 * 4 + // resolution: vec2<f32>
      1 * 4 + // time: f32
      1 * 4 + // stormIntensity: f32
      1 * 4 + // lightningPhase: f32
      1 * 4 + // smokeDensity: f32
      1 * 4 + // hue: f32
      1 * 4 + // qualityTier: f32
      2 * 4 + // dragonPosition: vec2<f32>
      1 * 4 + // dragonScale: f32
      1 * 4;  // padding

    const uniformBuffer = device.createBuffer({
      label: 'Storm Uniforms',
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create bind group
    const bindGroup = device.createBindGroup({
      label: 'Storm Bind Group',
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      }],
    });

    // Store render state
    renderStateRef.current = {
      device,
      context,
      renderPipeline,
      uniformBuffer,
      bindGroup,
      isInitialized: true,
    };

    console.log('🐉 WebGPU Dragon Stage initialized successfully');
  }, [capabilities]);

  const updateUniforms = useCallback((time: number) => {
    const renderState = renderStateRef.current;
    if (!renderState.isInitialized || !renderState.device || !renderState.uniformBuffer || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const device = renderState.device;
    
    // Quality tier based on performance telemetry
    const qualityTier = telemetry.getQualityTier() === 'high' ? 2.0 : 
                       telemetry.getQualityTier() === 'medium' ? 1.0 : 0.0;

    // Prepare uniform data
    const uniformData = new Float32Array([
      canvas.width, canvas.height,              // resolution
      time * 0.001,                            // time (convert to seconds)
      controls.stormIntensity,                 // stormIntensity
      controls.lightningPhase,                 // lightningPhase
      controls.smokeDensity,                   // smokeDensity
      controls.hue,                           // hue
      qualityTier,                            // qualityTier
      controls.dragonPosition[0], controls.dragonPosition[1], // dragonPosition
      controls.dragonScale,                    // dragonScale
      0.0,                                    // padding
    ]);

    // Update uniform buffer
    device.queue.writeBuffer(renderState.uniformBuffer, 0, uniformData);
  }, [controls, telemetry]);

  const render = useCallback((time: number) => {
    const renderState = renderStateRef.current;
    if (!renderState.isInitialized || !renderState.context || !renderState.renderPipeline || !renderState.bindGroup) {
      return;
    }

    try {
      // Record frame for telemetry
      telemetry.recordFrame();

      // Update uniforms
      updateUniforms(time);

      // Get current texture
      const textureView = renderState.context.getCurrentTexture().createView();

      // Create command encoder
      const commandEncoder = renderState.device!.createCommandEncoder({
        label: 'Dragon Storm Render Commands',
      });

      // Create render pass
      const renderPass = commandEncoder.beginRenderPass({
        label: 'Dragon Storm Render Pass',
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
      });

      // Set pipeline and bind group
      renderPass.setPipeline(renderState.renderPipeline);
      renderPass.setBindGroup(0, renderState.bindGroup);

      // Draw fullscreen quad (3 vertices for triangle trick)
      renderPass.draw(3);
      renderPass.end();

      // Submit command buffer
      renderState.device!.queue.submit([commandEncoder.finish()]);

    } catch (error) {
      console.error('WebGPU render error:', error);
      onError?.(error as Error);
    }
  }, [updateUniforms, telemetry, onError]);

  const animate = useCallback((time: number) => {
    render(time);
    renderStateRef.current.animationId = requestAnimationFrame(animate);
  }, [render]);

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Get container size
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size with device pixel ratio
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    
    // Set CSS size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }, []);

  // Initialize WebGPU on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initializeWebGPU();
        if (mounted) {
          handleResize();
          renderStateRef.current.animationId = requestAnimationFrame(animate);
        }
      } catch (error) {
        console.error('Failed to initialize WebGPU stage:', error);
        if (mounted) {
          onError?.(error as Error);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      const renderState = renderStateRef.current;
      if (renderState.animationId) {
        cancelAnimationFrame(renderState.animationId);
      }
      // Note: WebGPU resources will be cleaned up when device is destroyed
    };
  }, [initializeWebGPU, animate, handleResize, onError]);

  // Handle resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Handle reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      const renderState = renderStateRef.current;
      if (e.matches && renderState.animationId) {
        // Stop animation if user prefers reduced motion
        cancelAnimationFrame(renderState.animationId);
        renderState.animationId = undefined;
      } else if (!e.matches && renderState.isInitialized && !renderState.animationId) {
        // Resume animation
        renderState.animationId = requestAnimationFrame(animate);
      }
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    
    // Initial check
    if (mediaQuery.matches) {
      const renderState = renderStateRef.current;
      if (renderState.animationId) {
        cancelAnimationFrame(renderState.animationId);
        renderState.animationId = undefined;
      }
    }

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`dragon-webgpu-stage ${className || ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
      aria-hidden="true"
    />
  );
};