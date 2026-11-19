
import { Container, Box, Typography } from '@mui/material'

function withPageLayout(WrappedComponent) {
  function PageWithLayout(props) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Centroid Finder
          </Typography>
        </Box>

        <WrappedComponent {...props} />
      </Container>
    )
  }

  PageWithLayout.displayName =
    `withPageLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return PageWithLayout
}

export default withPageLayout
