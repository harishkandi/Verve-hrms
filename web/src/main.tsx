import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/source-serif-4'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '@/core/router'
import { ThemeProvider } from '@/core/theme/ThemeProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
