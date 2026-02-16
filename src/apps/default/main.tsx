import React from 'react'
import {createRoot} from 'react-dom/client'
import Default from './default.tsx'

const container = document.getElementById('root')!
createRoot(container).render(
    <React.StrictMode>
        <Default/>
    </React.StrictMode>
)
