import ContentBlock from './ContentBlock'

export default function SceneRenderer({ scenes, pov, povAliases, characters, onChoice, currentChoice, hasTag }) {
  return (
    <div className="scene-renderer">
      {scenes.map((scene, si) => (
        <div key={scene.id} className="scene">
          {si > 0 && <div className="scene-divider">✦</div>}
          {scene.blocks.map((block, bi) => (
            <ContentBlock
              key={bi}
              block={block}
              pov={pov}
              povAliases={povAliases}
              characters={characters}
              onChoice={onChoice}
              currentChoice={currentChoice}
              hasTag={hasTag}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
