const jwt = require('jsonwebtoken');
const JwtExpiryError = require("./JwtExpiryError");
const {json} = require("express");
const key = "ehdgoanfrhkqorentksdlakfmrhekfgehfhrgksmsladlqhdngktkdnflsfkkakstp";

getEmail = (str) => {
    return new Promise((resolve, reject) => {
        jwt.verify(str, key, (err, decoded) => {
            if (err) {
                return reject(new JwtExpiryError());
            }

            if (decoded.category !== 'access') {
                return reject(new Error("jwt form error"));
            }

            if (!decoded.email) {
                return reject(new Error("jwt form error"));
            }

            resolve(decoded.email);
        });
    });
}

module.exports = { getEmail };
