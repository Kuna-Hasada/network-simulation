import { configureStore } from '@reduxjs/toolkit'
import topologyReducer from './topologySlice'

export const store = configureStore({
  reducer: {
    topology: topologyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
