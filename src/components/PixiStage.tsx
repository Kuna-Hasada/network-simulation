import { Application, Assets, Container, Graphics, Rectangle, Sprite, Text, TextStyle, Texture } from 'pixi.js'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addNode,
  moveNode,
  selectNode,
  setPlacementType,
  type DeviceType,
  type TopologyNode,
} from '../store/topologySlice'
import type { FederatedPointerEvent } from 'pixi.js'
import { deviceIconDataUri } from './deviceIconSvg'

const GRID_SIZE = 32

const nodeTileColor = 0x1e293b

const iconTextureCache = new Map<DeviceType, Texture>()
const iconTypes: DeviceType[] = [
  'router',
  'switch-l2',
  'switch-l3',
  'firewall',
  'server',
  'pc',
  'laptop',
  'ap',
  'cloud',
  'isp',
  'hub',
]

const getIconTexture = (type: DeviceType) => {
  if (!iconTextureCache.has(type)) {
    iconTextureCache.set(type, Texture.from(deviceIconDataUri(type)))
  }
  return iconTextureCache.get(type)!
}

type PixiStageProps = {
  onInspect?: () => void
}

export default function PixiStage({ onInspect }: PixiStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const gridLayerRef = useRef<Container | null>(null)
  const topologyLayerRef = useRef<Container | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [iconsReady, setIconsReady] = useState(false)
  const draggingIdRef = useRef<string | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const nodesRef = useRef<TopologyNode[]>([])
  const placementTypeRef = useRef<DeviceType | null>(null)
  const dispatch = useAppDispatch()
  const nodes = useAppSelector((state) => state.topology.nodes)
  const links = useAppSelector((state) => state.topology.links)
  const selectedNodeId = useAppSelector((state) => state.topology.selectedNodeId)
  const placementType = useAppSelector((state) => state.topology.placementType)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    placementTypeRef.current = placementType
  }, [placementType])

  useEffect(() => {
    let active = true
    const loadIcons = async () => {
      try {
        await Promise.all(
          iconTypes.map(async (type) => {
            if (!iconTextureCache.has(type)) {
              const texture = await Assets.load(deviceIconDataUri(type))
              iconTextureCache.set(type, texture)
            }
          })
        )
        if (active) {
          setIconsReady(true)
        }
      } catch (error) {
        if (active) {
          setIconsReady(true)
        }
      }
    }

    loadIcons()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!hostRef.current || appRef.current) return

    let cancelled = false
    const app = new Application()

    const init = async () => {
      try {
        await app.init({
          resizeTo: hostRef.current ?? window,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1,
          preference: 'webgl',
          failIfMajorPerformanceCaveat: false,
        })
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Unknown Pixi init error'
          setInitError(`Pixi init failed: ${message}`)
        }
        return
      }

      if (cancelled || !hostRef.current) return

      hostRef.current.appendChild(app.canvas)
      appRef.current = app
      setIsReady(true)

      const gridLayer = new Container()
      const topologyLayer = new Container()
      gridLayerRef.current = gridLayer
      topologyLayerRef.current = topologyLayer

      app.stage.addChild(gridLayer)
      app.stage.addChild(topologyLayer)

      app.stage.eventMode = 'static'
      app.stage.hitArea = app.screen

      const handlePointerMove = (event: FederatedPointerEvent) => {
        if (!draggingIdRef.current) return
        const position = event.getLocalPosition(app.stage)
        dispatch(
          moveNode({
            id: draggingIdRef.current,
            x: position.x + dragOffsetRef.current.x,
            y: position.y + dragOffsetRef.current.y,
          })
        )
      }

      const handlePointerDown = (event: FederatedPointerEvent) => {
        const currentPlacement = placementTypeRef.current
        if (!currentPlacement) return
        const position = event.getLocalPosition(app.stage)
        const type = currentPlacement as DeviceType
        const namePrefixMap: Record<DeviceType, string> = {
          router: 'R',
          'switch-l2': 'SW',
          'switch-l3': 'L3',
          firewall: 'FW',
          server: 'SV',
          pc: 'PC',
          laptop: 'LT',
          ap: 'AP',
          cloud: 'CL',
          isp: 'ISP',
          hub: 'HB',
        }
        const namePrefix = namePrefixMap[type] ?? 'ND'
        const nextIndex = nodesRef.current.filter((node) => node.type === type).length + 1
        dispatch(
          addNode({
            type,
            label: `${namePrefix}${nextIndex}`,
            x: position.x,
            y: position.y,
          })
        )
        dispatch(setPlacementType(null))
      }

      const handlePointerUp = () => {
        draggingIdRef.current = null
      }

      app.stage.on('pointermove', handlePointerMove)
      app.stage.on('pointerdown', handlePointerDown)
      app.stage.on('pointerup', handlePointerUp)
      app.stage.on('pointerupoutside', handlePointerUp)

      const drawGrid = () => {
        gridLayer.removeChildren()
        const grid = new Graphics().setStrokeStyle({ width: 1, color: 0x1f2937, alpha: 0.25 })

        const width = app.renderer.width
        const height = app.renderer.height

        for (let x = 0; x <= width; x += GRID_SIZE) {
          grid.moveTo(x, 0)
          grid.lineTo(x, height)
        }

        for (let y = 0; y <= height; y += GRID_SIZE) {
          grid.moveTo(0, y)
          grid.lineTo(width, y)
        }

        gridLayer.addChild(grid)
      }

      drawGrid()
      const handleResize = () => drawGrid()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        app.stage.off('pointermove', handlePointerMove)
        app.stage.off('pointerdown', handlePointerDown)
        app.stage.off('pointerup', handlePointerUp)
        app.stage.off('pointerupoutside', handlePointerUp)
      }
    }

    let removeResize: (() => void) | undefined
    init().then((dispose) => {
      removeResize = dispose
    })
    return () => {
      cancelled = true
      if (appRef.current === app) {
        removeResize?.()
        app.destroy(true)
        appRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const app = appRef.current
    const layer = topologyLayerRef.current
    if (!app || !layer || !isReady) return

    layer.removeChildren()

    const linkGraphics = new Graphics().setStrokeStyle({ width: 2, color: 0x94a3b8, alpha: 0.8 })

    links.forEach((link) => {
      const from = nodes.find((node) => node.id === link.from)
      const to = nodes.find((node) => node.id === link.to)
      if (!from || !to) return

      linkGraphics.moveTo(from.x, from.y)
      linkGraphics.lineTo(to.x, to.y)
    })

    layer.addChild(linkGraphics)

    const packetGraphics = new Graphics()
    layer.addChild(packetGraphics)

    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    const packetState = links.map((link, index) => ({
      id: link.id,
      from: link.from,
      to: link.to,
      t: links.length ? index / links.length : 0,
    }))

    const tick = (delta: number) => {
      packetGraphics.clear()
      packetGraphics.fill({ color: 0xf8fafc })
      packetState.forEach((packet) => {
        const from = nodeMap.get(packet.from)
        const to = nodeMap.get(packet.to)
        if (!from || !to) return
        packet.t = (packet.t + delta * 0.0025) % 1
        const x = from.x + (to.x - from.x) * packet.t
        const y = from.y + (to.y - from.y) * packet.t
        packetGraphics.circle(x, y, 4.5)
      })
    }

    app.ticker.add(tick)

    nodes.forEach((node) => {
      const nodeGraphic = new Graphics()
      const isSelected = node.id === selectedNodeId
      nodeGraphic
        .roundRect(node.x - 30, node.y - 26, 60, 52, 14)
        .fill({ color: nodeTileColor, alpha: 0 })
      nodeGraphic
        .roundRect(node.x - 30, node.y - 26, 60, 52, 14)
        .stroke({
          width: isSelected ? 3 : 2,
          color: isSelected ? 0xf8fafc : 0x475569,
          alpha: isSelected ? 0.9 : 0.7,
        })
      nodeGraphic.eventMode = 'static'
      nodeGraphic.cursor = 'grab'
      nodeGraphic.hitArea = new Rectangle(node.x - 30, node.y - 26, 60, 52)
      nodeGraphic.on('pointerdown', (event: FederatedPointerEvent) => {
        draggingIdRef.current = node.id
        nodeGraphic.cursor = 'grabbing'
        const position = event.getLocalPosition(app.stage)
        dragOffsetRef.current = {
          x: node.x - position.x,
          y: node.y - position.y,
        }
        dispatch(selectNode(node.id))
      })
      nodeGraphic.on('pointertap', (event: FederatedPointerEvent) => {
        if (event.detail === 2) {
          dispatch(selectNode(node.id))
          onInspect?.()
        }
      })
      nodeGraphic.on('pointerup', () => {
        nodeGraphic.cursor = 'grab'
      })
      nodeGraphic.on('pointerupoutside', () => {
        nodeGraphic.cursor = 'grab'
      })

      const label = new Text({
        text: node.label,
        style: new TextStyle({
          fill: 0xe2e8f0,
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Bahnschrift, Candara, Segoe UI, sans-serif',
        }),
      })
      label.anchor.set(0.5)
      label.x = node.x
      label.y = node.y + 34

      if (iconsReady) {
        const icon = new Sprite(getIconTexture(node.type))
        icon.anchor.set(0.5)
        icon.x = node.x
        icon.y = node.y
        icon.width = 32
        icon.height = 32
        icon.tint = 0xffffff
        icon.alpha = isSelected ? 1 : 0.6
        layer.addChild(icon)
      }

      layer.addChild(nodeGraphic)
      layer.addChild(label)
    })
    return () => {
      app.ticker.remove(tick)
    }
  }, [nodes, links, isReady, iconsReady, selectedNodeId, dispatch])

  return (
    <div className="stage" ref={hostRef}>
      {initError ? <p className="muted">{initError}</p> : null}
    </div>
  )
}
