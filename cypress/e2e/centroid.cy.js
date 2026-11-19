
describe('Centroid Finder Frontend', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/videos', {
      videos: ['test.mp4']
    }).as('getVideos')

    cy.visit('/videos')
    cy.wait('@getVideos')
  })

  it('displays available videos', () => {
    cy.contains('test.mp4').should('be.visible')
  })

  it('navigates to the preview page', () => {
    cy.contains('Preview Video').click()

    cy.url().should('include', '/preview/test.mp4')
    cy.contains('Video Preview').should('be.visible')
  })

  it('allows users to change the threshold', () => {
    cy.contains('Preview Video').click()

    cy.get('input[type="range"]')
      .focus()
      .type('{rightarrow}')

    cy.contains('Threshold: 30').should('not.exist')
  })

  it('resets settings to default values', () => {
    cy.contains('Preview Video').click()

    cy.get('input[type="range"]')
      .focus()
      .type('{rightarrow}')

    cy.contains('Reset Settings').click()

    cy.contains('Threshold: 30').should('be.visible')

    cy.get('input[type="color"]')
      .should('have.value', '#ff0000')
  })
})
