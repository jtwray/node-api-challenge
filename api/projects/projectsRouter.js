const express = require('express');


const router = express.Router();

const P = require('../../data/helpers/projectModel.js');

router.get('/', (req, res) => {
    // this is my magic
    P.get()
        .then(projects => {
            projects.length < 0
                ?
                res.status(200)
                    .json({ message: "There aren't any projects yet. Create one! A project needs a Name and a Description." })
                :
                projects.length > 0
                    ?
                    res.status(200)
                        .json(projects)
                    :
                    res.status(500)
                        .json({ errorMessage: "There was an error retrieving projects form teh server." })

        }).catch(error => {
            console.log(error),
                res.status(500)
                    .json({ error: "tucker this is broken kinda" })
        })
})

router.get('/:id', (req, res) => {
    // abra ca dabra
    // const {name,description}
    P.get(req.params.id)
        .then(id => {
            id === null
                ?
                res.status(400)
                    .json({ error: `There is no project with id:[${req.params.id}].` })
                :
                res.status(200)
                    .json(id)
        })
        .catch(error => {
            console.error(error);
            res.status(500)
                .json({ error: `There was an error returning the project with id:[${req.parmas.id}].` })
        })
});

router.delete('/:id', (req, res) => {
    // open ses ame!
    P.remove(req.params.id)
        .then(project => {

            res.status(200)
                .json({ message: 'Project deleted Successfully.', count: project })
        })
        .catch(error => {
            console.error(error);
            res.status(500)
                .json({ error: "There was an error removing the project from the database." });
        });
});

router.post('/', (req, res) => {
    // do your magic!
    P.insert(req.body)
        .then(project => {
            res.status(201)
                .json({
                    project: [project.name.toUpperCase()],
                    number: [project.id],
                    description: [project.description]
                })
        })
        .catch(error => {
            console.error(error);
            res.status(500)
                .json({
                    error: "There was an error adding the project to the database."
                })
        })
});
router.put('/:id', validateID, (req, res) => {
    // do your magic!
    const { id } = req.params;
    const changes = req.body;
    P.update(req.params.id, changes)
        .then(count => {
            req.status(200)
                .json({
                    count,
                    message: "User updated successfully."
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500)
                .json({
                    error: "there was an error updating the project."
                })
        })
});



function validateID(req, res, next) {
    P.get(req.params.id).then(id => {
        id !== null ? next()
            :
            res.status(400)
                .json({
                    error: `There is no project with id:[${req.params.id}].`
                })
    })
}
module.exports = router;