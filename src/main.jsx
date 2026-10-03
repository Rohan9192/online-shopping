import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { CollectionProvider } from './context/CollectionContext.jsx'
import { ClothingTypeProvider } from './context/ClothingTypeContext.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CollectionProvider>
        <ClothingTypeProvider>
          <CartProvider>
            <CompareProvider>
              <App />
            </CompareProvider>
          </CartProvider>
        </ClothingTypeProvider>
      </CollectionProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
