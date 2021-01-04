/// <reference path="../support/index.d.ts" />
describe('Routing', () => {
  beforeEach(() => {
    cy.intercept("GET", "**/TAMU_BaseMap/**").as("basemap")
    cy.intercept("GET", "**/aggiemap.tamu.edu/**").as("collect")

  })
  it('Open Page', () => {
    cy.visit('https://aggiemap.tamu.edu/map/d/trip')
    cy.wait('@basemap')
    cy.get('canvas')
      .should('be.visible', {timeout: 5000})
  })
  
  it('Check Sidebar Closes - Directions Toggle', () => {
    cy.getDirectionsToggle()
      .click({force: true})
      .click({force: true})
    cy.getSideBar('not.be.visible')
  })
  it('Check Sidebar Opens - Directions Toggle', () => {
    cy.getDirectionsToggle()
      .click({force: true})
    cy.getSideBar('be.visible')
  })
  it('Title Logo', () => {
    cy.checkTitleLogo()
  })
  it('Input1', () => {
    cy.getDirectionsInput('1')
      .click()
    cy.get('.focusable')
      .click()
    cy.get(':nth-child(1) > :nth-child(1) > .input-action-container > .margin-right')
      .should('have.value', 'Getting your location...')
    cy.get(':nth-child(1) > :nth-child(1) > .input-action-container > .margin-right')
      .should('have.value', 'Trigon (Default')
    cy.contains('.title', 'Geolocation failed')
    cy.contains('.description', 'please ensure Aggie Map is allowed to use your location.')
  })
  
  it('Input2', () => {
    cy.getDirectionsInput('2')
      .dblclick()  
    cy.get('.focusable')
      .should('be.visible', {timeout:5000})
      .click()
    cy.get(':nth-child(2) > :nth-child(1) > .input-action-container > .margin-right')
      .should('have.value', 'Getting your location...')
    cy.wait(10000)
    cy.get(':nth-child(2) > :nth-child(1) > .input-action-container > .margin-right')
      .should('have.value', 'Trigon (Default')
    cy.contains('.title', 'Geolocation failed')
    cy.contains('.description', 'please ensure Aggie Map is allowed to use your location.')
  })
  
  it('Options', () => {
    cy.contains('.action', 'Options')
      .click()
    cy.url()
      .should('contain', 'options')
    cy.get('#options-return')
      .click()
  })
})