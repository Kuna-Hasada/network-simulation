import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type DeviceType =
  | 'router'
  | 'switch-l2'
  | 'switch-l3'
  | 'firewall'
  | 'server'
  | 'pc'
  | 'laptop'
  | 'ap'
  | 'cloud'
  | 'isp'
  | 'hub'

export type TopologyNode = {
  id: string
  label: string
  type: DeviceType
  x: number
  y: number
}

export type TopologyLink = {
  id: string
  from: string
  to: string
}

export type TopologyState = {
  nodes: TopologyNode[]
  links: TopologyLink[]
  selectedNodeId: string | null
  placementType: DeviceType | null
}

const initialState: TopologyState = {
  nodes: [],
  links: [],
  selectedNodeId: null,
  placementType: null,
}

const topologySlice = createSlice({
  name: 'topology',
  initialState,
  reducers: {
    addNode: {
      reducer: (state, action: PayloadAction<TopologyNode>) => {
        state.nodes.push(action.payload)
      },
      prepare: (partial: Omit<TopologyNode, 'id'>) => ({
        payload: { ...partial, id: nanoid(6) },
      }),
    },
    addLink: {
      reducer: (state, action: PayloadAction<TopologyLink>) => {
        state.links.push(action.payload)
      },
      prepare: (from: string, to: string) => ({
        payload: { id: nanoid(6), from, to },
      }),
    },
    moveNode: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const node = state.nodes.find((item) => item.id === action.payload.id)
      if (node) {
        node.x = action.payload.x
        node.y = action.payload.y
      }
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload
    },
    setPlacementType: (state, action: PayloadAction<DeviceType | null>) => {
      state.placementType = action.payload
    },
  },
})

export const { addNode, addLink, moveNode, selectNode, setPlacementType } = topologySlice.actions
export default topologySlice.reducer
