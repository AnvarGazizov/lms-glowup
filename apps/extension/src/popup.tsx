import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        padding: 16,
        minWidth: 300,
        fontFamily: "system-ui, sans-serif"
      }}>
      <h2>LMS Glowup</h2>
      <p>Welcome to the extension!</p>
      <input
        onChange={(e) => setData(e.target.value)}
        value={data}
        placeholder="Type something..."
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 4,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />
      {data && (
        <p style={{ marginTop: 8, color: "#666" }}>You typed: {data}</p>
      )}
    </div>
  )
}

export default IndexPopup
