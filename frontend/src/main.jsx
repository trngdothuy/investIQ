import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QuestionnaireProvider } from './context/questionnaireContext'
import './index.css'
import './style.css'
import './policy.css'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuestionnaireProvider>
      <RouterProvider router={router} />
    </QuestionnaireProvider>
  </StrictMode>,
)