const { User, Thought } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findById({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(400).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: newThought._id } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(newThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const thought = await findOneAndUpdate(
                { _id: req.params.thought_id },
                req.body,
                { new: true, runValidators: true }
            );
            if(!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteThought(req, res){
        try {
            const thought = await Thought.findOneAndDelete(
                { _id: req.params.thoughtId });
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json({ message: "Thought deleted succesfully"});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res){
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}