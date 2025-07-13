// @ts-check

const User = require('../model/user.model.js');

/** @type {ControllerParams} */
const getLogs = (req, res) => {
    const { _id } = req.params;
    const { limit, from, to } = req.query;

    User.findById({ _id })
        .select({
            _id: 1,
            username: 1,
            logs: {
                description: 1,
                duration: 1,
                date: 1
            }
        })
        .then(doc => {
            if (!doc) return res.status(404).json({ error: 'User not found' });

            let log = doc.logs;

            if (from || to) {
                // @ts-expect-error: Should be a string date
                const fromDate = from ? new Date(from) : null;
                // @ts-expect-error: Should be a string date
                const toDate = to ? new Date(to) : null;
                
                // @ts-expect-error: Should be an array
                log = log.filter(l => {
                    // @ts-ignore
                    const logDate = new Date(l.date);
                    return (!fromDate || logDate >= fromDate) && (!toDate || logDate <= toDate);
                })
            }

            if (limit) {
                // @ts-expect-error: Should expect a string of number
                log = log.slice(0, parseInt(limit));
            }

            res.status(200).json({
                _id: doc._id,
                username: doc.username,
                count: log.length,
                log
            });
        })
        .catch(err => res.json({ error: err?.message }))
}

/** @type {ControllerParams} */
const postLogs = (req, res) => {
    let body = '';

    req.on('data', chunk => body += chunk.toString());

    req.on('end', () => {
        const formData = new URLSearchParams(body);
        const { _id } = req.params;
        const description = formData.get('description')?.trim();
        const duration = Number(formData.get('duration')?.trim());
        const due = formData.get('date')?.trim() || new Date();
        const date = new Date(due).toDateString();

        if (!description) return res.status(400).json({ error: 'Missing field description is requiered' });
        if (isNaN(duration)) return res.status(400).json({ error: 'Invalid duration' });


        User.findOneAndUpdate(
            { _id },
            {
                $push: {
                    logs: {
                        description,
                        duration,
                        date
                    }
                }
            },
            { new: true }
        )
            .then(doc => {
                if (!doc) return res.status(404).json({ error: 'User not found' });

                res.status(200).json({
                    username: doc?.username,
                    description,
                    duration,
                    date,
                    _id: doc?._id
                });
            })
            .catch(error => res.status(400).json(error));
    })
}


module.exports = { getLogs, postLogs };

/**
 * @typedef {function(import('express').Request, import('express').Response): any} ControllerParams
 * Type of function params
 */