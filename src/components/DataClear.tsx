import { useDataStore } from '@/store/useDataStore';
import React from 'react'

const DataClear = () => {
  return (
    <div>
      <button onClick={() => {
  useDataStore.persist.clearStorage(); // <- clear localStorage
  location.reload(); // optional
}}>Clear All Data</button>

    </div>
  )
}

export default DataClear
