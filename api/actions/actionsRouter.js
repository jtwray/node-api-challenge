const express = require('express');

const router = express.Router();
const A = require('../../data/helpers/actionModel.js')
const P = require('../../data/helpers/projectModel.js')

router.get('/', (req, res) => {
  // do your magic!

  A.get().then(actions => {
    actions.length === 0 ?
      res.status(200).json({ message: "There aren't any actions." })
      : res.status(200).json({ actions })
  }).catch(error => { res.status(500).json({ error: "There was an error retrieving the  actions from the database." }) })
});
router.get('/:id', (req, res) => {
  // do your magic!

  A.get(req.params.id).then(actions => {
    actions.length === 0 ?
      res.status(200).json({ message: "There aren't any actions associated with that project yet." }) : actions === null ? res.status(400).json({ errorMessage: "Invalid project ID. THere is not project at that ID." })
        : res.status(200).json({ actions })
  }).catch(error => { res.status(500).json({ error: "There was an error retrieving the project and its actions from the database." }) })
});


router.post('/:id', validateProjectID, validateAction, (req, res) => {
  // do your magic!
  A.insert(req.body)
    .then(action => {
      res.status(201)
        .json({ action })
    })
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({
          errorMessage: "There was an error adding the action to a project in the database."
        })
    })

})


router.delete('/:id/', validateActionID, (req, res) => {
  // do your magic!

  A.remove(req.params.id).then(action => { res.status(200).json({ message: `${action} action successfully removed.` }) })

});

router.put('/:id', validateActionID, (req, res) => {
  // do your magic!
  const changes = req.body;

  (changes.name||changes.completed||changes.description||changes.project_id) ?
    A.update(req.params.id, changes)
      .then(actions => {
        actions != null ?
          res.status(200).json([actions])
          :
          res.status(400).json({ errorMessage: "No such action to update." })
      })
    :
    res.status(400).json({ message: "Include updated action description, project_id, notes, and/or completion status." })
      .catch(error => {
        console.error(error); res.status(500).json({ errorMessage: `THere was an error updating the action at that ID .` })
      });
})
  // custom middleware

  function validateProjectID(req, res, next) {
    P.get(req.params.id)
      .then(id => {
        id !== null ? next()
          :
          res.status(400)
            .json({
              error: `There is no project with id:[${req.params.id}].`
            })
      })
  }
  function validateActionID(req, res, next) {
    A.get(req.params.id).then(id => {
      id !== null ? next()
        :
        res.status(400)
          .json({
            error: `There is no project with id:[${req.params.id}].`
          })
    })
  }

  function validateAction(req, res, next) {
    (!req.body.description || !req.body.notes) ?
      res
        .status(400)
        .json({
          errorMessage: "A description and notes are both required to add an Action to an existing Project."
        })
      : next()

  }

  module.exports = router;
