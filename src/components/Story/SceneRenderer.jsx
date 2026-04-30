import ContentBlock from './ContentBlock'

export default function SceneRenderer({ scenes, pov }) {
  return (
    <div className="scene-renderer">
      {scenes.map((scene, si) => (
        <div key={scene.id} className="scene">
          {si > 0 && <div className="scene-divider">✦</div>}
          {scene.blocks.map((block, bi) => (
            <ContentBlock key={bi} block={block} pov={pov} />
          ))}
        </div>
      ))}
    </div>
  )
}
