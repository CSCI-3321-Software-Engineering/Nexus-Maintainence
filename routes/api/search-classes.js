const express = require('express');
var router = express.Router();
const Class = require('../../models/Class');
const User = require('../../models/User');
const mongoose = require('mongoose');
const { hasNull } = require('../../functions/searching');

router.get('/classes', async (req, res, next) => {
    try {
        const query = req.query;
        //const filtering = req;
        //console.log("filtering",filtering)

        //debug
        console.log("===========QUERY==========");
        console.log(req.query);
        //end-debug

        const filter = {};
        if (query.department) {
            filter['department'] = query.department;
        }
        if (query.classID) {
            filter['classID'] = query.classID;
        } else if (query.inputLevel) {
            query.inputLevel = { $regex: '^' + (query.inputLevel) }
            filter['classID'] = query.inputLevel
        }
        if (query.subject) {
            filter['className'] = { $regex: query.subject, $options: 'i' };
        }
        if (query.pathway) {
            filter['pathways'] = query.pathway;
        }
        if (query.credits) {
            filter['credits'] = query.credits;
        }
        //if (query.teacher) {
        //    filter.teacher = query.teacher;
        //}
        // if (query.room) {
        //     filter.room = query.room;
        // }
        if (query.schedule) {
            filter['schedule'] = query.schedule;
        }
        // if (query.semester) {
        //     filter.semester = query.semester;
        // }
        console.log("Filter: ", filter)
        const classes = await Class.find()
            .populate({
                path: 'subject',
                match: filter
            })
            .populate('schedule')
            .populate('room')
            .populate('teacher')

        const filteredClasses = classes.filter(obj => !hasNull(obj));

        var classEntryType = 'partials/classEntries/' + req.session.user.role + 'ClassEntry'
        let students = {}
        for (let c of filteredClasses) {
            for (s of c.students) {
                students[s] = await User.findOne({ _id: s })
            }
        }
        let waitlist = {}
        for (let c of filteredClasses) {
            for (s of c.waitlist) {
                waitlist[s] = await User.findOne({ _id: s })
            }
        }

        res.render(classEntryType, { classes: filteredClasses, students: students, waitlist: waitlist, layout: false }, function (err, html) {
            if (filteredClasses.length > 0) {
                res.send('<div id="classEntry-wrapper">' + html + '</div>');
            } else {
                res.send('No Search Results for the Given Criteria')
            }
        });

    } catch (err) {
        next(err);
    }
});
//GET route for getting subjects from department
router.get('/subjects', async (req, res) => {
    try {
        const { department } = req.query;
        const subjects = await Subject.find({ department });
        res.json(subjects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;