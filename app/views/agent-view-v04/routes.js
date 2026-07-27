//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const version = 'agent-view-v04'

router.post('/agent-view-v04/agent-type', function (req, res) {

  if (req.body.agentType === 'pc') {
    res.redirect('/agent-view-v04/landing-page')
  } else {
    res.redirect('/agent-view-v04/landing-page')
  }

})

// Find someone -> claim record
router.post(`/${version}/find-someone`, (req, res) => {
  return res.redirect(`/${version}/claim-record`)
})


// Claim overview -> personal details
router.post(`/${version}/claim-overview`, (req, res) => {
  return res.redirect(`/${version}/personal-details`)
})

// Personal details -> partner's personal details
router.post(`/${version}/personal-details`, (req, res) => {
  return res.redirect(`/${version}/partner-personal-details`)
})

// partner's personal details -> home details
router.post(`/${version}/partner-personal-details`, (req, res) => {
  return res.redirect(`/${version}/home-details`)
})

// home details -> household details
router.post(`/${version}/home-details`, (req, res) => {
  return res.redirect(`/${version}/household-details`)
})

// household details -> Income
router.post(`/${version}/household-details`, (req, res) => {
  return res.redirect(`/${version}/income-details`)
})

// Income -> Contact details
router.post(`/${version}/income-details`, (req, res) => {
  return res.redirect(`/${version}/contact-details`)
})

// Contact details -> Payment details
router.post(`/${version}/contact-details`, (req, res) => {
  return res.redirect(`/${version}/payment-details`)
})

// Payment details -> task list
router.post(`/${version}/payment-details`, (req, res) => {
  return res.redirect(`/${version}/agent-task-list`)
})

// Award decision -> landing page
router.post('/agent-view-v04/hb-award-decision', (req, res) => {
  req.session.data.caseClosed = true
  req.session.data.housingBenefitDecisionRecorded = 'yes'

  res.redirect('/agent-view-v04/landing-page')
})

router.get('/agent-view-v04/landing-page', (req, res) => {
  const caseClosed = req.session.data.caseClosed
  req.session.data.caseClosed = false
  res.render('agent-view-v04/landing-page', {
    caseClosed
  })
})

// Pension Credit award -> landing page
router.post('/agent-view-v04/pc-awarded', (req, res) => {
  req.session.data.caseClosed = true
  req.session.data.pensionCreditDecisionRecorded = 'yes'

  res.redirect('/agent-view-v04/landing-page')
})

// Supporting evidence question
router.post('/agent-view-v04/supporting-evidence', function (req, res) {

  const supportingEvidenceReceived =
    req.body.supportingEvidenceReceived

  if (supportingEvidenceReceived === 'yes') {
    res.redirect('/agent-view-v04/what-supporting-evidence')
  } else {

    // Mark task as completed
    req.session.data['supportingInformationRecorded'] = 'yes'

    res.redirect('/agent-view-v04/agent-task-list')
  }

})

// What supporting evidence page
router.post('/agent-view-v04/what-supporting-evidence', function (req, res) {

  // Mark task as completed
  req.session.data['supportingInformationRecorded'] = 'yes'

  res.redirect('/agent-view-v04/agent-task-list')

})

router.post('/agent-view-v04/pc-award-decision', function (req, res) {

  const pensionCreditAward = req.body.pensionCreditAward

  // if pc award decision is yes -> check for gc and sc
  req.session.data.pensionCreditDecisionRecorded = 'yes'

  if (pensionCreditAward === 'pc-awarded') {
    res.redirect('/agent-view-v04/pc-awarded')
  } else {
    res.redirect('/agent-view-v04/agent-task-list')
  }

})