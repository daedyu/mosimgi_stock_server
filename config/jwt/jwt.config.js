const jwt = require('jsonwebtoken');
const JwtExpiryError = require("./JwtExpiryError");
const key = "ehdgoanfrhkqorentksdlakfmrhekfgehfhrgksmsladlqhdngktkdnflsfkkakstp";

exports.getEmail = (str) => {
    jwt.verify(str, key, (err, decoded) => {
        if (err) {

            throw new JwtExpiryError;
        }

        if (decoded.category !== 'access' ) {
            throw new Error("jwt form error");
        }

        if (decoded.email === null) {
            throw new Error("jwt form error");
        }

        return decoded.email;
    })
}