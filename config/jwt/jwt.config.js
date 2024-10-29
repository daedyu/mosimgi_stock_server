const jwt = require('jsonwebtoken');
const JwtExpiryError = require("./JwtExpiryError");
const {json} = require("express");
const key = "ehdgoanfrhkqorentksdlakfmrhekfgehfhrgksmsladlqhdngktkdnflsfkkakstp";

getEmail = (str) => {
    return new Promise((resolve, reject) => {
        jwt.verify(str, key, (err, decoded) => {
            if (decoded.category !== 'access') {
                return reject(new Error("jwt form error"));
            }

            if (!decoded.email) {
                return reject(new Error("jwt form error"));
            }

            if (err) {
                return reject(new JwtExpiryError());
            }

            resolve(decoded.email);
        });
    });
}

module.exports = { getEmail };
