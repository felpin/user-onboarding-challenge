module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true
    },
    "rules": {
        "no-underscore-dangle": ["error", { "allow": ["_id"] }],
        "no-use-before-define": ["error", { "functions": false }]
    }
};