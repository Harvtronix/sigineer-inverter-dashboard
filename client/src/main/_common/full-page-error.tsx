const FullPageError = ({ children, error }: { children?: any; error?: any }) => {
  return (
    <>
      <h1>Error rendering page</h1>

      {children && <div>{children}</div>}

      {error && (
        <code>
          <pre>{JSON.stringify(error)}</pre>
        </code>
      )}
    </>
  )
}

export default FullPageError
