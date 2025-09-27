"""
Blender Python script: "Icy Snowflake Generator"

How to use:
1. Open Blender (3.0+ recommended).
2. Open the Text Editor, create a new text block, paste this script and set your HDRI path (WORLD_HDPath).
3. Run the script (Run -> Run Script). The snowflake mesh will be created in the scene.
4. To export for the web: File -> Export -> glTF 2.0 (.glb) or run the export at the end of the script (uncomment export lines).

Notes & tuning:
- This produces a 6-fold symmetric snowflake by building a single arm (as a curve), beveling it to a mesh, adding detail with subdivision/displacement, then rotating 6 copies.
- The material uses Principled BSDF with transmission to simulate ice plus procedural bump (Musgrave) for micro-roughness.
- Supply an HDRI image path for good lighting (WORLD_HDRI variable). If you don't have one, the script will add simple lights.

Compatibility: Blender 3.x with Python API (bpy).

"""
import bpy
import bmesh
from math import radians, pi
from mathutils import Vector, Matrix
import os

####### USER-TWEAKABLE PARAMETERS #######
SNOWFLAKE_SCALE = 1.0            # overall size
ARM_THICKNESS = 0.02 * SNOWFLAKE_SCALE
ARM_RESOLUTION = 64              # curve resolution
NUM_ARMS = 6
SUBDIV_LEVELS = 2
DISPLACE_STRENGTH = 0.03 * SNOWFLAKE_SCALE
WORLD_HDRI = ""  # <-- put full path to your HDRI image here, e.g. r"C:\hdri\studio.exr"
EXPORT_GLTF = False  # set True to auto-export to /tmp/snowflake.glb (or change path)
EXPORT_PATH = "/tmp/snowflake.glb"
#########################################

# clear existing objects (optional) - comment out if you want to keep the scene
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)

clear_scene()

# Helper: create a polyline curve from a list of points
def create_curve_from_points(name, points, cyclic=False, bevel_depth=ARM_THICKNESS, resolution=ARM_RESOLUTION):
    curve_data = bpy.data.curves.new(name + "_curve", type='CURVE')
    curve_data.dimensions = '3D'
    spline = curve_data.splines.new(type='POLY')
    spline.points.add(len(points)-1)
    for i, co in enumerate(points):
        spline.points[i].co = (co[0], co[1], co[2], 1)
    spline.use_cyclic_u = cyclic
    curve_data.resolution_u = 12
    curve_obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(curve_obj)
    # apply bevel by using bevel depth
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 4
    curve_data.fill_mode = 'FULL'
    return curve_obj

# Build a branched arm using a few key points (modify for more complex arms)
def make_snowflake_arm(name="Arm"):
    # Define a hand-crafted guide for a snowflake arm as points in X-Y plane
    pts = [
        (0.0, 0.0, 0.0),
        (0.0, 0.2 * SNOWFLAKE_SCALE, 0.0),
        (0.0, 0.5 * SNOWFLAKE_SCALE, 0.0),
        (0.05 * SNOWFLAKE_SCALE, 0.7 * SNOWFLAKE_SCALE, 0.0),
        (0.0, 0.9 * SNOWFLAKE_SCALE, 0.0),
        (0.0, 1.3 * SNOWFLAKE_SCALE, 0.0)
    ]

    main_curve = create_curve_from_points(name + "_main", pts, cyclic=False)

    # create a few side-branches as smaller curves and parent them
    branch_pts = [
        (0.0, 0.35 * SNOWFLAKE_SCALE, 0.0),
        (-0.15 * SNOWFLAKE_SCALE, 0.45 * SNOWFLAKE_SCALE, 0.0),
    ]
    b1 = create_curve_from_points(name + "_branch_L", branch_pts, cyclic=False, bevel_depth=ARM_THICKNESS * 0.6)
    b1.rotation_euler = (0, 0, radians(15))

    branch_pts_r = [
        (0.0, 0.6 * SNOWFLAKE_SCALE, 0.0),
        (0.18 * SNOWFLAKE_SCALE, 0.72 * SNOWFLAKE_SCALE, 0.0),
    ]
    b2 = create_curve_from_points(name + "_branch_R", branch_pts_r, cyclic=False, bevel_depth=ARM_THICKNESS * 0.5)
    b2.rotation_euler = (0, 0, radians(-12))

    # Create a small spiky tip
    tip_pts = [
        (0.0, 1.3 * SNOWFLAKE_SCALE, 0.0),
        (0.03 * SNOWFLAKE_SCALE, 1.45 * SNOWFLAKE_SCALE, 0.0),
        (0.0, 1.55 * SNOWFLAKE_SCALE, 0.0),
    ]
    tip = create_curve_from_points(name + "_tip", tip_pts, cyclic=False, bevel_depth=ARM_THICKNESS * 0.35)

    # Parent all together
    group = bpy.data.collections.new(name + "_collection")
    bpy.context.scene.collection.children.link(group)
    for obj in (main_curve, b1, b2, tip):
        bpy.data.collections[name + "_collection"].objects.link(obj)
        bpy.context.collection.objects.unlink(obj)

    # Convert curves to mesh objects so modifiers apply cleanly later
    objs = [main_curve, b1, b2, tip]
    mesh_objs = []
    for c in objs:
        bpy.context.view_layer.objects.active = c
        c.select_set(True)
        bpy.ops.object.convert(target='MESH')
        mesh_objs.append(bpy.context.active_object)
        c.select_set(False)
    # Join into a single arm mesh
    for o in mesh_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objs[0]
    bpy.ops.object.join()
    arm = bpy.context.active_object
    arm.name = name + "_mesh"

    # Add modifiers for smoothness and micro detail
    arm.modifiers.new(name='Subdivision', type='SUBSURF').levels = SUBDIV_LEVELS
    # Create a displacement texture
    tex = bpy.data.textures.new(name + "_displace_tex", type='MUSGRAVE')
    tex.noise_scale = 0.8
    tex.octaves = 3
    disp = arm.modifiers.new(name='Displace', type='DISPLACE')
    disp.texture = tex
    disp.strength = DISPLACE_STRENGTH
    # Apply a bevel for crisp edges
    bev = arm.modifiers.new(name='Bevel', type='BEVEL')
    bev.width = ARM_THICKNESS * 0.5
    bev.segments = 4

    arm.scale = (1.0, 1.0, 0.8)  # slight flattening for plate-like snowflake
    arm.data.use_auto_smooth = True
    return arm

arm = make_snowflake_arm('SnowArm')

# Create symmetric copies around Z axis
arms = [arm]
for i in range(1, NUM_ARMS):
    copy = arm.copy()
    copy.data = arm.data.copy()
    angle = (2 * pi / NUM_ARMS) * i
    copy.matrix_world = Matrix.Rotation(angle, 4, 'Z') @ arm.matrix_world
    bpy.context.collection.objects.link(copy)
    arms.append(copy)

# Join all arms into one object
for o in arms:
    o.select_set(True)
bpy.context.view_layer.objects.active = arms[0]
bpy.ops.object.join()
snowflake = bpy.context.active_object
snowflake.name = 'Icy_Snowflake'

# Smooth shade
mesh = snowflake.data
for f in mesh.polygons:
    f.use_smooth = True

# Add a final low-strength displacement for micro-roughness using modifier with new texture
final_tex = bpy.data.textures.new('final_micro', type='CLOUDS')
final_disp = snowflake.modifiers.new('FinalDisplace', type='DISPLACE')
final_disp.texture = final_tex
final_disp.strength = DISPLACE_STRENGTH * 0.3

# Create ice material
mat = bpy.data.materials.new(name='Ice_Material')
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
for n in nodes:
    nodes.remove(n)

# Nodes setup
output = nodes.new(type='ShaderNodeOutputMaterial')
principled = nodes.new(type='ShaderNodeBsdfPrincipled')
principled.location = (0, 0)
principled.inputs['Transmission'].default_value = 1.0
principled.inputs['Roughness'].default_value = 0.08
principled.inputs['IOR'].default_value = 1.31
principled.inputs['Specular'].default_value = 0.8
principled.inputs['Clearcoat'].default_value = 0.15
principled.inputs['Clearcoat Roughness'].default_value = 0.05

# Add a Musgrave texture -> bump for micro details
tex_node = nodes.new(type='ShaderNodeTexMusgrave')
tex_node.inputs['Scale'].default_value = 60.0
tex_node.inputs['Detail'].default_value = 2.5

bump = nodes.new(type='ShaderNodeBump')
bump.inputs['Strength'].default_value = 0.12

# Mix subtle bluish tint based on fresnel
fresnel = nodes.new(type='ShaderNodeFresnel')
fresnel.inputs['IOR'].default_value = 1.31
mix = nodes.new(type='ShaderNodeMixRGB')
mix.blend_type = 'MIX'
mix.inputs['Fac'].default_value = 0.25
mix.inputs[2].default_value = (0.86, 0.93, 0.98, 1)  # slight icy-blue

# Connect nodes
links.new(tex_node.outputs['Fac'], bump.inputs['Height'])
links.new(bump.outputs['Normal'], principled.inputs['Normal'])
links.new(principled.outputs['BSDF'], output.inputs['Surface'])
links.new(fresnel.outputs['Fac'], mix.inputs['Fac'])
links.new(mix.outputs['Color'], principled.inputs['Base Color'])

# Assign material
if snowflake.data.materials:
    snowflake.data.materials[0] = mat
else:
    snowflake.data.materials.append(mat)

# Set up world lighting (HDRI) if provided
if WORLD_HDRI and os.path.exists(WORLD_HDRI):
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    world.use_nodes = True
    wn = world.node_tree
    for n in wn.nodes:
        wn.nodes.remove(n)
    tex = wn.nodes.new(type='ShaderNodeTexEnvironment')
    tex.image = bpy.data.images.load(WORLD_HDRI)
    bg = wn.nodes.new(type='ShaderNodeBackground')
    out = wn.nodes.new(type='ShaderNodeOutputWorld')
    wn.links.new(tex.outputs['Color'], bg.inputs['Color'])
    wn.links.new(bg.outputs['Background'], out.inputs['Surface'])
else:
    # Fallback simple lighting: sun + three-point-ish lights
    bpy.ops.object.light_add(type='SUN', location=(5, -5, 8))
    bpy.context.object.data.energy = 3.0
    bpy.ops.object.light_add(type='AREA', location=(-3, 2, 4))
    bpy.context.object.data.energy = 200
    bpy.ops.object.light_add(type='AREA', location=(2, 3, 1))
    bpy.context.object.data.energy = 100

# Camera
cam_data = bpy.data.cameras.new('SnowCam')
cam = bpy.data.objects.new('SnowCam', cam_data)
bpy.context.collection.objects.link(cam)
cam.location = (0, -3.2 * SNOWFLAKE_SCALE, 0.6 * SNOWFLAKE_SCALE)
cam.rotation_euler = (radians(80), 0, 0)

bpy.context.scene.camera = cam

# Optional: decimate for web optimization (commented out; use with care)
#dec = snowflake.modifiers.new('Decimate', type='DECIMATE')
#dec.ratio = 0.6

# Auto-export (if enabled)
if EXPORT_GLTF:
    bpy.ops.export_scene.gltf(filepath=EXPORT_PATH, export_apply=True, export_materials='EXPORT')
    print('Exported to', EXPORT_PATH)

print('Done: Icy snowflake created.')

# End of script

# -----------------------------------------------------------------------------
# For web: Basic three.js snippet (HTML) — paste into your website; uses GLTFLoader
# Note: This HTML snippet is included here as a comment. Copy it into a separate .html file.
# -----------------------------------------------------------------------------

#
# <!DOCTYPE html>
# <html>
# <head>
#   <meta charset="utf-8" />
#   <title>Snowflake GLTF</title>
#   <style>body{margin:0} canvas{display:block}</style>
# </head>
# <body>
# <script type="module">
# import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
# import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
#
# const scene = new THREE.Scene();
# const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100);
# camera.position.set(0, 0, 3);
#
# const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
# renderer.setSize(innerWidth, innerHeight);
# document.body.appendChild(renderer.domElement);
#
# const light = new THREE.DirectionalLight(0xffffff, 1);
# light.position.set(5,5,5);
# scene.add(light);
#
# const loader = new GLTFLoader();
# loader.load('/path/to/snowflake.glb', gltf => {
#   const obj = gltf.scene;
#   obj.rotation.x = Math.PI * 0.0;
#   scene.add(obj);
# }, undefined, err => console.error(err));
#
# function animate(){
#   requestAnimationFrame(animate);
#   scene.rotation.y += 0.002;
#   renderer.render(scene, camera);
# }
# animate();
# </script>
# </body>
# </html>
#
# Replace '/path/to/snowflake.glb' with your exported glb location. Use Draco compression and KTX2 for better performance if needed.