const { Schema, model} = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (e) => validator.isEmail(e),
                message: (props) => `${props.value} is not valid email`
            }
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'thought'
          }
        ],
        friends: [
            {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
      ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    });

userSchema
    .virtual('friendCount')
    .get(function(){
        return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;

