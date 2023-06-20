import React, { useEffect } from 'react'

import './app.css'

function App() {
  const fetchPokedex = async () => {

	}

  useEffect(() => {
    fetchPokedex()
  }, [])

  return (
		<div className="app">
			<h1>Assassin Matcher</h1>
			<div className="assassin">

			</div>
		</div>
  )
}

export default App
