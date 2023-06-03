const { selectTopics, insertTopic } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => res.status(200).send({ topics }));
};

exports.postTopic = async (req, res, next) => {
  try {
    const topic = req.body;
    const newTopic = await insertTopic(topic);
    res.status(201).send({ newTopic });
  } catch (err) {
    next(err);
  }
};
