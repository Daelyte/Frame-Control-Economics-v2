// DragonSkeletonDumper.tsx
import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type DumpOpts = { indent?: string; includeWorldMatrices?: boolean };

function dumpBoneTree(root: THREE.Bone, opts: DumpOpts = {}, depth = 0): string {
  const indent = opts.indent ?? "  ";
  const pad = indent.repeat(depth);
  const pos = new THREE.Vector3(), rot = new THREE.Euler(), scl = new THREE.Vector3(), q = new THREE.Quaternion();
  root.matrix.decompose(pos, q, scl);
  rot.setFromQuaternion(q);

  const line = [
    `${pad}- ${root.name || "(unnamed bone)"}`
  ];

  if (opts.includeWorldMatrices) {
    const wp = new THREE.Vector3(), wr = new THREE.Euler(), ws = new THREE.Vector3(), wq = new THREE.Quaternion();
    root.updateWorldMatrix(true, false);
    root.matrixWorld.decompose(wp, wq, ws);
    wr.setFromQuaternion(wq);
    line.push(
      `  [local pos ${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)} | rot ${THREE.MathUtils.radToDeg(rot.x).toFixed(1)}, ${THREE.MathUtils.radToDeg(rot.y).toFixed(1)}, ${THREE.MathUtils.radToDeg(rot.z).toFixed(1)}]`,
      `  [world pos ${wp.x.toFixed(3)}, ${wp.y.toFixed(3)}, ${wp.z.toFixed(3)}]`
    );
  }

  let out = line.join("");
  for (const child of root.children) {
    if ((child as THREE.Bone).isBone) {
      out += "\n" + dumpBoneTree(child as THREE.Bone, opts, depth + 1);
    }
  }
  return out;
}

/** Find the first skeleton in the scene (first SkinnedMesh with a Skeleton) */
function findSkeleton(root: THREE.Object3D): { skinned: THREE.SkinnedMesh, skeleton: THREE.Skeleton, rootBone: THREE.Bone } | null {
  let found: THREE.SkinnedMesh | null = null;
  root.traverse(obj => {
    if (!found && (obj as THREE.SkinnedMesh).isSkinnedMesh && (obj as THREE.SkinnedMesh).skeleton) {
      found = obj as THREE.SkinnedMesh;
    }
  });
  if (!found) return null;
  const skinned = found!;
  const skeleton = skinned.skeleton!;
  // Prefer skeleton.bones[0].findRoot(), otherwise fall back to skinned.skeleton.bones[0]
  let rootBone = skeleton.bones[0];
  while (rootBone.parent && (rootBone.parent as THREE.Bone).isBone) {
    rootBone = rootBone.parent as THREE.Bone;
  }
  return { skinned, skeleton, rootBone };
}

export default function DragonSkeletonDumper({
  url = "/models/dragon.glb",
  includeWorld = false,
  showHelpers = true
}: { url?: string; includeWorld?: boolean; showHelpers?: boolean }) {
  const { scene } = useGLTF(url);
  const helperRef = useRef<THREE.SkeletonHelper | null>(null);

  const skel = useMemo(() => findSkeleton(scene), [scene]);

  useEffect(() => {
    if (!skel) {
      console.warn("No skeleton found. This model may be static mesh only (no armature).");
      return;
    }
    const text = dumpBoneTree(skel.rootBone, { includeWorldMatrices: includeWorld });
    console.log("=== DRAGON SKELETON ===\n" + text);
    // Also produce plain JSON of bone names and hierarchy:
    const toJSON = (b: THREE.Bone) => ({ name: b.name || "", children: b.children.filter((c:any)=>c.isBone).map(c => toJSON(c as THREE.Bone)) });
    console.log("=== DRAGON SKELETON (JSON) ===\n" + JSON.stringify(toJSON(skel.rootBone), null, 2));
  }, [skel, includeWorld]);

  // Optional: draw bones in-scene
  const helper = useMemo(() => {
    if (!skel || !showHelpers) return null;
    const h = new THREE.SkeletonHelper(skel.rootBone);
    h.name = "DragonSkeletonHelper";
    return h;
  }, [skel, showHelpers]);

  return helper ? <primitive ref={helperRef} object={helper} /> : null;
}

// Usage in your R3F Canvas:
// <Canvas>
//   <Suspense fallback={null}>
//     <DragonSkeletonDumper url="/models/your-dragon.glb" includeWorld={false} showHelpers />
//     <primitive object={/* your loaded dragon scene for rendering */} />
//   </Suspense>
// </Canvas>