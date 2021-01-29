import { UniqueVerifiableCredential } from '@veramo/data-store'
import React, { useRef, useState } from 'react'
import { Canvas, MeshProps, useFrame } from 'react-three-fiber'
import { Mesh } from 'three'
import { useCredentialModal } from '../../../components/nav/CredentialModalProvider'

const Box: React.FC<MeshProps> = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      // scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      // onClick={(event) => {setActive(!active)}}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function TimelineView(props: { credentials: UniqueVerifiableCredential[] }) {
  const { showCredential } = useCredentialModal()

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> */}

      {props.credentials.map((c, index) => (
        <Box key={c.hash} position={[0, index * 1.3, -1 * index]} onClick={() => showCredential(c.hash)} />
      ))}
    </Canvas>
  )
}

export default TimelineView
